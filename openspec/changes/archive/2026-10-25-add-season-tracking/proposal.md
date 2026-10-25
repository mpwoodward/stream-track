# Proposal

## Why

TV shows release multiple seasons over time, and users need to track watch progress, upcoming releases, and ratings per individual season (e.g., *Scrubs* Season 1 vs. *Scrubs* Season 2) as separate records without cluttering the card UI or skewing recommendation seeding.

## What Changes

- Add an optional positive integer `season` field to tracked media items when the media `type` is `tv`.
- Hide the `Season` input field on the Add/Edit form when `type` is `movie`, and clear/omit `season` on movie items so movies never store a season number.
- Default `season` to `1` when selecting a TV show from TMDB search results on `/add` or when adding a TV show from the "For You" recommendations tab (`Add to Watchlist` or `Already Watched`).
- Display TV items with a season number by appending ` (S#)` to the title on media cards (e.g., `Scrubs (S1)`), while leaving movies and TV items without a season unchanged.
- Keep list filtering matched strictly against `name` and `nickname` so all tracked seasons of a show appear together when filtering.
- Deduplicate eligible `watching` and `watched` history items by `tmdb_id` before sampling up to 6 random seed items for "For You" recommendations so multi-season TV shows only count as a single seed candidate.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `media-tracking`: Support optional per-season tracking on `tv` media items (form visibility/defaults by media type, clearing season for `movie` items, and ` (S#)` title suffix formatting on cards).
- `recommendations`: Deduplicate recommendation seed candidates by `tmdb_id` so multiple tracked seasons of the same show count as one seed candidate, and default `season` to `1` when adding a TV recommendation to tracked lists.

## Impact

- `src/views/AddMediaView.vue`: Conditional `Season` numeric input for `tv` items, default `season: 1` on TV search selection/type switch, and cleanup when saving as `movie`.
- `src/components/ShowCard.vue`: Computed display title appending ` (S#)` when `item.type === 'tv'` and `item.season` is present.
- `src/views/HomeView.vue`: Deduplicate `history` by `tmdb_id` in `fetchRecommendations`, and set `season: 1` for `tv` items in `addToWatchlist` and `moveStatus` (`Already Watched`).
- Unit tests covering `AddMediaView`, `ShowCard`, and `HomeView`.
