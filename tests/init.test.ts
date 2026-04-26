import { describe, it, expect } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { existsSync, rmSync, mkdirSync, writeFileSync } from "node:fs";

describe("kb init (integration)", () => {
  it("should scaffold vault at custom path", async () => {
    const vaultDir = join(tmpdir(), `kb-init-${Date.now()}`);

    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "init", "--vault-path", vaultDir],
      { stdout: "pipe", stderr: "pipe" }
    );
    const exitCode = await proc.exited;

    expect(exitCode).toBe(0);
    expect(existsSync(join(vaultDir, "wiki"))).toBe(true);
    expect(existsSync(join(vaultDir, "raw"))).toBe(true);
    expect(existsSync(join(vaultDir, "sessions"))).toBe(true);
    expect(existsSync(join(vaultDir, "KB.md"))).toBe(true);
    expect(existsSync(join(vaultDir, "index.md"))).toBe(true);
    expect(existsSync(join(vaultDir, "log.md"))).toBe(true);
    expect(existsSync(join(vaultDir, "context.md"))).toBe(true);
    expect(existsSync(join(vaultDir, ".kb", "state.json"))).toBe(true);

    rmSync(vaultDir, { recursive: true });
  });

  it("should be idempotent on second run", async () => {
    const vaultDir = join(tmpdir(), `kb-init-${Date.now()}`);

    await Bun.spawn(
      ["bun", "run", "src/cli.ts", "init", "--vault-path", vaultDir],
      { stdout: "pipe", stderr: "pipe" }
    ).exited;

    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "init", "--vault-path", vaultDir],
      { stdout: "pipe", stderr: "pipe" }
    );
    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);

    rmSync(vaultDir, { recursive: true });
  });

  it("should refuse occupied directory", async () => {
    const vaultDir = join(tmpdir(), `kb-init-${Date.now()}`);
    mkdirSync(vaultDir, { recursive: true });
    writeFileSync(join(vaultDir, "existing.txt"), "content");

    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "init", "--vault-path", vaultDir],
      { stdout: "pipe", stderr: "pipe" }
    );
    const exitCode = await proc.exited;
    expect(exitCode).toBe(1);

    rmSync(vaultDir, { recursive: true });
  });
});
