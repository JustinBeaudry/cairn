import { describe, it, expect } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { existsSync, rmSync } from "node:fs";

describe("cairn uninstall (integration)", () => {
  it("should preserve vault and exit cleanly", async () => {
    const vaultDir = join(tmpdir(), `cairn-uninst-${Date.now()}`);

    // Init first
    await Bun.spawn(
      ["bun", "run", "src/cli.ts", "init", "--vault-path", vaultDir],
      { stdout: "pipe", stderr: "pipe" }
    ).exited;

    // Uninstall with --force
    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "uninstall", "--force"],
      { stdout: "pipe", stderr: "pipe" }
    );
    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);

    // Vault preserved
    expect(existsSync(join(vaultDir, "CAIRN.md"))).toBe(true);

    rmSync(vaultDir, { recursive: true });
  });
});
