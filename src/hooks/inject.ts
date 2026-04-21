#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { DEFAULT_BUDGET } from "../lib/constants";
import { buildEagerContext } from "../lib/inject/eager";
import { appendInjectLog } from "../lib/inject/log";
import { resolveInjectMode } from "../lib/inject/modes";
import { buildPointerPayload, byteLength } from "../lib/inject/pointer";

function resolveVaultPath(argv: string[]): string {
  const arg = argv[0];
  if (arg) return arg;
  const env = process.env.CAIRN_VAULT;
  if (env) return env;
  return join(homedir(), "cairn");
}

function emitEmpty(): void {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: "",
      },
    }) + "\n"
  );
}

function emitContext(context: string): void {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: context,
      },
    }) + "\n"
  );
}

function countAdvertised(payload: string): number {
  const line = payload.split("\n").find((l) => l.startsWith("Topics:"));
  if (!line) return 0;
  return line
    .replace(/^Topics:\s*/, "")
    .replace(/\.\s*$/, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;
}

async function main(): Promise<void> {
  const vaultPath = resolveVaultPath(process.argv.slice(2));
  const budget = Number(process.env.CAIRN_BUDGET ?? DEFAULT_BUDGET);

  if (!existsSync(vaultPath)) {
    emitEmpty();
    return;
  }

  const mode = resolveInjectMode(vaultPath, process.env.CAIRN_INJECT_MODE);

  let context: string;
  let advertised = 0;
  if (mode === "off") {
    context = "";
  } else if (mode === "lazy") {
    context = buildPointerPayload({ vaultPath });
    advertised = countAdvertised(context);
  } else {
    context = buildEagerContext({ vaultPath, budget });
  }

  emitContext(context);

  try {
    await appendInjectLog(vaultPath, {
      timestamp: new Date().toISOString(),
      event: "inject",
      mode,
      bytes: byteLength(context),
      categories_advertised: advertised,
    });
  } catch {
    // logging must never fail the hook
  }
}

main().catch(() => {
  emitEmpty();
  process.exit(0);
});
