# Alpha Seamless Gutter website (alphagutterco.com)

Project facts for any agent working in this repo. `AGENTS.md` and `CLAUDE.md` carry the same
content; when you change one, change the other.

## What this is
- Marketing site for Alpha Seamless Gutter, LLC: a B2B **supplier** that fabricates seamless 5" and
  6" K-style gutter on the job site for contractors ("cut and drop"). Materials only; the
  contractor's crew installs. Never describe Alpha as an installer.
- Phone 508-496-5173, email info@alphagutterco.com. Service regions: Southcoast MA, Metro West,
  Greater Boston.

## Stack and deploy
- Plain static HTML, no build step, no `package.json`. Styles are inline in each page.
- Hosted on **GitHub Pages** from `main` (`CNAME` = alphagutterco.com). A push to `main` is a live
  deploy, so work on a branch and get Manny's approval before merging.
- GitHub Pages serves every page at a clean URL and at `.html`. The clean URL is canonical;
  `robots.txt` blocks the `.html` duplicate (`Disallow: /*.html$`). There are no server redirects.

## Tracking and forms
- GA4 property `G-NPKB1VZSNB`, loaded only through `/site-tracking.js` (no GTM). Do not paste a
  second GA4 snippet into a page.
- `site-tracking.js` sends lead events through `window.alphaTrackLead`. A `data-track` attribute
  names the event; without one, `tel:` → `phone_tap`, `sms:` → `sms_tap`, `mailto:` → `email_click`.
  Use `data-track-label` to say where the click happened.
- Quote forms: every indexable page has one (`<form data-quote-form="label">`; full form on the
  homepage, short form in `#quote` on service and town pages). `/site-forms.js` handles them all:
  validation, POST to the Formspree endpoint in `ENDPOINT`, and a visible error with call/text
  links when the send fails. Never show a success message unless Formspree returned OK. Forms keep
  `action`/`method` so they still post without JavaScript, plus a hidden `_gotcha` honeypot.
- Lead events: `phone_tap`, `sms_tap`, `email_click`, `quote_request_submit` (real sends only),
  `quote_request_error`, `quote_form_start`, `quote_request_click` (buttons that jump to the form;
  not a conversion). Do not put `data-track` on a submit button.
- `sms:` links are pre-filled with the order checklist (`?&body=`); town pages include the town.
- Service and town pages carry a sticky Call / Text / Quote bar (`.mobile-bar`, phones only), like
  the homepage. Shared CSS for it sits in each page's `<style>` under "shared: lead paths".

## Pages
- `index.html`, `service-area.html`, and four service pages (cut and drop, 5 and 6 inch K-style,
  same-day delivery, colors and accessories).
- 40 town files named `seamless-gutters-<town>-ma.html`: **13 full town pages** (unique copy, FAQ,
  FAQPage schema) and **27 retired stubs** that point visitors to `/service-area`. Stubs are `noindex, follow` with no
  canonical tag (since 2026-11) and stay out of the sitemap; never give a stub a canonical to a
  different URL.
- `sitemap.xml` lists only the real pages (no stubs); update `lastmod` when a page changes.
- `404.html` is the branded not-found page. It also redirects trailing-slash and `.html` URLs to
  the clean URL, because GitHub Pages has no redirects. (`design-mockup.html` was removed 2026-11.)
- Favicons are real files at the root (`favicon.ico`, `favicon.svg`, `favicon-96.png`,
  `apple-touch-icon.png`); the share image is `assets/share-1200x630.jpg`.
- New or rewritten town and service pages are written with the `alpha-seo-content` skill.

## Rules
- Schema: no self-published `aggregateRating` on LocalBusiness markup (removed 2026-11; Google does
  not show stars for it and it risks a review-spam flag). Visible FAQ text must match FAQPage schema.
- No fake reviews, no ranking promises, no doorway pages: a town page ships only with real,
  town-specific detail.
- One `<h1>` per page; every image has alt text; every page has a canonical tag.
- Business schema: every page uses the same `HomeAndConstructionBusiness` node with
  `@id` `https://alphagutterco.com/#business` (copied from the homepage; only the homepage adds
  `review`). Town-specific cities go on the page's `Service` node, not on the business node.
- `<meta charset>` is the first tag in `<head>`; titles stay at or under about 60 characters and
  descriptions under about 155.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).


## Agentic OS — vault-first session protocol

This repo is part of Manny's Agentic OS. The BRAIN is the manny-ai-os Markdown vault:
  VAULT = the value of VAULT_PATH in /Users/mannydearaujo/Agentic OS Build/config/os.config
  (currently /Users/mannydearaujo/manny-ai-os; always read it from that file)

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
