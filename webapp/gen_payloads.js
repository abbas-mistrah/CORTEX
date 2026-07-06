const fs = require("fs");
const dir = "C:/Users/abbas.mistrah.ext/CORTEX/webapp/";
const idx = fs.readFileSync(dir + "index.html", "utf8");
const raw = fs.readFileSync(dir + "calib_conv1.txt", "utf8").slice(0, 40000);

const m = idx.match(/var PROMPT='(?:[^'\\]|\\.)*';/);
if (!m) throw new Error("PROMPT introuvable");
let PROMPT;
eval(m[0].replace("var PROMPT", "PROMPT"));
if (PROMPT.indexOf("EXEMPLE DU NIVEAU ATTENDU") < 0) throw new Error("pas v10");

function djb2(s) { let h = 5381; for (let i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0 } return h }

const c1 = raw.slice(0, 20000), c2 = raw.slice(20000);

// payload 1 et 2 : accumulation du texte brut avec vérif len+hash cumulés
fs.writeFileSync(dir + "p1.txt",
  'window.__c=' + JSON.stringify(c1) + ';(function(){var s=window.__c,h=5381;for(var i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0}return "len="+s.length+" hash="+h})()');
fs.writeFileSync(dir + "p2.txt",
  'window.__c=window.__c+' + JSON.stringify(c2) + ';(function(){var s=window.__c,h=5381;for(var i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0}return "len="+s.length+" hash="+h})()');

// payload 3 : chirurgie — construit le TEST v10 dans l'éditeur à partir du modèle 9161 + window.__c
const NL = "String.fromCharCode(10)";
const NL2 = "String.fromCharCode(10,10)";
const surgery =
  '(function(){' +
  'var m=null;monaco.editor.getModels().forEach(function(x){if(x.getValue().length===9161)m=x});' +
  'if(!m)return "modele 9161 introuvable";' +
  'if(!window.__c||window.__c.length!==40000)return "conversation absente: "+((window.__c||"").length);' +
  'var NL=String.fromCharCode(10);' +
  'var P=' + JSON.stringify(JSON.stringify(PROMPT)) + ';' +
  'var body=[' +
  '"","/* TEST CALIBRATION v10 */",' +
  '"var __CONV="+JSON.stringify(window.__c)+";",' +
  '"function TEST_calib(){",' +
  '"  var PROMPT="+P+";",' +
  '"  var chunks=[__CONV.slice(0,20000),__CONV.slice(20000)];",' +
  '"  var answers=[];",' +
  '"  for(var i=0;i<chunks.length;i++){",' +
  '"    try{answers.push(groqChat(PROMPT,\\"Voici la partie \\"+(i+1)+\\"/\\"+chunks.length+\\" du contenu a archiver. Ne traite QUE cette partie :\\"+String.fromCharCode(10,10)+chunks[i],\\"llama-3.3-70b-versatile\\"))}catch(e){answers.push(\\"[ERREUR partie \\"+(i+1)+\\" : \\"+(e.message||e)+\\"]\\")}",' +
  '"    if(i<chunks.length-1)Utilities.sleep(45000);",' +
  '"  }",' +
  '"  Logger.log(\\"=== PARTIELS v10 ===\\");",' +
  '"  for(var j=0;j<answers.length;j++)Logger.log(\\"----- partie \\"+(j+1)+\\" -----\\"+String.fromCharCode(10)+answers[j]);",' +
  '"  Utilities.sleep(30000);",' +
  '"  var fin=\\"\\";",' +
  '"  try{fin=groqChat(PROMPT,\\"Voici plusieurs resumes PARTIELS du meme contenu. Fusionne-les en UN SEUL resume au format exact : UNE fiche essentielle (une seule ligne dense, jamais de puces) + les instructions durables (3 max) + eventuellement UN prompt :\\"+String.fromCharCode(10,10)+answers.join(String.fromCharCode(10,10)),\\"llama-3.3-70b-versatile\\")}catch(e){fin=\\"[ERREUR consolidation : \\"+(e.message||e)+\\"]\\"}",' +
  '"  Logger.log(\\"=== RESULTAT FINAL v10 ===\\"+String.fromCharCode(10)+fin);",' +
  '"}",' +
  '"function doGet(){TEST_calib()}",""' +
  '].join(NL);' +
  'var v=m.getValue().replace("function doGet()","function doGet_off()")+body;' +
  'm.setValue(v);var nv=m.getValue();var h=5381;for(var i=0;i<nv.length;i++){h=((h<<5)+h+nv.charCodeAt(i))|0}' +
  'return "CHIRURGIE OK len="+nv.length+" hash="+h+" conv="+(nv.indexOf("__CONV")>=0)+" v10="+(nv.indexOf("EXEMPLE DU NIVEAU ATTENDU")>=0);' +
  '})()';
fs.writeFileSync(dir + "p3.txt", surgery);

console.log("attendu p1: len=20000 hash=" + djb2(c1));
console.log("attendu p2: len=40000 hash=" + djb2(raw));
console.log("tailles payloads:", fs.statSync(dir + "p1.txt").size, fs.statSync(dir + "p2.txt").size, fs.statSync(dir + "p3.txt").size);
