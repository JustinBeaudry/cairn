---
date: 2026-04-26
topic: obsidian-graph-readability
---

# Obsidian Graph Readability via Front Matter Title

## Problem Frame

Cairn vault filenames are lowercase kebab-case (`templates/CAIRN.md` Rule 13, line 403), and Obsidian's graph view labels nodes by basename. The result: every node in the user's graph reads as `dependency-injection`, `agentic-knowledge-map`, etc. — visually noisy and hard to scan, even though every page already carries a human-readable `title` in frontmatter.

Renaming the vault to Title Case filenames was rejected: it would reverse the wikilink rule hardened earlier today in commit `6db4eb3`, force a one-time migration of every page and every wikilink, and introduce filesystem-level fragility (spaces, case-sensitivity drift). The kebab convention exists for good reasons; the readability problem is purely a display-layer concern.

The chosen direction is to keep filenames kebab-case and rely on the **Front Matter Title** Obsidian community plugin (Snezhig) to render frontmatter `title` in the graph, file explorer, quick switcher, and other UI surfaces. CAIRN.md already requires `title` on every wiki page (Rule 3), so the plugin has a stable source to render from. Wikilinks, lint rules, and CLI tooling stay unchanged.

**Affected:** the user's personal vault today, and any future Cairn user who installs the plugin per recommendation.

## Requirements

**Personal vault setup**
- R1. The user installs the Front Matter Title Obsidian community plugin in their `~/cairn` vault and configures it to source the display name from the frontmatter `title` field, with fallback to filename when `title` is missing.
- R2. The plugin is enabled at minimum for: graph view, file explorer, quick switcher / suggester, link autocomplete, tab titles, and backlinks panel. After enabling, the graph in the screenshot reads with human-friendly titles.
- R6. The plugin's "Note Link" feature is left disabled, or its `Replace` mode is set to "Replace only without alias", so the plugin does not rewrite wikilink aliases on disk. The canonical `[[kebab-filename|Display Title]]` form mandated by `templates/CAIRN.md` Rule 13 must remain authoritative; the plugin operates on the render layer only.

**Cairn project documentation**
- R3. `README.md` gains a section recommending the plugin (alongside or near the existing "Search (optional)" section), explaining the readability problem it solves, the minimum settings to enable, and the specific features to leave disabled (notably "Note Link" / "Replace all links") to preserve the canonical wikilink form. The recommendation is optional, not required — Cairn works without the plugin.
- R4. `templates/CAIRN.md` is updated so that the `title` field is documented as the canonical human-readable name used by Obsidian's display surfaces when the plugin is installed. The kebab-case filename rule and the `[[kebab-filename|Display Title]]` wikilink rule remain authoritative — only the framing of `title` shifts from "metadata" to "display source".
- R5. Documentation acknowledges that without the plugin, raw markdown viewers (GitHub, plain editors) still show kebab filenames; this is intentional and out of scope to fix.

## Success Criteria

- The user installs the plugin in `~/cairn`, opens the graph, and reads node labels as Title Case (e.g., "Dependency Injection") instead of kebab (`dependency-injection`).
- A new Cairn user reading `README.md` learns the plugin exists, why it helps, and which settings to flip.
- `templates/CAIRN.md` makes clear that a missing or trivial `title` (e.g., one that equals the filename) defeats the plugin, even if no automated check enforces it yet.
- No existing wikilinks, page filenames, lint rules, CLI commands, or hooks change behavior.

## Scope Boundaries

- **Out:** renaming any wiki page filename; changing the wikilink form; modifying the lint workflow to enforce non-trivial `title` values; adding doctor checks for empty `title`; non-Obsidian display surfaces (GitHub, raw markdown).
- **Out:** automating plugin install. The user installs and configures the plugin manually; documentation is the deliverable.
- **Out:** changes to the canonical `[[kebab-filename|Display Title]]` wikilink form. The plugin operates on display only; it does not alter link resolution.

## Key Decisions

- **Display-layer fix over filename rename.** Reversing the kebab rule would create higher-cost migration churn for a benefit that the plugin delivers without touching disk.
- **Recommend but do not require.** The plugin is an Obsidian-only convenience; Cairn's vault remains usable without it. README and CAIRN.md frame it as a recommended setup, not a dependency.
- **Title field stays product-defined.** Existing convention (`title` in frontmatter, required) is reframed as both metadata and display source; no schema change.
- **Plugin runs display-only.** Features that rewrite files on disk (notably "Note Link" alias replacement) are explicitly disabled in the recommended setup. The plugin must not mutate the canonical `[[kebab-filename|Display Title]]` wikilink form.

## Dependencies / Assumptions

- Front Matter Title plugin (Snezhig, `obsidian-front-matter-title`) is assumed to be active, maintained, and to support replacement in graph view + file explorer + suggester. Planning should verify the current plugin name, install path, and the exact setting names before authoring user-facing instructions in README.md.
- All Cairn wiki pages already populate `title` in frontmatter per CAIRN.md Rule 3. Pages missing `title` will fall back to filename in the graph; this is acceptable for the personal vault today and will be flagged in lint regardless (existing behavior).

## Outstanding Questions

### Resolve Before Planning

(none — product direction is settled)

### Deferred to Planning

- [Affects R3][Needs research] What is the exact plugin name, current settings UI labels, and minimal-config screenshot for `README.md`? Verify against the plugin's current docs before writing user-facing instructions.
- [Affects R3, R4][Technical] Where in `README.md` does the new section sit — under "Vault structure", under "Search (optional)" as a sibling, or as a new top-level "Recommended Obsidian setup" section? Decide during planning based on doc flow.
- [Affects R4][Technical] In `templates/CAIRN.md`, does the "Frontmatter" section gain a sentence about `title` as display source, or does the "Filenames" subsection get a "Why kebab + plugin" note? Pick the cleanest insertion point during planning.
- [Affects R4][Technical] Should the optional doctor check for missing/empty `title` be filed as a follow-up issue now, or left implicit until lint surfaces a concrete need? User explicitly chose "Document in Cairn" over "Document and enforce", so default to deferring; revisit if pages-without-title becomes a real problem.

## Next Steps

-> `/ce:plan` for structured implementation planning
