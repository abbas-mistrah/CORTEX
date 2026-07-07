#!/bin/bash
# Verrou de clôture CORTEX : impossible de terminer une session avec du travail non sauvegardé.
# La session est bloquée et doit : journaliser dans PASSATION.md + commit + push. Automatique, zéro action d'Abbas.
input=$(cat)
# anti-boucle : si on est déjà dans une continuation forcée, on laisse sortir
if echo "$input" | grep -q '"stop_hook_active":true'; then exit 0; fi
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
dirty=$(git status --porcelain 2>/dev/null)
unpushed=$(git log --oneline @{u}.. 2>/dev/null)
if [ -n "$dirty" ] || [ -n "$unpushed" ]; then
  echo '{"decision":"block","reason":"CLOTURE AUTOMATIQUE CORTEX — du travail n est pas sauvegardé. Avant de terminer, fais dans l ordre : 1) ajoute une entrée datée (Fait / Décidé / Reste, 3-6 lignes) dans la section Journal des sessions de PASSATION.md ; 2) git add -A && git commit -m \"journal de session\" ; 3) git push. Ensuite seulement, termine."}'
  exit 0
fi
exit 0
