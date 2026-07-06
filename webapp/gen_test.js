const fs = require("fs");
const dir = "C:/Users/abbas.mistrah.ext/CORTEX/webapp/";
const gs = fs.readFileSync(dir + "Code.gs", "utf8");
const idx = fs.readFileSync(dir + "index.html", "utf8");
const raw = fs.readFileSync(dir + "calib_conv1.txt", "utf8");

const m = idx.match(/var PROMPT='(?:[^'\\]|\\.)*';/);
if (!m) throw new Error("PROMPT introuvable");
let PROMPT;
eval(m[0].replace("var PROMPT", "PROMPT"));
if (PROMPT.indexOf("EXEMPLE DU NIVEAU ATTENDU") < 0) throw new Error("pas le v10 !");

const ck = []; let pos = 0;
while (pos < raw.length && ck.length < 4) { ck.push(raw.slice(pos, Math.min(pos + 20000, raw.length))); pos += 20000 }

const gsMod = gs.replace("function doGet()", "function doGet_off()");
const NL = 'String.fromCharCode(10)';
const NL2 = 'String.fromCharCode(10,10)';

const test = `

/* ═══ TEST CALIBRATION v10 — à supprimer après ═══ */
function TEST_calib() {
  var PROMPT = ${JSON.stringify(PROMPT)};
  var chunks = [${ck.map(c => JSON.stringify(c)).join(",\n")}];
  var answers = [];
  for (var i = 0; i < chunks.length; i++) {
    try {
      answers.push(groqChat(PROMPT, "Voici la partie " + (i + 1) + "/" + chunks.length + " du contenu à archiver. Ne traite QUE cette partie :" + ${NL2} + chunks[i], "llama-3.3-70b-versatile"));
    } catch (e) {
      answers.push("[ERREUR partie " + (i + 1) + " : " + (e.message || e) + "]");
    }
    if (i < chunks.length - 1) Utilities.sleep(45000);
  }
  Logger.log("=== REPONSES PARTIELLES ===");
  for (var j = 0; j < answers.length; j++) Logger.log("----- partie " + (j + 1) + " -----" + ${NL} + answers[j]);
  Utilities.sleep(30000);
  var fin = "";
  try {
    fin = groqChat(PROMPT, "Voici plusieurs résumés PARTIELS du même contenu. Fusionne-les en UN SEUL résumé au format exact : UNE fiche essentielle (une seule ligne dense, jamais de puces) + les instructions durables (3 max) + éventuellement UN prompt :" + ${NL2} + answers.join(${NL2}), "llama-3.3-70b-versatile");
  } catch (e) {
    fin = "[ERREUR consolidation : " + (e.message || e) + "]";
  }
  Logger.log("=== RESULTAT FINAL v10 ===" + ${NL} + fin);
}
function doGet(){TEST_calib()}
`;

fs.writeFileSync(dir + "Code_test.gs", gsMod + test, "utf8");
console.log("Code_test.gs:", (gsMod + test).length, "chars | chunks:", ck.map(c => c.length).join("+"));
