import { existsSync, readFileSync, writeFileSync } from "node:fs";

export const CAIRN_HOOK_MARKER = "cairn-hook";

interface Hook {
  type: string;
  command?: string;
  prompt?: string;
  async?: boolean;
  timeout?: number;
  [key: string]: unknown;
}

interface HookMatcher {
  matcher?: string;
  hooks: Hook[];
}

interface Settings {
  hooks?: Record<string, HookMatcher[]>;
  [key: string]: unknown;
}

function readSettings(path: string): Settings {
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as Settings;
  } catch {
    return {};
  }
}

function writeSettings(path: string, settings: Settings): void {
  writeFileSync(path, JSON.stringify(settings, null, 2) + "\n");
}

function hasCairnHook(matchers: HookMatcher[]): boolean {
  return matchers.some((m) =>
    m.hooks.some(
      (h) =>
        (h.command && h.command.includes(CAIRN_HOOK_MARKER)) ||
        (h.prompt && h.prompt.includes(CAIRN_HOOK_MARKER))
    )
  );
}

export function registerHooks(settingsPath: string, vaultPath: string): void {
  const settings = readSettings(settingsPath);
  settings.hooks ??= {};

  const injectCmd = `"\${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd" inject "${vaultPath}"`;

  const cairnSessionStart: HookMatcher = {
    matcher: "startup|clear|compact",
    hooks: [
      {
        type: "command",
        command: `${injectCmd} # ${CAIRN_HOOK_MARKER}`,
      },
    ],
  };

  const cairnPostCompact: HookMatcher = {
    matcher: "auto|manual",
    hooks: [
      {
        type: "command",
        command: `${injectCmd} # ${CAIRN_HOOK_MARKER}`,
      },
    ],
  };

  const cairnStop: HookMatcher = {
    hooks: [
      {
        type: "agent",
        prompt: `You are the Cairn session summarizer. Read the session transcript and write a structured summary.\n\nVAULT PATH: ${vaultPath}\n\nINSTRUCTIONS:\n1. Read the session transcript from the transcript_path provided in your context.\n2. Extract: decisions made (with rationale), open threads, files changed, session status, and a brief narrative summary.\n3. Write a session file to ${vaultPath}/sessions/ with the current timestamp as filename (YYYY-MM-DDTHH-MM-SS.md).\n4. The file MUST have YAML frontmatter with fields: session_id, status (completed|in-progress|blocked), files_changed (list of path+action), decisions (list of choice+reason), open_threads (list of strings), tags (list of strings).\n5. The markdown body after frontmatter should be 2-4 sentences summarizing the session arc.\n6. Append a line to ${vaultPath}/log.md: [SESSION] YYYY-MM-DD <brief description>\n7. Do NOT modify any other files in the vault. Do NOT touch wiki/, raw/, or index.md.\n\n# ${CAIRN_HOOK_MARKER}`,
        async: true,
        timeout: 120,
      },
    ],
  };

  for (const [event, matcher] of [
    ["SessionStart", cairnSessionStart],
    ["PostCompact", cairnPostCompact],
    ["Stop", cairnStop],
  ] as const) {
    settings.hooks[event] ??= [];
    if (!hasCairnHook(settings.hooks[event]!)) {
      settings.hooks[event]!.push(matcher);
    }
  }

  writeSettings(settingsPath, settings);
}

export function removeHooks(settingsPath: string): void {
  const settings = readSettings(settingsPath);
  if (!settings.hooks) return;

  for (const event of Object.keys(settings.hooks)) {
    settings.hooks[event] = settings.hooks[event]!.filter(
      (m) =>
        !m.hooks.some(
          (h) =>
            (h.command && h.command.includes(CAIRN_HOOK_MARKER)) ||
            (h.prompt && h.prompt.includes(CAIRN_HOOK_MARKER))
        )
    );
    if (settings.hooks[event]!.length === 0) {
      delete settings.hooks[event];
    }
  }

  if (Object.keys(settings.hooks).length === 0) {
    delete settings.hooks;
  }

  writeSettings(settingsPath, settings);
}
