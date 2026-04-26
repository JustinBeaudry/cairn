import { describe, it, expect } from "bun:test";
import { readFileSync } from "node:fs";

function read(path: string): string {
  return readFileSync(path, "utf-8");
}

describe("session manifest skill contract", () => {
  it("extract uses ask-gated kb read-session for unprocessed sessions", () => {
    const text = read("skills/extract/SKILL.md");
    expect(text).toContain("kb read-session");
    expect(text).toContain("--approve");
    expect(text).toContain("untrusted data");
  });

  it("refine documents session manifest summarization when session context is needed", () => {
    const text = read("skills/refine/SKILL.md");
    expect(text).toContain("sessions/*.md");
    expect(text).toContain("kb summarize --json");
    expect(text).toContain("degraded: true");
  });

  it("kb overview describes the new session layout", () => {
    const text = read("skills/kb/SKILL.md");
    expect(text).toContain("sessions/<name>.md");
    expect(text).toContain("sessions/summaries/<name>.md");
    expect(text).toContain("sessions/.trash/");
  });

  it("query command documents files_changed manifest scans", () => {
    const text = read("commands/query.md");
    expect(text).toContain("files_changed");
    expect(text).toContain("sessions/*.md");
    expect(text).toContain("Do not invoke `kb summarize`");
  });

  it("template KB.md includes summaries and trash rows", () => {
    const text = read("templates/KB.md");
    expect(text).toContain("sessions/summaries/<name>.md");
    expect(text).toContain("sessions/.trash/");
    expect(text).toContain("kb capture-session");
  });
});
