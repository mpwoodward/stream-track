# Design

## Context

In the current codebase, `AddMediaView.vue` contains an inline `supportedServices` array (`AMC+`, `Apple TV`, `Disney+`, `HBO Max`, `Hulu`, `MGM+`, `Netflix`, `Paramount+`, `Peacock`, `Prime Video`) and fuzzy-matches US `flatrate` providers returned by `getWatchProviders`. Meanwhile, `HomeView.vue` reads `providers.results?.US?.flatrate?.[0]?.provider_name` directly without normalization and omits `tmdb_id`, `poster_path`, and `release_date` when saving a recommendation via `addToWatchlist`. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Provide a single source of truth in `src/services/tmdb.js` for the supported streaming services list and US `flatrate` provider normalization.
- Ensure every media item created from a recommendation card (`+` Add to Watchlist or `Already Watched`) retains full TMDB metadata (`tmdb_id`, `poster_path`, `release_date`) and a valid `service` value selectable in `AddMediaView.vue`.

**Non-Goals:**
- Migrating existing Firestore `media_items` documents that were saved prior to this change.
- Fetching non-US or non-`flatrate` (rent/buy) watch providers.

## Decisions

### 1. Centralize Provider Normalization in `src/services/tmdb.js`
- **Decision**: Export `PRIMARY_STREAMING_SERVICES` (the 10 major services), `STREAMING_SERVICE_OPTIONS` (`[...PRIMARY_STREAMING_SERVICES, 'Other', 'Unknown']`), and a pure helper `matchUsFlatrateProvider(providersData, { fallbackWhenEmpty = '' } = {})` from `src/services/tmdb.js`.
  - When `providersData?.results?.US?.flatrate` contains at least one provider matching `PRIMARY_STREAMING_SERVICES` (handling substring inclusion, `+` <-> ` Plus`, and `Max` -> `HBO Max`), return that canonical service name.
  - When `flatrate` is non-empty but none match the 10 primary services, return `'Other'`.
  - When `flatrate` is empty or missing, return `fallbackWhenEmpty` (`''` for `/add` search result selection so the user is prompted to choose, or `'Unknown'` when saving a recommendation).
- **Rationale**: Keeps `AddMediaView.vue` and `HomeView.vue` synchronized and makes provider normalization pure and unit-testable.
- **Alternatives Considered**:
  - *Store raw TMDB provider names and switch `<select>` to `<input type="text">`*: Loses consistent service naming across cards and allows typos.

### 2. Preserve Complete TMDB Metadata on Recommendation Actions
- **Decision**: Include `release_date: rec.release_date || rec.first_air_date || ''` on recommendation objects constructed in `fetchRecommendations`, and pass `tmdb_id`, `poster_path`, and `release_date` in both `addToWatchlist` and `moveStatus` (`status === 'recommendation'`) in `src/views/HomeView.vue`.
- **Rationale**: Aligns recommendation-created items with search-created items in `AddMediaView.vue`, enabling poster rendering, external TMDB links, unreleased-date locking, and `tmdb_id` deduplication.

## Risks / Trade-offs

- **[Risk] TMDB rebrands a streaming service (e.g., `"Max"` vs `"HBO Max"`)** -> **Mitigation**: Centralizing matching in `matchUsFlatrateProvider` with an explicit alias map (`Max` -> `HBO Max`) ensures a single place to update provider aliases.
