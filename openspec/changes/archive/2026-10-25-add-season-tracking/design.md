# Design

## Context

`stream-track` stores each tracked movie or TV show as an individual Firestore document in `media_items` via `src/services/mediaStore.js`. Currently, documents contain `name`, `nickname`, `type` (`'movie'` or `'tv'`), `service`, `status`, `synopsis`, `release_date`, `tmdb_id`, and `poster_path`, with no season field. See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Allow each season of a TV show to be tracked as its own `media_items` document with a normalized `season` field (`number | null`).
- Keep the form and card UI clean: hide `Season` for movies, default `season` to `1` for newly selected/added TV shows, and display ` (S#)` inline in the card title.
- Prevent multi-season TV shows from being over-sampled when selecting recommendation seed items.

**Non-Goals:**
- Grouping or nesting multiple seasons under a single parent show document or collapsible card.
- Fetching season-specific posters, episode counts, or air dates from TMDB `/tv/{id}/season/{season_number}`.
- Filtering by season token (e.g., `"s2"`) in `matchesFilterQuery`; filtering remains strictly on `name` and `nickname`.

## Decisions

1. **Store `season` as a positive integer (`number`) or `null` on `media_items` documents**
   - *Rationale*: Storing `season` directly on each `media_items` record preserves the existing 1-document-per-card model used for status transitions, unreleased date locks, and ratings without schema migration.
   - *Normalization*: When saving in `AddMediaView.vue`, if `form.type === 'movie'` or if `form.season` is blank/non-positive, normalize `season` to `null`. Otherwise, persist `Number(form.season)` (integer `>= 1`).
   - *Alternatives considered*: Appending `(S1)` directly into the persisted `name` string was rejected because it would make editing the show title or changing the season number error-prone.

2. **Default `season` to `1` for newly selected TV shows and recommendation quick-adds**
   - *Rationale*: Most newly tracked shows start at Season 1, and recommendations added via one-click actions (`+` or `Already Watched` in `HomeView.vue`) bypass the form. Defaulting `tv` items to `season: 1` (while leaving `season` optional on the form so users can clear it for miniseries or legacy items) balances convenience and flexibility.
   - *Form behavior in `AddMediaView.vue`*:
     - Selecting a TV search result sets `season: 1` (selecting a movie sets `season: null`).
     - Switching `form.type` from `'movie'` to `'tv'` sets `form.season = 1` if `form.season` is currently empty/`null`; switching to `'movie'` sets `form.season = null`.
     - Editing an existing item preserves `item.season ?? ''` without overwriting an intentionally unset season on an existing TV record.

3. **Format the season suffix in `ShowCard.vue` via a computed property**
   - *Rationale*: Computing `displayTitle` in `ShowCard.vue` (`item.type === 'tv' && item.season ? `${item.name} (S${item.season})` : item.name`) keeps `item.name` clean for filtering (`matchesFilterQuery`) and editing while saving vertical card space.

4. **Deduplicate recommendation seed history by `tmdb_id` in `HomeView.vue`**
   - *Rationale*: `fetchRecommendations` currently filters `mediaItems` to `watching` / `watched` items with a `tmdb_id` and randomly slices 6 items. Deduplicating that candidate list by `tmdb_id` (using a `Map` or `Set` before shuffling) ensures a show with 8 tracked seasons has the same probability of being chosen as a 1-season show or movie, and never occupies multiple slots in the 6-seed sample.

## Risks / Trade-offs

- **[Risk] Legacy TV records in Firestore lack a `season` field** → Mitigation: `ShowCard.vue` only appends ` (S#)` when `item.type === 'tv' && item.season` is truthy, and `AddMediaView.vue` initializes `form.season` to `item.season ?? null` on edit so legacy items render and edit cleanly.
- **[Risk] Recommending a show the user already tracks across seasons** → Mitigation: `existingTmdbIds` in `HomeView.vue` already checks `tmdb_id` across all `mediaItems`, which naturally excludes any show with at least one tracked season from appearing in "For You".
