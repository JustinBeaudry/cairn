import { defineCommand } from "citty";
import { resolveVaultPath } from "../lib/vault";

export default defineCommand({
  meta: { name: "uninstall", description: "Remove KB (preserves vault)" },
  args: {
    force: { type: "boolean", description: "Skip confirmation prompt", alias: ["f"], default: false },
  },
  async run({ args }) {
    const vaultPath = resolveVaultPath(process.cwd());

    if (!args.force) {
      const rl = await import("node:readline").then((m) =>
        m.createInterface({ input: process.stdin, output: process.stdout })
      );
      const ok = await new Promise<boolean>((resolve) => {
        rl.question(
          "This will remove the KB plugin. Your vault is preserved.\nContinue? [y/N] ",
          (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === "y");
          }
        );
      });
      if (!ok) {
        console.log("Cancelled.");
        return;
      }
    }

    console.log("\nTo remove the KB plugin, run:");
    console.log("  claude plugin remove kb");
    console.log(`\nVault preserved at ${vaultPath}. Delete manually if desired.`);
  },
});
