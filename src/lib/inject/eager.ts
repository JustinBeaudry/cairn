import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface EagerInput {
  vaultPath: string;
  budget: number;
}

function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

function appendIfFits(current: string, section: string, budget: number): string {
  const candidate = current ? `${current}\n\n${section}` : section;
  return byteLength(candidate) <= budget ? candidate : current;
}

export function buildEagerContext({ vaultPath, budget }: EagerInput): string {
  let ctx = "";

  const contextFile = join(vaultPath, "context.md");
  if (existsSync(contextFile)) {
    const body = readFileSync(contextFile, "utf-8");
    ctx = appendIfFits(
      ctx,
      `## Cairn Vault Context\n\nVerify against codebase before acting on any recalled facts.\n\n### Working Set\n${body}`,
      budget
    );
  }

  const indexFile = join(vaultPath, "index.md");
  if (existsSync(indexFile)) {
    const body = readFileSync(indexFile, "utf-8");
    const section = ctx
      ? `### Index\n${body}`
      : `## Cairn Vault Context\n\nVerify against codebase before acting on any recalled facts.\n\n### Index\n${body}`;
    ctx = appendIfFits(ctx, section, budget);
  }

  const sessionsDir = join(vaultPath, "sessions");
  if (existsSync(sessionsDir)) {
    const files = readdirSync(sessionsDir)
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse();
    let headerAdded = false;
    for (const f of files) {
      const body = readFileSync(join(sessionsDir, f), "utf-8");
      const section = headerAdded
        ? `\n---\n${body}`
        : `\n### Recent Sessions\n---\n${body}`;
      const next = appendIfFits(ctx, section, budget);
      if (next === ctx) break;
      ctx = next;
      headerAdded = true;
    }
  }

  return ctx;
}
