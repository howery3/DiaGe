// Loaded via NODE_OPTIONS=--require before any Expo CLI code runs.
// Patches tryGetUserAsync in @expo/cli to skip the login prompt entirely.
const Module = require('module');
const originalExtension = Module._extensions['.js'];

Module._extensions['.js'] = function (mod, filename) {
  if (filename.includes('@expo/cli/build/src/api/user/actions')) {
    const fs = require('fs');
    let src = fs.readFileSync(filename, 'utf8');
    // Replace everything from the prompt choices to the closing brace of tryGetUserAsync
    const patched = src.replace(
      /(async function tryGetUserAsync\(\)\s*\{[\s\S]*?if \(user\) \{\s*return user;\s*\})([\s\S]*?)(^\})/m,
      '$1\n    return null; // skip login prompt\n$3'
    );
    if (patched !== src) {
      mod._compile(patched, filename);
      return;
    }
  }
  return originalExtension(mod, filename);
};
