// EAS runs pnpm expo export:embed from the workspace root.
// Whichever project root Metro uses, delegate to the mobile app's config.
module.exports = require("./artifacts/mobile/metro.config.js");
