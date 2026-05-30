#!/usr/bin/env node
const fs = require('fs');

let actionsFile;
try {
  actionsFile = require.resolve('@expo/cli/build/src/api/user/actions', {
    paths: [__dirname + '/..'],
  });
} catch {
  process.exit(0);
}

const original = fs.readFileSync(actionsFile, 'utf-8');

const PATCHED_MARKER = '// auto-patched: skip login prompt';
if (original.includes(PATCHED_MARKER)) {
  process.exit(0);
}

const patched = original.replace(
  /async function tryGetUserAsync\(\) \{[\s\S]*?^}/m,
  `async function tryGetUserAsync() {\n    ${PATCHED_MARKER}\n    const user = await (0, _user.getUserAsync)().catch(()=>null);\n    if (user) return user;\n    return null;\n}`
);

if (patched !== original) {
  fs.writeFileSync(actionsFile, patched);
  console.log('[patch] Expo CLI: login prompt disabled');
} else {
  console.log('[patch] Pattern not matched — Expo CLI may have changed');
}
