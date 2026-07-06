# CORTEX — Ma Mémoire (second cerveau d'Abbas)

Tu travailles pour **Abbas Mistrah** (leboncoin/Adevinta, pilote de la transfo IA — projet PERSO ici). Réponds **en français, court, direct, en étapes numérotées — jamais de blabla**. Itérations chirurgicales : ne touche QUE ce qui est demandé. Montre le résultat, ne décris pas.

## C'est quoi
Webapp « second cerveau » : mémoire de vie stockée dans **SON Google Drive** (`CORTEX/cortex-data.json` + `histoire.md` lisible sans l'app = « la Bible » — changer de clé/modèle IA ne doit RIEN perdre). IA = Groq (clé dans UserProperties Apps Script, JAMAIS dans le code).

## Architecture
- `webapp/Code.gs` — moteur Apps Script : doGet sert `index`, loadData/saveData (Drive + LockService), groqChat(system,user,modelOpt), groqTranscribe (Whisper), fetchPage (+ fallback Jina), uploadDoc/listDocs/deleteDoc (fichiers réels dans `CORTEX/docs/` avec vignettes).
- `webapp/index.html` — client single-file ES5 : 5 types de fiches (📖 Histoire ambre · 📄 Documents bleu · 📌 Instructions teal · ✨ Prompts rose · 💡 Connaissances violet) + domaines de vie auto-détectés, carte mentale « Synapse » (fond clair, ambre #f59e0b + violet #7c5cff), localStorage + couche cloud (cloudReady, savedAt = le plus récent gagne, retry, flush sur pagehide).
- Déploiement : projet Apps Script sur son **compte Google PERSO** → Déployer → Gérer les déploiements → ✏️ → Nouvelle version (URL /exec inchangée, celle du téléphone). UN seul déploiement actif.

## Règles produit NON NÉGOCIABLES
1. **Import = LE MINIMUM, complètement compréhensible** : 1 conversation = 1 fiche Histoire (UNE ligne dense, datée, nominative) ; ses colères = Instructions (max 3, avec citation « … » — le code jette celles sans citation) ; Prompt seulement si texte recopiable tel quel ; 0 fiche = réponse valable (triage). Histoire et Connaissance EXCLUSIVES.
2. **Vitesse + stabilité visuelle** : local-first, rien ne bouge pendant la frappe (mode calme), chat verrouillé façon WhatsApp.
3. **Quotas Groq** : morceaux d'import de 20 000 chars max, retry auto 50 s sur erreur 413/429 (l'erreur 413 tuait tout import long — ne jamais remonter la taille).
4. **JAMAIS de mots de passe/credentials stockés dans CORTEX** (refus définitif, recommander un password manager).
5. Ne jamais casser : dédup Jaccard ensembliste (les chiffres différents ne fusionnent jamais), importHashes anti-réimport, fusion avant création.

## État (2026-07-06)
- **V18 en production** (bibliothèque Documents + 13 correctifs d'audit).
- **V19 prête dans ce dépôt** (correctif quotas + prompt d'import v10.4 calibré sur exemple validé par Abbas + garde-fous code) — à coller dans l'éditeur Apps Script puis « Nouvelle version ».
- Backlog : import de masse ChatGPT (export ZIP), aperçu avant enregistrement (✅ Garder/✏️ Corriger/🗑️ Jeter), PWA icône téléphone, wrap-up relié NotebookLM/Gemini, rotation clé n8n.

## Interdits techniques
- Pas de secrets dans le code ni dans ce dépôt (backend/, deploy/ restent hors git — liste blanche dans .gitignore).
- Vérifier la syntaxe avant de livrer : extraire le <script> de index.html → `node --check`.
