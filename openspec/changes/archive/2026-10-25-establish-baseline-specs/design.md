# Design

## Context

Stream Track is a Vue 3 + Vite Progressive Web App backed by Firebase Authentication (Google OAuth), Cloud Firestore (`allowed_users`, `media_items`, `ignored_items`, `config/tmdb`), and The Movie Database (TMDB) REST API v3. Prior to this change, `openspec/specs/` was empty. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Partition the existing application behavior into cohesive, domain-level OpenSpec capabilities that minimize cross-spec churn on future changes.
- Capture accurate **as-built** requirements and scenarios matching the current implementation 1:1.
- Document a clear **Post-Baseline Improvements Backlog** for quirks and technical debt discovered during baseline analysis.

**Non-Goals:**
- Modifying any runtime code, build configuration, or Firestore security/data structures during this baseline change.
- Prescribing future bug fixes inside the baseline specs before the code itself is updated.

## Decisions

### 1. Five-Capability Domain Partition
- **Decision**: Organize `openspec/specs/` into five flat capabilities:
  - `auth-access` (`src/composables/useAuth.js`, `src/router/index.js`, `src/views/LoginView.vue`)
  - `media-tracking` (`src/services/mediaStore.js`, `src/views/HomeView.vue`, `src/views/AddMediaView.vue`, `src/components/ShowCard.vue`)
  - `tmdb-integration` (`src/services/tmdb.js`, `src/views/SettingsView.vue`, `src/views/AddMediaView.vue`)
  - `recommendations` (`src/views/HomeView.vue`, `src/components/ShowCard.vue`, `src/services/mediaStore.js`)
  - `app-shell-pwa` (`src/App.vue`, `vite.config.js`)
- **Rationale**: Each capability represents a distinct functional concern. Separating `tmdb-integration` from `media-tracking` and `recommendations` allows API/provider changes to be specified independently from list management or recommendation ranking logic.
- **Alternatives Considered**:
  - *Single monolithic spec*: Simpler initially, but every future change would touch the same spec file.
  - *Per-view specs (`home-view`, `add-view`, `login-view`)*: Couples behavioral contracts to Vue component boundaries rather than user-facing capabilities.

### 2. Document As-Built Behavior First, Track Improvements Separately
- **Decision**: Baseline specs reflect what the code currently does (even where minor inconsistencies exist), while all identified improvements are cataloged below as follow-up changes.
- **Rationale**: A baseline spec should be an honest snapshot of the system today. Fixing behavior in a subsequent OpenSpec change will produce a clean `MODIFIED` delta spec alongside the corresponding code change.

## Post-Baseline Improvements Backlog

The following items were identified during baseline exploration and are queued for follow-up OpenSpec changes after this baseline is archived:

1. **Preserve TMDB Metadata on Recommendation "Add to Watchlist"** (`recommendations` / `media-tracking`)
   - *Location*: `src/views/HomeView.vue` (`addToWatchlist`)
   - *Details*: Clicking `+` (Add to Watchlist) on a recommendation card saves `{ name, type, service, synopsis, status: 'want_to_watch' }` without `tmdb_id` or `poster_path` (whereas "Already Watched" in `moveStatus` saves both). As a result, watchlist items added from recommendations lack poster images and can be recommended again because deduplication checks `tmdb_id`.
2. **Normalize Streaming Service Values from Recommendations** (`recommendations` / `tmdb-integration` / `media-tracking`)
   - *Location*: `src/views/HomeView.vue` (`fetchRecommendations`, `addToWatchlist`, `moveStatus`), `src/views/AddMediaView.vue`
   - *Details*: Recommendations store raw TMDB `provider_name` or `'Unknown'`, which may not match the 10 hardcoded `<select required>` options in `AddMediaView.vue`. Extract a shared provider-matching utility and/or support `'Unknown'` / `'Other'` in the edit form.
3. **Invalidate Cached TMDB API Key on Update** (`tmdb-integration`)
   - *Location*: `src/services/tmdb.js` (`cachedKey`), `src/views/SettingsView.vue` (`saveKey`)
   - *Details*: `cachedKey` in `tmdb.js` is cached in memory for the lifetime of the page and is not updated or cleared when `SettingsView.vue` saves a new key.
4. **Provide UI Navigation to Settings** (`app-shell-pwa` / `tmdb-integration`)
   - *Location*: `src/App.vue`, `src/views/SettingsView.vue`
   - *Details*: `/settings` is only linked from the warning banner in `AddMediaView.vue` when no API key exists. Once a key is configured, users have no in-app navigation link to `/settings`.
5. **Consolidate Router Auth Guard & Allowlist Verification** (`auth-access`)
   - *Location*: `src/router/index.js`, `src/composables/useAuth.js`, `src/App.vue`
   - *Details*: `router.beforeEach` registers a one-off `auth.onAuthStateChanged` promise on every navigation and resolves before the async Firestore `allowed_users` check finishes, relying on a watcher in `App.vue` to redirect unauthorized users.
6. **Clean Up Legacy Scaffolding & Scratch Files** (Repo maintenance)
   - *Location*: `src/components/HelloWorld.vue`, `src/verify-firebase.js`, `test_filtering.js`, `test_output.txt`
   - *Details*: Remove unused scaffolding files and convert `test_filtering.js` into an automated unit test suite.

## Risks / Trade-offs

- **[Risk] As-built specs codify current quirks (e.g., missing `tmdb_id` on `addToWatchlist`)** -> **Mitigation**: Explicitly tracked in the Post-Baseline Improvements Backlog above so follow-up changes can immediately update both the spec scenario and the code.
- **[Risk] Shared Firestore collections (`media_items`, `ignored_items`, `config/tmdb`) have no per-user partitioning** -> **Mitigation**: Acceptable for a personal/household allowlisted app today; if multi-tenant isolation is needed later, it can be introduced via a dedicated change across `auth-access` and `media-tracking`.
