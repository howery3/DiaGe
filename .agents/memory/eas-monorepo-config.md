---
name: EAS monorepo app.json and eas.json setup
description: How app.json and eas.json must be structured at workspace root for correct version, buildNumber, icon, and plugin resolution in EAS builds
---

## The problem
EAS runs from the workspace root. The minimal workspace root `app.json` (just projectId + bundleIdentifier) causes EAS to fall back to `package.json` version → `0.0.0`. Missing version, icon, and build number in TestFlight.

## Required: workspace root app.json
Must be a FULL copy of `artifacts/mobile/app.json` with all asset paths prefixed with `./artifacts/mobile/`:
- `"icon": "./artifacts/mobile/assets/images/icon.png"`
- `"splash.image": "./artifacts/mobile/assets/images/icon.png"`
- `"web.favicon": "./artifacts/mobile/assets/images/icon.png"`
- `"plugins[expo-notifications].icon": "./artifacts/mobile/assets/images/icon.png"`

Keep version, buildNumber, projectId, owner, bundleIdentifier identical to `artifacts/mobile/app.json`.

## Required: workspace root eas.json
```json
{
  "cli": { "version": ">= 19.0.8", "appVersionSource": "local" },
  "build": {
    "production": { "env": { ... } }
  },
  "submit": { "production": { "ios": { "ascAppId": "6772402428" } } }
}
```
Do NOT use `workingDirectory` — rejected by EAS CLI 19+/20+.

## Required: expo plugin hoisting
`.npmrc` must include `public-hoist-pattern[]=expo-*` so all Expo plugins resolve from workspace root during EAS prebuild validation and on build servers.

After adding the pattern, run: `CI=true pnpm install`

**Why:** EAS resolves plugins from wherever `app.json` is found (workspace root). Without hoisting, `expo-font`, `expo-notifications`, etc. can't be found.

## Build number management
- Apple requires unique build numbers per version.
- Update `buildNumber` in BOTH `app.json` files (workspace root AND `artifacts/mobile/app.json`).
- Builds submitted under wrong config (0.0.0 + auto-increment) consume build numbers. Check App Store Connect before setting the next number.

## Provisioning profile prompt
EAS may ask "Would you like to reuse the original profile?" — answer Y. It's valid until May 2027.
