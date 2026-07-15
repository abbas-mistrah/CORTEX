/** CORTEX — moteur Apps Script. */
var FOLDER_ID='1M1WWG5u7Lc9PhJKLL8bCZWjpccDEmajw';
var FOLDER_NAME='CORTEX';
var DATA_NAME='cortex-data.json';
var HIST_NAME='histoire.md';

function doGet(){
  var base=HtmlService.createHtmlOutputFromFile('index').getContent();
  var monIa=HtmlService.createHtmlOutputFromFile('MonIA').getContent();
  return HtmlService.createHtmlOutput(base.replace('</body>',monIa+'\n</body>'))
    .setTitle('CORTEX — Ma Mémoire')
    .addMetaTag('viewport','width=device-width, initial-scale=1, interactive-widget=resizes-content');
}

function getFolder_(){
  if(FOLDER_ID){try{var byId=DriveApp.getFolderById(FOLDER_ID);if(!byId.isTrashed())return byId;}catch(e){}}
  var it=DriveApp.getFoldersByName(FOLDER_NAME);while(it.hasNext()){var f=it.next();if(!f.isTrashed())return f;}
  return DriveApp.createFolder(FOLDER_NAME);
}
function getFile_(folder,name){var it=folder.getFilesByName(name),best=null;while(it.hasNext()){var f=it.next();if(f.isTrashed())continue;if(!best||f.getLastUpdated()>best.getLastUpdated())best=f;}return best;}
function loadData(){var f=getFile_(getFolder_(),DATA_NAME);return f?f.getBlob().getDataAsString('UTF-8'):'';}
function saveData(json,histoireMd){var lock=LockService.getScriptLock();lock.waitLock(10000);try{var folder=getFolder_(),f=getFile_(folder,DATA_NAME);if(f)f.setContent(json);else folder.createFile(DATA_NAME,json,'application/json');if(histoireMd!=null){var h=getFile_(folder,HIST_NAME);if(h)h.setContent(histoireMd);else folder.createFile(HIST_NAME,histoireMd,'text/markdown');}return'ok';}finally{lock.releaseLock();}}

var GROQ_URL='https://api.groq.com/openai/v1';
var GROQ_MODEL='meta-llama/llama-4-scout-17b-16e-instruct';
function getKey_(){return PropertiesService.getUserProperties().getProperty('GROQ_API_KEY');}
function setApiKey(k){k=(k||'').trim();if(k)PropertiesService.getUserProperties().setProperty('GROQ_API_KEY',k);return hasApiKey();}
function hasApiKey(){return!!getKey_();}
function clearApiKey(){PropertiesService.getUserProperties().deleteProperty('GROQ_API_KEY');return true;}
function groqChat(systemPrompt,userPrompt,modelOpt){var key=getKey_();if(!key)throw new Error('Aucune clé IA — ajoute-la dans Réglages.');var res=UrlFetchApp.fetch(GROQ_URL+'/chat/completions',{method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+key},payload:JSON.stringify({model:modelOpt?String(modelOpt):GROQ_MODEL,messages:[{role:'system',content:String(systemPrompt||'')},{role:'user',content:String(userPrompt||'')}],temperature:0.3,max_tokens:1400}),muteHttpExceptions:true});var code=res.getResponseCode();if(code===401)throw new Error('Clé IA invalide ou révoquée (401).');if(code<200||code>=300)throw new Error('Groq : erreur '+code);return JSON.parse(res.getContentText()).choices[0].message.content;}

function fetchPage(url){url=String(url||'').trim();if(!/^https?:\/\//i.test(url))throw new Error('Lien invalide.');var t1=tryFetch_(url);if(t1&&!looksLikeWall_(t1))return cap_(t1);var t2=tryFetch_('https://r.jina.ai/'+url);if(t2&&!looksLikeWall_(t2))return cap_(t2);if(t1||t2)throw new Error("Le site n'a montré que sa page de connexion/marketing — la vraie conversation est cachée aux robots. Ouvre-la, Ctrl+A puis Ctrl+C, et colle le texte ici.");throw new Error('Page inaccessible — ce site bloque la lecture automatique. Copie-colle le contenu à la place (Ctrl+A, Ctrl+C).');}
function cap_(t){return t.length>240000?t.slice(0,240000):t;}
function looksLikeWall_(t){var s=t.toLowerCase(),hits=0;['log in','sign up','plans and pricing','se connecter',"s'inscrire",'create account','download the app'].forEach(function(k){if(s.indexOf(k)>=0)hits++;});return hits>=2&&t.length<20000;}
function tryFetch_(u){try{var res=UrlFetchApp.fetch(u,{muteHttpExceptions:true,followRedirects:true,headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36'}}),code=res.getResponseCode();if(code<200||code>=300)return'';var html=res.getContentText();var text=html.replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\\u([0-9a-fA-F]{4})/g,function(m,h){try{return String.fromCharCode(parseInt(h,16));}catch(e){return' ';}}).replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/[ \t]+/g,' ').trim();return text&&text.length>200?text:'';}catch(e){return'';}}

var DOCS_NAME='docs';
function getDocsFolder_(){var parent=getFolder_(),it=parent.getFoldersByName(DOCS_NAME);while(it.hasNext()){var f=it.next();if(!f.isTrashed())return f;}return parent.createFolder(DOCS_NAME);}
function uploadDoc(base64Data,mimeType,fileName){var blob=Utilities.newBlob(Utilities.base64Decode(base64Data),mimeType||'application/octet-stream',fileName||'document');var f=getDocsFolder_().createFile(blob);return JSON.stringify({id:f.getId(),name:f.getName(),url:f.getUrl()});}
function listDocs(){var it=getDocsFolder_().getFiles(),out=[];while(it.hasNext()&&out.length<100){var f=it.next();if(f.isTrashed())continue;var item={id:f.getId(),name:f.getName(),mime:f.getMimeType(),size:f.getSize(),date:f.getLastUpdated().toISOString(),url:f.getUrl()};try{var th=f.getThumbnail();if(th){var bytes=th.getBytes();if(bytes.length<120000)item.thumb='data:'+th.getContentType()+';base64,'+Utilities.base64Encode(bytes);}}catch(e){}out.push(item);}out.sort(function(a,b){return a.date<b.date?1:-1;});return JSON.stringify(out);}
function deleteDoc(id){DriveApp.getFileById(String(id)).setTrashed(true);return'ok';}
function groqTranscribe(base64Audio,mimeType,fileName){var key=getKey_();if(!key)throw new Error('Aucune clé IA — ajoute-la dans Réglages.');var blob=Utilities.newBlob(Utilities.base64Decode(base64Audio),mimeType||'audio/m4a',fileName||'audio.m4a');var res=UrlFetchApp.fetch(GROQ_URL+'/audio/transcriptions',{method:'post',headers:{Authorization:'Bearer '+key},payload:{model:'whisper-large-v3',file:blob,language:'fr'},muteHttpExceptions:true});var code=res.getResponseCode();if(code===401)throw new Error('Clé IA invalide ou révoquée (401).');if(code<200||code>=300)throw new Error('Whisper : erreur '+code);return JSON.parse(res.getContentText()).text;}
