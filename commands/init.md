---
name: init
description: Initialize a Cairn vault from within Claude Code
argument-hint: "[vault-path]"
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

After init completes:

1. Confirm the vault was created.
2. The init output will include a qmd setup hint if the `qmd` binary is not
   installed. Surface it to the user so they can opt in to hybrid search.
3. Suggest dropping a file in `raw/` to test ingestion.
