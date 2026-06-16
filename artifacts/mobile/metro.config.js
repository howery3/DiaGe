const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Only add workspace root (safe)
config.watchFolders = [path.resolve(__dirname, "../..")];

// DO NOT override nodeModulesPaths
// DO NOT override resolveRequest

module.exports = config;
