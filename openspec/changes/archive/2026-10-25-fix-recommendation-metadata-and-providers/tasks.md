# Tasks

## 1. Shared Streaming Provider Normalization (`src/services/tmdb.js`)

- [x] 1.1 Export `PRIMARY_STREAMING_SERVICES`, `STREAMING_SERVICE_OPTIONS`, and `matchUsFlatrateProvider(providersData, options)` in `src/services/tmdb.js` and verify with a Node test script or `npm run build` that matching covers the 10 primary services, `+` to ` Plus` variations, `Max` -> `HBO Max`, `'Other'` for unrecognized US flatrate providers, and the configured empty fallback (`''` or `'Unknown'`)

## 2. Recommendation Metadata & Provider Integration (`src/views/HomeView.vue` & `src/views/AddMediaView.vue`)

- [x] 2.1 Update `fetchRecommendations`, `addToWatchlist`, and `moveStatus` in `src/views/HomeView.vue` to use `matchUsFlatrateProvider` and preserve `tmdb_id`, `poster_path`, and `release_date` (`rec.release_date || rec.first_air_date || ''`), and verify that both `+` (Add to Watchlist) and `Already Watched` pass all metadata fields to `addMediaItem`
- [x] 2.2 Update `src/views/AddMediaView.vue` to render `STREAMING_SERVICE_OPTIONS` (`AMC+` through `Prime Video`, plus `Other` and `Unknown`) in the service `<select>` and use `matchUsFlatrateProvider` in `selectResult`, then verify `npm run build` succeeds without errors

## Workflow follow-up

- Archive `fix-recommendation-metadata-and-providers` once implementation and verification are complete.
