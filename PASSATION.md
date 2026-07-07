# PASSATION — état complet du projet CORTEX (2026-07-07)

> **Pour toute nouvelle session (cloud/mobile)** : lis d'abord `CLAUDE.md` (règles + architecture), puis CE fichier (histoire récente + état exact + prochaines étapes). Après ça, tu sais tout ce que savait la session PC.

## Qui / style — rappels vitaux
- Abbas Mistrah, pilote transfo IA leboncoin (pro) — CORTEX est son projet PERSO (compte Google perso, GitHub perso MISTRAL2024).
- **Style exigé** : français, court, direct, étapes numérotées, jamais de blabla. Montrer > décrire. Itérations chirurgicales (ne toucher QUE ce qui est demandé). ⚠️ Signaler toute étape qui SEMBLE automatique mais demande une action manuelle (il s'est fait piéger par une invitation GitHub à accepter).
- Interdits absolus : stocker des mots de passe dans CORTEX (refusé définitivement) ; secrets dans le code ou le dépôt ; grossir la mémoire avec du remplissage.

## Ce qui tourne EN PRODUCTION (téléphone d'Abbas)
- **V18** (déployée 05/07 22:51, vérifiée en prod) : app complète + bibliothèque Documents (upload sans formulaire, couvertures/vignettes, corbeille Drive) + 13 correctifs d'audit (dédup Jaccard ensembliste, digitDiff, merge sans perte, hash anti-réimport, sync sans écrasement…).
- Déploiement Apps Script : projet sur compte Google PERSO, ID `13C6oF33eth09PE-BVXsS3b3f_cGeVKH5mbbKec_BspRmfGgAZvp5r1KD`. UN seul déploiement actif (ID …JSoJNx = l'URL /exec du téléphone). Mise à jour = éditeur → coller les fichiers → Déployer → Gérer les déploiements → ✏️ → Nouvelle version (URL inchangée).

## Ce qui est PRÊT dans ce dépôt et PAS ENCORE déployé : la V19
`webapp/index.html` (108 926 chars, syntaxe vérifiée) + `webapp/Code.gs` (inchangé, 9 161) :
1. **Fix quotas Groq** : l'import découpait en morceaux de 60k → « erreur 413 » sur TOUT import long (bug prod découvert au banc d'essai). V19 : morceaux de 20 000, max 12, + retry automatique 50 s sur erreur 413/429/5xx (bouton « ⏳ Pause quotas IA (50 s)… »), consolidation incluse.
2. **Prompt d'import v10.4 calibré** : testé 3 fois sur une vraie conversation d'Abbas (moteur réel, sa clé, llama-3.3-70b). Standard VALIDÉ par Abbas : 1 fiche HISTOIRE datée sur UNE ligne dense nominative (son exemple-or est gravé dans le prompt) ; ses colères = INSTRUCTIONS (max 3, format citation « ses mots » → règle) ; PROMPT seulement si texte recopiable tel quel ; HISTOIRE/CONNAISSANCE exclusives ; 0 fiche = valable (triage).
3. **Garde-fous CODE (leçon clé : les garanties vont dans le code, pas le prompt — le modèle varie d'un run à l'autre)** : doImport jette toute instruction sans citation « … » ; jusqu'à 3 instructions ; le client préfère HISTOIRE ; la consolidation exige HISTOIRE si un partiel en contient une.
- **Déployer la V19 = geste PC** (une session cloud ne peut pas toucher l'éditeur Apps Script) : coller index.html dans l'éditeur, enregistrer, Nouvelle version. La session PC a le presse-papiers déjà chargé.

## Verdicts du banc d'essai (pour ne pas refaire les erreurs)
- v9 (avant) : bouillie de 8 puces génériques en Connaissance → exactement ce qu'Abbas refusait.
- v10 : bonne Histoire mais fuite du prompt dans les instructions + double Histoire/Connaissance.
- v10.1–v10.2 : tiroir + exclusivité corrigés ; le modèle remplissait encore Instructions avec des décisions projet.
- v10.3 : preuve de la variance (le tiroir a flippé) → d'où les garde-fous code de v10.4.
- Le corpus de test (conversation leboncoin) reste sur le PC (`webapp/calib_conv1.txt`, JAMAIS poussé — contenu employeur). Générateurs de test : `webapp/gen_test.js`, `webapp/gen_payloads.js`.

## Backlog priorisé (validé avec Abbas)
1. **Aperçu avant enregistrement** : l'import montre les fiches proposées avec ✅ Garder / ✏️ Corriger / 🗑️ Jeter — rien n'entre sans son accord (confiance = contrôle).
2. **Import de masse ChatGPT** : export ZIP (conversations.json, vraies dates) → liste à cocher → pipeline par conversation (attention quotas : espacer les appels), hash anti-doublon déjà en place. NE PAS lancer avant validation de l'aperçu — il veut importer des MILLIERS de conversations sans bordel.
3. **PWA** : icône sur l'écran d'accueil du téléphone.
4. **Wrap-up étendu** : sa vision = relier la clôture de session à NotebookLM/Gemini (résumés auto, vidéos, sans dépenser de tokens). Un skill `/wrap-up` local existe déjà sur son PC (bilan + fiche CORTEX au format ### à coller dans l'import manuel).
5. Rotation clé n8n (sécurité, jamais faite) ; nettoyage des ~7 déploiements archivés ; OCR PDF scannés ; audio long via VPS.

## Pièges techniques connus (ne pas re-découvrir)
- Groq (son offre) : ~12k tokens/min sur llama-3.3-70b → jamais remonter les morceaux au-dessus de 20k chars ; toujours prévoir le retry.
- Le PC pro (Adevinta) ne peut PAS ouvrir l'app /exec (politique d'entreprise) — les tests UI se font sur SON téléphone uniquement.
- Apps Script : les exécutions éditeur tournent sur la fonction SÉLECTIONNÉE dans la barre d'outils (piège doGet) ; le déploiement versionné fige le code (modifier l'éditeur n'affecte pas la prod tant qu'on ne publie pas de Nouvelle version).
- parseImport accepte les en-têtes ### HISTOIRE/INSTRUCTION/PROMPT/CONNAISSANCE ; le champ 2 du modal d'import = entrée manuelle qui contourne le hash anti-réimport.

## Prochaine étape recommandée
Brique « aperçu avant enregistrement » (backlog #1) : concevoir l'UI (cartes proposées avec 3 boutons, mode calme, rien ne bouge pendant la frappe) + brancher sur doImport. Puis re-test import réel, puis V20.
