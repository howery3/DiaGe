---
name: EAS pnpm monorepo bundle fix
description: How to make Metro use expo-router/entry instead of expo/AppEntry.js in a pnpm workspace EAS build
---

EAS runs `pnpm expo export:embed` from the repository root (not artifacts/mobile), regardless of `workingDirectory` in eas.json. This means Metro reads the workspace root's package.json for the entry point.

**The fix (all three parts required together):**
1. `.npmrc`: `public-hoist-pattern[]=expo` AND `public-hoist-pattern[]=expo-router`
2. Workspace root `package.json`: `"main": "expo-router/entry"`
3. Workspace root `metro.config.js`: `projectRoot = path.resolve(__dirname, "artifacts/mobile")` + `watchFolders` + `nodeModulesPaths`

**Why all three are needed:**
- Without expo hoisting: `pnpm expo` fails (binary not found at workspace root)
- Without expo-router hoisting: expo CLI can't resolve `expo-router/entry` → falls back to `expo/AppEntry.js`
- Without the `main` field: Metro defaults to `expo/AppEntry.js`
- Without the metro.config.js `projectRoot`: expo-router looks for `app/` at workspace root (doesn't exist)

**Why this happens:**
pnpm's virtual store puts expo at a deep path. `expo/AppEntry.js` does `import "../../App"` which resolves to a path deep in the virtual store, not the project root.
