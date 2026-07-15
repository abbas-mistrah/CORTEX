# PASSATION — état complet du projet CORTEX (2026-07-15)

> **Pour toute nouvelle session (cloud/mobile)** : lis d'abord `CLAUDE.md` (règles + architecture), puis CE fichier (histoire récente + état exact + prochaines étapes). Après ça, tu sais tout ce que savait la session PC.

## Qui / style — rappels vitaux
- Abbas Mistrah, pilote transfo IA leboncoin (pro) — CORTEX est son projet PERSO (compte Google perso, GitHub perso MISTRAL2024).
- **Style exigé** : français, court, direct, étapes numérotées, jamais de blabla. Montrer > décrire. Itérations chirurgicales (ne toucher QUE ce qui est demandé). ⚠️ Signaler toute étape qui SEMBLE automatique mais demande une action manuelle.
- Interdits absolus : stocker des mots de passe dans CORTEX ; secrets dans le code ou le dépôt ; grossir la mémoire avec du remplissage.

## Ce qui tourne EN PRODUCTION (téléphone d'Abbas)
- **V18** : app complète + bibliothèque Documents + correctifs d'audit.
- Déploiement Apps Script : projet sur compte Google PERSO. Mise à jour = coller les fichiers puis publier une Nouvelle version.

## Ce qui est PRÊT dans le dépôt et PAS ENCORE déployé
- **V19** : fix quotas Groq, import calibré et garde-fous.
- **Branche `agent/mon-ia-router-rag`** : ajout du chat « Mon IA » multi-modèles avec RAG local CORTEX.

## Brique Mon IA — état exact
1. `webapp/MonIA.html` : remplace visuellement « Parler à l'IA » par « Mon IA » sans changer le design initial ; conversation conservée entre modèles ; ajout de fichiers texte/HTML/CSV/JSON ; transcription audio avec Whisper ; RAG local sur les fiches CORTEX et les documents joints.
2. `webapp/AiRouter.gs` : connexions Groq, API compatible OpenAI, Gemini, Anthropic et agent HTTP ; clés stockées dans `UserProperties`, jamais dans GitHub ; test de connexion ; sessionId stable.
3. OpenClaw et Hermes Agent sont prévus comme runtimes externes via une passerelle HTTP accessible. Ils ne tournent pas à l'intérieur d'Apps Script.
4. `webapp/Code.gs` ne change que de 3 lignes fonctionnelles pour injecter `MonIA.html` dans la page existante.
5. Limites honnêtes de cette V1 : Apps Script n'est pas adapté aux fichiers arbitrairement gros ni à l'exécution locale d'OpenClaw/Hermes. Les gros traitements devront passer par leur passerelle/serveur.

## Backlog priorisé
1. Tester la branche dans une copie Apps Script avant publication.
2. Ajouter lecture PDF directement dans Mon IA, puis OCR pour les PDF scannés.
3. Déployer une passerelle OpenClaw/Hermes et valider leur contrat HTTP.
4. Ajouter l'aperçu avant enregistrement des imports.
5. Import de masse ChatGPT, PWA et wrap-up étendu.

## Journal des sessions
### 2026-07-07 — Session PC
- **Fait** : V18 en prod ; V19 prête ; calibration validée.
- **Décidé** : standard de fiche validé ; garanties dans le code.
- **Reste** : déployer V19 ; aperçu avant enregistrement ; import de masse.

### 2026-07-15 — Session ChatGPT · Mon IA
- **Fait** : branche dédiée créée ; routeur multi-modèles ; interface Mon IA ; RAG local ; clés hors code ; préréglages OpenClaw et Hermes.
- **Décidé** : aucun changement de design ou d'architecture produit ; CORTEX reste gratuit et l'utilisateur fournit ses propres accès.
- **Reste** : test Apps Script réel, correction éventuelle, validation d'Abbas puis déploiement manuel d'une Nouvelle version.
