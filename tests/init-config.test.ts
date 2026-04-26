import { describe, it, expect, afterEach } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdirSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { scaffoldVault } from "../src/lib/vault";

const vaults: string[] = [];
afterEach(() => {
  for (const v of vaults.splice(0)) {
    try {
      rmSync(v, { recursive: true, force: true });
    } catch {}
  }
});

function tmpVault(): string {
  const dir = join(tmpdir(), `kb-init-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  vaults.push(dir);
  return dir;
}

describe("init — fresh-install config.json", () => {
  it("writes .kb/config.json with inject_mode=lazy", () => {
    const vault = tmpVault();
    const result = scaffoldVault(vault);
    expect(result.created).toContain(".kb/config.json");
    const configPath = join(vault, ".kb", "config.json");
    expect(existsSync(configPath)).toBe(true);
    const parsed = JSON.parse(readFileSync(configPath, "utf-8"));
    expect(parsed.inject_mode).toBe("lazy");
  });

  it("does not overwrite an existing config.json", () => {
    const vault = tmpVault();
    mkdirSync(join(vault, ".kb"), { recursive: true });
    const preExistingPath = join(vault, ".kb", "config.json");
    writeFileSync(preExistingPath, JSON.stringify({ inject_mode: "eager", custom: 1 }));
    const result = scaffoldVault(vault);
    expect(result.skipped).toContain(".kb/config.json");
    const parsed = JSON.parse(readFileSync(preExistingPath, "utf-8"));
    expect(parsed.inject_mode).toBe("eager");
    expect(parsed.custom).toBe(1);
  });
});
