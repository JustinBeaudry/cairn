---
name: ingest
description: Ingest a source (file, URL, or pasted text) into the Cairn vault
argument-hint: "[source-path-or-url]"
---

# Ingest into Cairn Vault

The user wants to ingest a source into the vault. Invoke the `cairn` skill and
follow its Ingest workflow against the argument (file path, URL, or inline
text). If no argument was provided, ask the user what to ingest.

Expected behavior:

1. Read `CAIRN.md` in the vault root first if you haven't this session.
2. Copy file sources to `raw/` for provenance.
3. Present takeaways — entities, concepts, relationships, contradictions — and
   confirm what to file before writing pages.
4. Cascade updates to related existing pages.
5. Update `index.md`, `context.md` (if relevant), and append to `log.md`.
