# recommendations Specification

## Purpose

Generates personalized movie and TV show recommendations based on the user's viewing history, enriches them with US streaming provider info, filters out already-tracked or dismissed titles, and provides quick-action workflows.

## Requirements

### Requirement: History-seeded recommendation generation
The system SHALL generate recommendations on the "For You" (`recommendations`) tab by deduplicating tracked `watching` and `watched` items by `tmdb_id`, randomly sampling up to 6 distinct seed items, and fetching up to 6 new TMDB recommendations per seed item.

#### Scenario: Fetching recommendations from viewing history
- **WHEN** a user navigates to the "For You" (`recommendations`) tab and has tracked items in `watching` or `watched` with `tmdb_id` values
- **THEN** the system deduplicates eligible items by `tmdb_id`, selects up to 6 random distinct seed items, queries TMDB `/recommendations` for each seed, and displays up to 6 unique recommendations per seed item enriched with their `release_date` and normalized US `flatrate` streaming service name

#### Scenario: Multiple tracked seasons of the same show count as one seed candidate
- **WHEN** the user's `watching` or `watched` history contains multiple records sharing the same `tmdb_id` (such as multiple seasons of the same TV show)
- **THEN** the system includes at most one candidate for that `tmdb_id` when sampling seed items

#### Scenario: No eligible history items exist
- **WHEN** a user navigates to the "For You" tab and has no `watching` or `watched` items with a `tmdb_id`
- **THEN** the system finishes loading immediately and displays the empty state for "For You"

### Requirement: Recommendation deduplication and pagination retries
The system SHALL exclude any recommended title whose `tmdb_id` already exists in tracked `media_items`, `ignored_items`, or the current recommendation list, and MUST advance through up to 5 TMDB pages when a page yields zero new recommendations.

#### Scenario: Filtering out tracked and ignored titles
- **WHEN** TMDB returns candidate recommendations for a seed item
- **THEN** the system skips any candidate whose `tmdb_id` matches an existing tracked item, an ignored item, or an already-collected recommendation

#### Scenario: Paginating to load more recommendations
- **WHEN** a user clicks "Show more recommendations ..." at the bottom of the "For You" tab
- **THEN** the system increments the recommendation page counter, preserves existing displayed recommendations, and appends newly discovered recommendations

#### Scenario: Exhausting available recommendations after retries
- **WHEN** the system scans up to 5 consecutive pages across the sampled seed items without finding any new, non-excluded recommendations
- **THEN** the system stops retrying and displays "No more recommendations available."

### Requirement: Recommendation card actions
The system SHALL present specialized actions on recommendation cards allowing users to add a title to their watchlist, mark it as already watched, dismiss it as not interested, or open its external TMDB page, while hiding user rating controls.

#### Scenario: Adding a recommendation to the watchlist
- **WHEN** a user clicks the `+` (Add to Watchlist) icon on a recommendation card
- **THEN** the system creates a new `media_items` record with `status` set to `want_to_watch`, `service` set to the recommendation's normalized `streamingService` (or `'Unknown'`), `season` set to `1` when `type` is `tv` (or `null` when `type` is `movie`), and preserves `tmdb_id`, `poster_path`, and `release_date`, removes the card from recommendations, and switches to the `want_to_watch` tab

#### Scenario: Marking a recommendation as already watched
- **WHEN** a user clicks "Already Watched" on a recommendation card
- **THEN** the system creates a new `media_items` record with `status` set to `watched`, `service` set to the recommendation's normalized `streamingService` (or `'Unknown'`), `season` set to `1` when `type` is `tv` (or `null` when `type` is `movie`), and preserves `tmdb_id`, `poster_path`, and `release_date`, removes the card from recommendations, and switches to the `watched` tab

#### Scenario: Dismissing a recommendation as not interested
- **WHEN** a user clicks "Not Interested" on a recommendation card
- **THEN** the system immediately removes the card from the displayed recommendations and persists the item's `tmdb_id`, `type`, and `name` to `ignored_items`

#### Scenario: Opening external TMDB details
- **WHEN** a user clicks "Learn More" on a recommendation card
- **THEN** the system opens `https://www.themoviedb.org/{movie|tv}/{tmdb_id}` in a new browser tab
