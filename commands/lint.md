---
name: lint
description: Lint the Cairn vault — orphans, dead links, stale content, contradictions
---

# Lint the Cairn Vault

Invoke the `cairn` skill and follow its Lint workflow. Report findings only —
all fixes are opt-in.

Expected output:

1. Vault health dashboard (pages, links, orphans, dead links, stale, types,
   backlinks coverage).
2. Orphan pages (no inbound links).
3. Dead links (wikilinks to non-existent pages).
4. Missing frontmatter (required: `title`, `type`, `created`, `updated`, `tags`).
5. Stale content (`updated` > 30 days).
6. Missing `type` field.
7. **Contradictions** — conflicting claims across pages. Flag both pages and
   the conflicting statements. Most dangerous vault failure mode.
8. Missing or out-of-sync `## Backlinks` sections.
9. **Implicit concepts** — terms or named entities mentioned 3+ times across
   the vault without a dedicated page. Surface as candidates, not auto-fixes.
10. **Research gaps** — thinly covered topics (single source, fewer than 2
    inbound links, open questions implied by `Gaps` sections on overview
    pages). Suggest investigations; never file pages automatically.

Do not auto-fix without user approval. Implicit-concept and research-gap
findings are prompts for the user, not pages to create.
