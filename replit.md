# DiaGe

Expo/React Native iOS-first mobile app for jewelry customers to track their collection, manage a wishlist, and set inspection reminders — backed by a PostgreSQL API so data persists across phone changes.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000/8080)
- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo ~54, expo-router ~6, React Native 0.81.5
- Auth: Replit-managed Clerk (`@clerk/expo` on mobile, `@clerk/express` on server)
- API: Express 5 + `@clerk/express` (JWT via `clerkMiddleware()` + `getAuth()`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile/context/DiGeContext.tsx` — all app state; pieces, wishlist, reminders; syncs to API
- `artifacts/mobile/app/` — expo-router screens
- `artifacts/api-server/src/routes/sync.ts` — `GET/POST/DELETE /api/sync` data sync endpoint
- `lib/db/src/schema/` — Drizzle schema: `pieces`, `wishlist_items`, `reminders` tables
- `lib/db/src/index.ts` — exports `db` singleton and all schema tables

## Architecture decisions

- **JSONB per-row storage**: each jewelry piece / wishlist item / reminder is one DB row with a `data JSONB` column. Schema changes on the mobile side never require DB migrations.
- **Full-dataset sync**: `POST /api/sync` replaces all rows for the user atomically in a transaction. Works well for personal collections (low row counts), keeps the API surface tiny.
- **Dual-layer persistence**: AsyncStorage is loaded first on app launch (fast/offline), then the API is fetched and takes precedence (authoritative across devices). Local-only data is migrated up on first authenticated load.
- **Debounced push**: mutations update AsyncStorage immediately, then schedule a 1.5 s debounced API push so rapid edits don't spam the server.
- **Clerk JWT**: mobile app calls `getToken()` from `useAuth()` and passes it as `Authorization: Bearer`. Server uses `clerkMiddleware()` + `getAuth(req).userId` — no deprecated `requireAuth()`.

## Product

- **Collection**: photo + full metadata for each jewelry piece (material, gemstones, brand, serial, warranty, diamond bond, repair history, attached documents)
- **Wishlist**: save items from any retailer website with SKU, price, ring size, and priority
- **Reminders**: schedule and recur inspection/service reminders with local notifications
- **Retailer browser**: in-app browser that tracks the live URL as users navigate product variants, enabling accurate wishlist saves

## User preferences

- iOS-first; Expo Go for development
- Color scheme: royal purple/violet — `#5B21B6` (light mode), `#8B5CF6` (dark mode)
- Never create `app.config.ts/js` — use static `app.json` only
- `expo-camera` pinned at `17.0.10` — do not upgrade
- Pre-existing TS errors in `app/piece/[id].tsx` and `hooks/useColors.ts` — do not fix

## Gotchas

- Clerk redirect URIs registered: `exp://...expo.worf.replit.dev/--/` and `diage://`
- API base URL in mobile: `https://${EXPO_PUBLIC_DOMAIN}/api` (set by dev script from `REPLIT_DEV_DOMAIN`)
- `DiGeProvider` is inside `<ClerkLoaded>`, so `useAuth()` is safe to call inside it
- Do NOT use `requireAuth()` from `@clerk/express` — it issues a 302 redirect; use `getAuth(req)` + manual 401 instead
- `expo-notifications` remote push is unsupported in Expo Go (SDK 53+); local notifications work fine

## EAS Environment Variables

Use the new `eas env` commands (the old `eas secret` CLI is deprecated):

```bash
# Set a secret for production builds
eas env:create --name MY_SECRET --value myvalue --environment production --visibility secret

# List all variables for an environment
eas env:list --environment production
```

Environments: `production`, `preview`, `development`.
Visibility options: `public` (baked into bundle), `sensitive` (build-time only), `secret` (server-side, never in bundle).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
