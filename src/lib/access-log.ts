import { createHash } from "node:crypto";
import { join } from "node:path";
import { appendMinimalJsonl } from "./log-writer";

export interface AccessLogEntry {
  timestamp: string;
  command: "recall" | "get" | "list-topics";
  query_hash: string;
  query_len: number;
  pages_returned: number;
  bytes_returned: number;
  exit_code: number;
}

export interface AccessLogInput {
  vaultPath: string;
  command: AccessLogEntry["command"];
  query: string;
  pages_returned: number;
  bytes_returned: number;
  exit_code: number;
}

export function hashQuery(query: string): string {
  return createHash("sha256").update(query).digest("hex").slice(0, 32);
}

export async function appendAccessLog(input: AccessLogInput): Promise<void> {
  const entry: AccessLogEntry = {
    timestamp: new Date().toISOString(),
    command: input.command,
    query_hash: hashQuery(input.query),
    query_len: input.query.length,
    pages_returned: input.pages_returned,
    bytes_returned: input.bytes_returned,
    exit_code: input.exit_code,
  };
  await appendMinimalJsonl(entry as unknown as Record<string, unknown>, {
    logPath: join(input.vaultPath, ".cairn", "access-log.jsonl"),
    lockPath: join(input.vaultPath, ".cairn", "access-log.jsonl.lock"),
  });
}
