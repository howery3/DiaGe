---
name: EAS Metro config placement
description: Where to put metro.config.js in a pnpm monorepo for EAS iOS builds, and how to handle @/ path aliases
---

EAS runs `pnpm expo export:embed` from the workspace root but passes `workingDirectory` as the Metro projectRoot. Metro therefore reads `artifacts/mobile/metro.config.js` — NOT the workspace root one.

**Rule:** All Metro fixes must go in `artifacts/mobile/metro.config.js`. The workspace root `metro.config.js` should simply delegate:
```js
module.exports = require("./artifacts/mobile/metro.config.js");
```

**@/ alias:** `resolver.alias = { "@": projectRoot }` does NOT work for prefix-based paths. Use `resolver.resolveRequest` instead:
```js
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@/")) {
    return context.resolveRequest(context, path.resolve(projectRoot, moduleName.slice(2)), platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};
```

**Why:** babel-preset-expo reads tsconfig paths relative to its own resolution root, not the Metro projectRoot, so the tsconfig `@/*` paths aren't applied during EAS builds. resolveRequest bypasses Babel entirely and handles it at the Metro resolver level.

**How to apply:** Any time the @/ alias breaks in an EAS build, check that resolveRequest is in `artifacts/mobile/metro.config.js` (not workspace root).
