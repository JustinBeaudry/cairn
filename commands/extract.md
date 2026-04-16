---
name: extract
description: Extract wiki-worthy knowledge from unprocessed session summaries
argument-hint: "[on|off]"
---

# Extract from Sessions

Invoke the `extract` skill.

- `/cairn:extract` — extract from unprocessed sessions now.
- `/cairn:extract on` — enable session-start nudge (reminds you when
  unprocessed sessions exist).
- `/cairn:extract off` — disable session-start nudge.

The skill handles the toggle path (writes `autoExtractNudge` to
`.cairn/state.json`) and the extraction path (runs the ingest workflow on
sessions with `extracted: false`, using `entire_checkpoint` for provenance
when present).
