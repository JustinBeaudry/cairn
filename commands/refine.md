---
name: refine
description: Refine the Cairn vault — stale pages, weak connections, merges, backlinks
---

# Refine the Cairn Vault

Invoke the `refine` skill. All structural changes (merge, split, archive)
require user approval. Backlink sync is automatic.

Expected flow:

1. Vault health dashboard (baseline).
2. Stale pages (> 30 days) — update, archive, or leave, per user choice.
3. Under-connected pages (< 3 inbound) — suggest connections.
4. Merge candidates (overlapping topics) — propose combined structure.
5. Split candidates (broad pages, 4+ H2s) — propose split.
6. Backlinks audit — sync silently.
7. Vault health dashboard (after).
8. Append to `log.md`: `## [YYYY-MM-DD] refine | vault refinement pass`.
