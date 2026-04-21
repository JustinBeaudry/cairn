import { appendFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { withExclusiveLock } from "../lockfile";
import type { InjectMode } from "./modes";

export interface InjectLogEntry {
  timestamp: string;
  event: "inject";
  mode: InjectMode;
  bytes: number;
  categories_advertised: number;
}

export async function appendInjectLog(vaultPath: string, entry: InjectLogEntry): Promise<void> {
  const logPath = join(vaultPath, ".cairn", "inject-log.jsonl");
  const lockPath = join(vaultPath, ".cairn", "inject-log.jsonl.lock");
  mkdirSync(dirname(logPath), { recursive: true });
  await withExclusiveLock(lockPath, async () => {
    appendFileSync(logPath, `${JSON.stringify(entry)}\n`);
  });
}
