# Spec Delta

## MODIFIED Requirements

### Requirement: History-seeded recommendation generation
The system SHALL generate recommendations on the "For You" (`recommendations`) tab by randomly sampling up to 6 tracked items with a `tmdb_id` and a status of `watching` or `watched`, and fetching up to 6 new TMDB recommendations per seed item.

#### Scenario: Fetching recommendations from viewing history
- **WHEN** a user navigates to the "For You" (`recommendations`) tab and has tracked items in `watching` or `watched` with `tmdb_id` values
- **THEN** the system selects up to 6 random seed items, queries TMDB `/recommendations` for each seed, and displays up to 6 unique recommendations per seed item enriched with their `release_date` and normalized US `flatrate` streaming service name

#### Scenario: No eligible history items exist
- **WHEN** a user navigates to the "For You" tab and has no `watching` or `watched` items with a `tmdb_id`
- **THEN** the system finishes loading immediately and displays the empty state for "For You"

### Requirement: Recommendation card actions
The system SHALL present specialized actions on recommendation cards allowing users to add a title to their watchlist, mark it as already watched, dismiss it as not interested, or open its external TMDB page, while hiding user rating controls.

#### Scenario: Adding a recommendation to the watchlist
- **WHEN** a user clicks the `+` (Add to Watchlist) icon on a recommendation card
- **THEN** the system creates a new `media_items` record with `status` set to `want_to_watch`, `service` set to the recommendation's normalized `streamingService` (or `'Unknown'`), and preserves `tmdb_id`, `poster_path`, and `release_date`, removes the card from recommendations, and switches to the `want_to_watch` tab

#### Scenario: Marking a recommendation as already watched
- **WHEN** a user clicks "Already Watched" on a recommendation card
- **THEN** the system creates a new `media_items` record with `status` set to `watched`, `service` set to the recommendation's normalized `streamingService` (or `'Unknown'`), and preserves `tmdb_id`, `poster_path`, and `release_date`, removes the card from recommendations, and switches to the `watched` tab

#### Scenario: Dismissing a recommendation as not interested
- **WHEN** a user clicks "Not Interested" on a recommendation card
- **THEN** the system immediately removes the card from the displayed recommendations and persists the item's `tmdb_id`, `type`, and `name` to `ignored_items`

#### Scenario: Opening external TMDB details
- **WHEN** a user clicks "Learn More" on a recommendation card
- **THEN** the system opens `https://www.themoviedb.org/{movie|tv}/{tmdb_id}` in a new browser tab
