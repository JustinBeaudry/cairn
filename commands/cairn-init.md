---
name: cairn-init
description: Initialize a Cairn vault from within Claude Code
---

# Initialize Cairn Vault

The user wants to set up a Cairn vault. Run the CLI installer:

```bash
bunx cairn init
```

If the user specifies a custom path, use:

```bash
bunx cairn init --vault-path <path>
```

After init completes, confirm the vault was created and suggest dropping a
file in `raw/` to test ingestion.
