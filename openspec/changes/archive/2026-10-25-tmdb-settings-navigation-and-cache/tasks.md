# Tasks

## 1. TMDB API Key Cache & Persistence (`src/services/tmdb.js` & `src/views/SettingsView.vue`)

- [x] 1.1 Export `getApiKey` and `saveApiKey(newKey)` in `src/services/tmdb.js` so saving a key writes to `config/tmdb` in Firestore, updates `localStorage.setItem('tmdb_api_key', newKey)`, and immediately updates `cachedKey` in memory, then verify `checkApiKey()` reflects the updated key
- [x] 1.2 Refactor `src/views/SettingsView.vue` to load and save the TMDB API key via `getApiKey` and `saveApiKey` from `src/services/tmdb.js` instead of direct Firestore queries, and verify `npm run build` succeeds

## 2. Global Header Settings Navigation (`src/App.vue`)

- [x] 2.1 Add a persistent `Settings` `<RouterLink to="/settings">` control in the global `<header>` next to `LOGOUT` (and make the brand logo/title link back to `/`) in `src/App.vue`, then verify `npm run build` passes and `/settings` is navigable from the header

## Workflow follow-up

- Archive `tmdb-settings-navigation-and-cache` once implementation and verification are complete.
