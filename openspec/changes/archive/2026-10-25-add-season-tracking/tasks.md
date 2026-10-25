# Tasks

## 1. Add/Edit Form Season Input

- [x] 1.1 Add the optional `Season` numeric input (`min="1"`, `step="1"`) to `src/views/AddMediaView.vue` rendered only when `form.type === 'tv'`, default `season` to `1` on TV search selection or switching `type` to `tv`, and normalize `season` to a positive integer or `null` (and always `null` for `movie` items) on save; verify with unit tests in `tests/seasonTracking.test.js` (`npm test`) and `npm run build`.

## 2. Card Title Season Suffix Display

- [x] 2.1 Update `src/components/ShowCard.vue` to render `{{ item.name }} (S{{ item.season }})` when `item.type === 'tv'` and `item.season` is present, while rendering `{{ item.name }}` for movies and TV items without a season; verify with unit tests in `tests/seasonTracking.test.js` (`npm test`) and `npm run build`.

## 3. Recommendations Seeding and Quick-Add Season Support

- [x] 3.1 Update `src/views/HomeView.vue` to deduplicate eligible `watching` and `watched` history items by `tmdb_id` before sampling up to 6 random seed items, and set `season: 1` when adding `tv` recommendations (`null` for `movie`) via `addToWatchlist` or `Already Watched`; verify with unit tests in `tests/seasonTracking.test.js` (`npm test`) and `npm run build`.
