# Rename: cairn → kb

**Date:** 2026-04-26

## Problem

"cairn" as a name has a discoverability problem — users don't immediately understand what the tool does from the name. "kb" is shorter and self-evident (knowledge base). We want a clean rename with no backward compatibility.

## Scope

Standard scope. The name "cairn" is woven throughout the codebase: package/CLI, file system, environment variables, code symbols, user-facing commands, and skill definitions. This is a mechanical rename across all occurrences with no behavioral changes.

## Scope Boundaries

### Included
1. All user-facing CLI commands (`kb init`, `kb doctor`, `kb summarize`, etc.)
2. Hidden state directory (`.cairn/` → `.kb/`)
3. Template file (`templates/CAIRN.md` → `templates/KB.md`)
4. All environment variables (`CAIRN_*` → `KB_*`)
5. Code symbols (`getCairnMdTemplate()`, `VaultState "cairn"`, `runCairn()`, etc.)
6. Slash commands (`/cairn:extract` → `/kb:extract`, `/cairn:refine` → `/kb:refine`)
7. Skills directory and content (`skills/cairn/` → `skills/kb/`, references in other skills)
8. Package `bin` entry (`"kb": "./src/cli.ts"`)
9. All test file references and test helpers
10. Documentation (README, plans, ideation docs, brainstorms)

### Excluded
1. **npm package name** — user does not care about npm name (current `kb@0.0.5` is a different package). May need a unique npm name for publishing.
2. **Migration logic** — no backward compatibility. Existing `.cairn` vaults break. This is a clean break.
3. **Behavioral changes** — no functional changes alongside the rename.

## Decisions Made

| Decision | Value |
|---|---|
| Naming approach | Direct mapping — `KB.md`, `.kb/`, `KB_VAULT`, `KB_*` env vars |
| Backward compatibility | None — clean break |
| Scope | Rename everything; no behavioral changes |

## Assumptions

1. Existing `.cairn` vaults will need manual renaming (or recreation) by users.
2. The npm package name will need to be something other than `kb` (already taken) for publishing, but the CLI binary is `"kb"` regardless.
3. Git repo name change is out of scope (repo URL, remote — those can be handled separately).

## Success Criteria

1. `kb` works as a drop-in replacement for `cairn` CLI usage (same commands, same behavior).
2. All references to "cairn" (case-insensitive) in source, tests, docs, and skills are renamed.
3. All tests pass after rename.
4. No functionality regressions.

## Technical Impact Summary

Based on repo scan, the rename touches:

| Layer | Files | Examples |
|---|---|---|
| Source code | ~12 files | `src/cli.ts`, `src/lib/vault.ts`, `src/lib/constants.ts`, `src/commands/*.ts` |
| Tests | ~14 files | All files under `tests/` |
| Skills | 4 files | `skills/cairn/SKILL.md`, `skills/extract/SKILL.md`, `skills/refine/SKILL.md`, `tests/skill-contract.test.ts` |
| Templates | 1 file | `templates/CAIRN.md` → `templates/KB.md` |
| Config/manifests | 3 files | `package.json`, `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json` |
| Documentation | ~8 files | README.md, docs/plans/*, docs/brainstorms/* |

## Dependencies / Risks

- **Low risk** — this is a mechanical rename. No runtime behavior changes.
- **Risk:** missing edge cases in string references (e.g., user-facing messages, doctor output). Mitigation: grep for "cairn" case-insensitive after the rename pass.
- **Risk:** `.claude-plugin/` plugin references. These may affect how Claude Code discovers/loads the plugin. Mitigation: review plugin.json and marketplace.json carefully.

## Next Steps

1. **Plan the implementation** — `/ce-plan` to create a step-by-step plan.
2. **Execute the rename** — systematic file edits following the plan.
3. **Verify** — run full test suite and confirm no "cairn" references remain.
