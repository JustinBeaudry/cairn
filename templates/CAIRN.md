# Cairn — Knowledge Vault

This file defines how you interact with this vault. Follow these conventions exactly.

## Vault Structure

| Directory | Purpose | Who writes |
|-----------|---------|------------|
| `wiki/` | Knowledge pages — entities, concepts, summaries | Agent |
| `raw/` | Archived source documents — originals preserved for provenance | Agent (copies here during ingest) |
| `sessions/` | Session summaries — auto-generated at session end | Agent (via hook) |
| `index.md` | Pointer index — one-line entry per wiki page | Agent |
| `log.md` | Chronological record — append-only | Agent |

## Markdown Conventions

### Wikilinks
Use `[[wikilinks]]` for all internal references:
- `[[Page Name]]` — link to page
- `[[Page Name|Display Text]]` — aliased link
- `[[Page Name#Heading]]` — link to heading
- `[[Page Name#^block-id]]` — link to block

### Frontmatter
Every wiki page starts with YAML frontmatter:
```yaml
---
title: Page Title
date: YYYY-MM-DD
tags:
  - topic/subtopic
aliases:
  - Alternate Name
---
```
Keys are lowercase, hyphenated. Tags use `/` for hierarchy.

### Embeds and Callouts
- Embed a page: `![[Page Name]]`
- Embed a heading: `![[Page Name#Heading]]`
- Callouts: `> [!info]`, `> [!warning]`, `> [!tip]`

## Workflows

### Ingest
When the user asks you to ingest something (file path, URL, pasted text, or conversation context):
1. Read the source from wherever it lives — a local path, URL, or inline content
2. If the source is a file, copy it to `raw/` for provenance (preserving original filename)
3. Identify key entities, concepts, and relationships
4. For each entity/concept, create or update a wiki page in `wiki/`
5. Link related pages with `[[wikilinks]]` — every page links to at least 2 others
6. Add an entry to `index.md`: `- [[Page Name]] — one-line description (~150 chars)`
7. Append to `log.md`: `[INGEST] YYYY-MM-DD Ingested <source>: <brief description>`

### Query
When the user asks a question the vault might answer:
1. Read `index.md` first to find relevant pages
2. Follow `[[wikilinks]]` to read related pages
3. Synthesize your answer, citing sources as `[[Page Name]]`
4. If your answer contains novel knowledge worth keeping, write a new wiki page

### Lint
When the user asks you to lint the vault:
1. **Orphan pages**: wiki pages with no inbound links from other wiki pages or index.md
2. **Dead links**: `[[wikilinks]]` pointing to non-existent pages
3. **Missing frontmatter**: wiki pages without YAML frontmatter
4. **Stale content**: pages tagged `#status/active` with no updates in 30+ days
5. Report all findings. All fixes are opt-in — do not auto-fix without user approval.

## Rules

1. **Never modify files in `raw/`.** They are archived originals preserved for provenance.
2. **Every wiki page links to 2+ related pages.** Isolated pages are less useful.
3. **Frontmatter on every wiki page.** At minimum: `title`, `date`, `tags`.
4. **index.md format**: `- [[Page Name]] — one-line description`, newest entries first.
5. **log.md format**: `[TYPE] YYYY-MM-DD description`. Types: `INGEST`, `QUERY`, `LINT`, `SESSION`.
6. **Skeptical memory**: Before acting on any recalled fact, verify it against the current codebase or source. Memory is a hint, not truth.
7. **Atomic pages**: One concept per wiki page. If a page covers multiple topics, split it.
