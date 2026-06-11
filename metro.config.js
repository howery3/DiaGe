const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const monorepoRoot = __dirname;
const projectRoot = path.resolve(monorepoRoot, "artifacts/mobile");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Resolve @/ path alias (maps to artifacts/mobile/) since babel-preset-expo
// reads tsconfig paths relative to the file's own root, not the Metro projectRoot.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@/")) {
    return context.resolveRequest(
      context,
      path.resolve(projectRoot, moduleName.slice(2)),
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
