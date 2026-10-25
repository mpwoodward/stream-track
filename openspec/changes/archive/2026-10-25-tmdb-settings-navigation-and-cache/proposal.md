# Proposal

## Why

Once a TMDB API key is configured, the warning banner in `AddMediaView.vue` hides, leaving users with no in-app navigation link to `/settings` to inspect or rotate their key. Furthermore, when a user updates their API key on `/settings`, `cachedKey` in `src/services/tmdb.js` remains stale in memory for the lifetime of the browser tab until a full page reload.

## What Changes

- Centralize TMDB API key persistence (`getApiKey`, `saveApiKey`, `setCachedApiKey`) in `src/services/tmdb.js` so saving a new key on `/settings` immediately updates `cachedKey` in memory alongside Firestore (`config/tmdb`) and `localStorage` (`tmdb_api_key`).
- Add a persistent "Settings" navigation control in the global application header (`src/App.vue`) for authorized users so `/settings` is reachable from any screen at any time.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `tmdb-integration`: Update `TMDB API key resolution and storage` so saving an API key in `/settings` also updates or invalidates the in-memory cached key immediately without requiring a page reload.
- `app-shell-pwa`: Add a requirement for persistent header navigation to `/settings` (and returning home via the brand header) for authorized users.

## Impact

- `src/services/tmdb.js` (`getApiKey`, `saveApiKey`, in-memory `cachedKey` update)
- `src/views/SettingsView.vue` (delegates key loading/saving to `src/services/tmdb.js`)
- `src/App.vue` (header navigation link to `/settings`)
