import { describe, it, expect } from "bun:test";
import { registerHooks, removeHooks, CAIRN_HOOK_MARKER } from "../src/lib/settings";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

function makeTempSettings(content: object = {}): string {
  const dir = join(tmpdir(), `cairn-settings-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "settings.json");
  writeFileSync(path, JSON.stringify(content, null, 2));
  return path;
}

describe("registerHooks", () => {
  it("should add cairn hooks to empty settings", () => {
    const path = makeTempSettings({});
    registerHooks(path, "/home/user/cairn");
    const result = JSON.parse(readFileSync(path, "utf-8"));
    expect(result.hooks.SessionStart).toHaveLength(1);
    expect(result.hooks.Stop).toHaveLength(1);
    expect(result.hooks.PostCompact).toHaveLength(1);
  });

  it("should preserve existing hooks", () => {
    const path = makeTempSettings({
      hooks: {
        SessionStart: [
          { hooks: [{ type: "command", command: "echo existing" }] },
        ],
      },
    });
    registerHooks(path, "/home/user/cairn");
    const result = JSON.parse(readFileSync(path, "utf-8"));
    expect(result.hooks.SessionStart).toHaveLength(2);
  });

  it("should be idempotent — skip if already registered", () => {
    const path = makeTempSettings({});
    registerHooks(path, "/home/user/cairn");
    registerHooks(path, "/home/user/cairn");
    const result = JSON.parse(readFileSync(path, "utf-8"));
    expect(result.hooks.SessionStart).toHaveLength(1);
  });

  it("should preserve non-hook settings", () => {
    const path = makeTempSettings({ model: "opus", theme: "dark" });
    registerHooks(path, "/home/user/cairn");
    const result = JSON.parse(readFileSync(path, "utf-8"));
    expect(result.model).toBe("opus");
    expect(result.theme).toBe("dark");
  });
});

describe("removeHooks", () => {
  it("should remove only cairn hooks", () => {
    const path = makeTempSettings({
      hooks: {
        SessionStart: [
          { hooks: [{ type: "command", command: "echo existing" }] },
          {
            hooks: [
              {
                type: "command",
                command: `echo ${CAIRN_HOOK_MARKER}`,
              },
            ],
          },
        ],
      },
    });
    removeHooks(path);
    const result = JSON.parse(readFileSync(path, "utf-8"));
    expect(result.hooks.SessionStart).toHaveLength(1);
    expect(result.hooks.SessionStart[0].hooks[0].command).toBe("echo existing");
  });

  it("should handle settings with no hooks", () => {
    const path = makeTempSettings({ model: "opus" });
    removeHooks(path);
    const result = JSON.parse(readFileSync(path, "utf-8"));
    expect(result.model).toBe("opus");
  });
});
