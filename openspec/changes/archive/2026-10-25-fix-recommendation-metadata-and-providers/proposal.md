# Proposal

## Why

Adding a recommended title to the watchlist (`+`) currently drops `tmdb_id`, `poster_path`, and `release_date`, resulting in missing poster artwork, broken external TMDB links, and duplicate recommendations on subsequent fetches. Additionally, recommendations store raw TMDB `provider_name` strings or `'Unknown'`, which may not match the 10 supported streaming service options in the add/edit form (`<select required>`), leaving the service selector blank when editing a show added from recommendations.

## What Changes

- Preserve `tmdb_id`, `poster_path`, and `release_date` when adding a recommendation to the watchlist (`addToWatchlist`) or marking it as watched (`moveStatus`) in `src/views/HomeView.vue`, and capture `release_date` (`rec.release_date || rec.first_air_date`) when building recommendation objects.
- Extract a shared US watch-provider normalization helper in `src/services/tmdb.js` that maps TMDB `flatrate` provider names (including `+` to ` Plus` variations and common aliases like `Max` -> `HBO Max` or `Amazon Prime Video` -> `Prime Video`) to the canonical supported service list, falling back to `'Other'` when a provider is unrecognized or `'Unknown'` when no US flatrate provider exists.
- Add `'Other'` and `'Unknown'` as selectable options in the streaming service `<select>` on `src/views/AddMediaView.vue` so items added from recommendations or without one of the 10 primary providers can be edited and saved cleanly without losing their service value.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `recommendations`: Enrich generated recommendation items with `release_date` and normalized streaming service names, and preserve `tmdb_id`, `poster_path`, and `release_date` when adding a recommendation to the watchlist or marking it as watched.
- `media-tracking`: Expand the supported streaming service options in the add/edit form to include `'Other'` and `'Unknown'` alongside the 10 major streaming services so items originating from recommendations or outside the primary providers remain valid on edit.
- `tmdb-integration`: Centralize US `flatrate` watch-provider matching so both search result selection and recommendation enrichment resolve against the shared supported service list.

## Impact

- `src/services/tmdb.js` (shared supported service list and US flatrate provider normalization helper)
- `src/views/HomeView.vue` (`fetchRecommendations`, `addToWatchlist`, `moveStatus`)
- `src/views/AddMediaView.vue` (service `<select>` options and `selectResult` provider matching)
