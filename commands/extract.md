---
name: extract
description: Extract wiki-worthy knowledge from unprocessed session manifests
argument-hint: "[on|off]"
---

# Extract from Sessions

Invoke the `extract` skill.

- `/kb:extract` — extract from unprocessed sessions now.
- `/kb:extract on` — enable session-start nudge (reminds you when
  unprocessed sessions exist).
- `/kb:extract off` — disable session-start nudge.

The skill handles the toggle path (writes `autoExtractNudge` to
`.kb/state.json`) and the extraction path. It lists session manifests with
`extracted: false`, runs `kb summarize --json <manifest>` lazily, reads the
returned cached summary under `sessions/summaries/`, and runs the ingest
workflow on confirmed candidates. It surfaces degraded summaries and skipped
summary-generation failures visibly, using `entire_checkpoint` for provenance
when present.
