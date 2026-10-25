# Design

## Context

Currently, `src/services/tmdb.js` holds a module-scoped `cachedKey` variable that is populated on the first Firestore read of `config/tmdb`. `src/views/SettingsView.vue` imports Firestore (`doc`, `getDoc`, `setDoc`) directly to load and save `config/tmdb` and `localStorage.getItem('tmdb_api_key')`, bypassing `src/services/tmdb.js` and leaving `cachedKey` stale when updated. Additionally, `src/App.vue` renders a top `<header>` with the brand logo/title on the left and a `LOGOUT` button on the right, with no link to `/settings`. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Encapsulate TMDB API key retrieval, caching, and persistence inside `src/services/tmdb.js`.
- Expose a clean, accessible Settings navigation control in the global `<header>` in `src/App.vue` for authorized users.

**Non-Goals:**
- Adding a 5th tab to the mobile bottom navigation bar (since `/settings` is an infrequent administrative screen rather than a primary viewing list).

## Decisions

### 1. Encapsulate API Key Persistence in `src/services/tmdb.js`
- **Decision**: Export `getApiKey()` and `saveApiKey(newKey)` from `src/services/tmdb.js`. `saveApiKey(newKey)` writes `{ key: newKey }` to Firestore `config/tmdb`, updates `localStorage.setItem('tmdb_api_key', newKey)`, and sets `cachedKey = newKey || null`. `SettingsView.vue` will call `getApiKey()` on mount and `saveApiKey(tmdbKey.value)` on save instead of accessing Firestore directly.
- **Rationale**: Eliminates duplicate Firestore/localStorage logic between `SettingsView.vue` and `tmdb.js` and guarantees `cachedKey` is always coherent after a save.
- **Alternatives Considered**:
  - *Export `clearCachedApiKey()` only and keep Firestore writes in `SettingsView.vue`*: Still duplicates collection/document path strings (`config/tmdb`) and `localStorage` keys across two files.

### 2. Header Navigation Control in `src/App.vue`
- **Decision**: Place a `Settings` link (`<RouterLink to="/settings">`) in the right-side header action group next to the `LOGOUT` button in `src/App.vue`, and make the `.brand` logo/title clickable to navigate back to `/`.
- **Rationale**: Keeps the 4-tab bottom bar focused on media lists while making `/settings` reachable from any route on both mobile and desktop viewports.

## Risks / Trade-offs

- **[Risk] Saving an empty string clears the API key** -> **Mitigation**: Setting `cachedKey = newKey || null` ensures `checkApiKey()` accurately returns `false` if the key is cleared.
