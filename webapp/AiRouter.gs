var AI_CONNECTIONS_KEY='CORTEX_AI_CONNECTIONS_V1';

function aiProps_(){return PropertiesService.getUserProperties();}
function aiRead_(){try{return JSON.parse(aiProps_().getProperty(AI_CONNECTIONS_KEY)||'[]');}catch(e){return [];}}
function aiWrite_(list){aiProps_().setProperty(AI_CONNECTIONS_KEY,JSON.stringify(list||[]));}
function aiId_(){return 'ai_'+Utilities.getUuid().replace(/-/g,'').slice(0,16);}
function aiSafe_(c){return {id:c.id,name:c.name,type:c.type,preset:c.preset||'',model:c.model,endpoint:c.endpoint||'',hasKey:!!c.apiKey,ready:!!(c.endpoint||c.type==='gemini'||c.type==='anthropic')};}

function listAiConnections(){return JSON.stringify(aiRead_().map(aiSafe_));}
function saveAiConnection(json){var c=JSON.parse(json||'{}');if(!c.name||!c.model)throw new Error('Nom et modèle obligatoires.');var list=aiRead_();c.id=c.id||aiId_();c.type=String(c.type||'openai');c.endpoint=String(c.endpoint||'').replace(/\/+$/,'');c.apiKey=String(c.apiKey||'');var found=false;for(var i=0;i<list.length;i++){if(list[i].id===c.id){if(!c.apiKey)c.apiKey=list[i].apiKey||'';list[i]=c;found=true;break;}}if(!found)list.push(c);aiWrite_(list);return JSON.stringify(aiSafe_(c));}
function deleteAiConnection(id){var list=aiRead_().filter(function(c){return c.id!==String(id);});aiWrite_(list);return true;}
function aiFind_(id){var list=aiRead_();for(var i=0;i<list.length;i++)if(list[i].id===String(id))return list[i];throw new Error('Connexion IA introuvable.');}

function testAiConnection(json){var c=JSON.parse(json||'{}');var req={system:'Réponds uniquement OK.',messages:[{role:'user',content:'Test'}],maxTokens:8,temperature:0,sessionId:'test'};return aiCall_(c,req);}
function cortexAiChat(connectionId,requestJson){var c=aiFind_(connectionId),r=JSON.parse(requestJson||'{}');return aiCall_(c,r);}

function aiFetchJson_(url,opt){opt=opt||{};opt.muteHttpExceptions=true;var res=UrlFetchApp.fetch(url,opt),code=res.getResponseCode(),txt=res.getContentText();if(code<200||code>=300){var msg='';try{var j=JSON.parse(txt);msg=(j.error&&(j.error.message||j.error))||j.message||'';}catch(e){}throw new Error('IA '+code+(msg?' — '+msg:''));}try{return JSON.parse(txt);}catch(e){throw new Error('Réponse IA invalide.');}}
function aiMessages_(r){var out=[];if(r.system)out.push({role:'system',content:String(r.system)});(r.messages||[]).forEach(function(m){out.push({role:m.role==='assistant'?'assistant':'user',content:String(m.content||'')});});return out;}
function aiCall_(c,r){if(!c||!c.type)throw new Error('Connexion invalide.');if(c.type==='gemini')return aiGemini_(c,r);if(c.type==='anthropic')return aiAnthropic_(c,r);if(c.type==='agent')return aiAgent_(c,r);return aiOpenAI_(c,r);}

function aiOpenAI_(c,r){if(!c.endpoint)throw new Error('Endpoint manquant.');var url=c.endpoint.replace(/\/+$/,'')+'/chat/completions';var payload={model:c.model,messages:aiMessages_(r),temperature:r.temperature==null?0.25:r.temperature,max_tokens:r.maxTokens||2200};var headers={};if(c.apiKey)headers.Authorization='Bearer '+c.apiKey;var j=aiFetchJson_(url,{method:'post',contentType:'application/json',headers:headers,payload:JSON.stringify(payload)});return (((j.choices||[])[0]||{}).message||{}).content||'';}

function aiGemini_(c,r){if(!c.apiKey)throw new Error('Clé Gemini manquante.');var url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(c.model)+':generateContent?key='+encodeURIComponent(c.apiKey);var parts=[];(r.messages||[]).forEach(function(m){parts.push({role:m.role==='assistant'?'model':'user',parts:[{text:String(m.content||'')}]});});if(r.system)parts.unshift({role:'user',parts:[{text:String(r.system)}]});var j=aiFetchJson_(url,{method:'post',contentType:'application/json',payload:JSON.stringify({contents:parts,generationConfig:{temperature:r.temperature==null?0.25:r.temperature,maxOutputTokens:r.maxTokens||2200}})});return (((((j.candidates||[])[0]||{}).content||{}).parts||[])[0]||{}).text||'';}

function aiAnthropic_(c,r){if(!c.apiKey)throw new Error('Clé Anthropic manquante.');var url=(c.endpoint||'https://api.anthropic.com/v1').replace(/\/+$/,'')+'/messages';var msgs=(r.messages||[]).map(function(m){return {role:m.role==='assistant'?'assistant':'user',content:String(m.content||'')};});var j=aiFetchJson_(url,{method:'post',contentType:'application/json',headers:{'x-api-key':c.apiKey,'anthropic-version':'2023-06-01'},payload:JSON.stringify({model:c.model,system:String(r.system||''),messages:msgs,max_tokens:r.maxTokens||2200,temperature:r.temperature==null?0.25:r.temperature})});return ((j.content||[])[0]||{}).text||'';}

function aiAgent_(c,r){if(!c.endpoint)throw new Error('Passerelle agent manquante.');var body={agent:c.preset||c.model,model:c.model,sessionId:r.sessionId||('cortex-'+c.id),system:r.system||'',messages:r.messages||[],images:r.images||[],maxTokens:r.maxTokens||2200};var headers={};if(c.apiKey)headers.Authorization='Bearer '+c.apiKey;var j=aiFetchJson_(c.endpoint,{method:'post',contentType:'application/json',headers:headers,payload:JSON.stringify(body)});return String(j.answer||j.response||j.content||j.message||'');}
