

## Agentic OS — vault-first session protocol

This repo is part of Manny's Agentic OS. The BRAIN is the manny-ai-os Markdown vault:
  VAULT = /Users/mannydearaujo/Documents/Codex/2026-07-07/ana/manny-ai-os
  (canonical value: VAULT_PATH in /Users/mannydearaujo/Agentic OS Build/config/os.config)

Your project record is `VAULT/01-projects/<project>/`, matched by repo name:
  northatlasstudio → north-atlas-studio      goldenpaws → golden-paws-website
  golden-paws-dashboard → golden-paws-dashboard   alpha-gutter → alpha-gutter-website

### START — read before touching anything
1. Read `VAULT/00-brain/SOURCE-OF-TRUTH.md` (ordering + safety rules).
2. Read this project's `VAULT/01-projects/<project>/`: CURRENT-STATE.md, then TASKS.md,
   HANDOFF.md, CONTEXT.md. That is the truth for context, decisions, and open work.
3. Read this repo's local AGENTS.md (Codex) / CLAUDE.md (Claude).
4. If `graphify-out/graph.json` exists, use `graphify query/path/explain` before broad file reads.
5. Restate the current state + top open tasks, and confirm the task, before changing code.

### END — after any meaningful work, keep the vault fresh
1. Append to CURRENT-STATE.md "Recent Work": dated, 1–2 lines on what changed (commits/PRs/URLs).
2. Update TASKS.md (check off done, add new) and HANDOFF.md (what the next session must know).
3. Move finished/decided items out of "Open Work"; record any new decisions.
4. Commit + push BOTH this repo AND the vault. After code changes, run `graphify update .`.
5. Needs Manny but not a hard gate → file a task:
   `bash "/Users/mannydearaujo/Agentic OS Build/bin/file-task.sh" "one actionable line"`.
   Hard sign-off (deploy, send, publish, scope, spend) → write an approval request into
   `/Users/mannydearaujo/Agentic OS Build/.ops/approvals/pending/`.

### Rules
- Manny's latest explicit instruction wins, then SOURCE-OF-TRUTH ordering.
- No external actions (deploy, DNS, send, publish, spend, delete, credentials) without approval.
- No secrets in any repo. Code repos own code truth; the vault owns context/decisions.
- If work changed durable state, it belongs in the vault — never leave it only in chat.
