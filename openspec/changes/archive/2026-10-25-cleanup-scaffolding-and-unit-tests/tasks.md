# Tasks

## 1. Extract Filter Utility & Add Unit Tests (`src/utils/filterMedia.js`, `tests/filterMedia.test.js`, `package.json`)

- [x] 1.1 Create `src/utils/filterMedia.js` exporting `normalizeText` and `matchesFilterQuery(query, name, nickname)` and update `src/views/HomeView.vue` to use `matchesFilterQuery` inside `filteredItems`, then verify `npm run build` succeeds
- [x] 1.2 Add `tests/filterMedia.test.js` using `node:test` and `node:assert/strict` covering all word-prefix filter cases from `test_filtering.js`, add `"test": "node --test tests/*.test.js"` to `package.json`, and verify `npm test` passes

## 2. Remove Legacy Scaffolding & Scratch Files

- [x] 2.1 Remove `src/components/HelloWorld.vue`, `src/verify-firebase.js`, `test_filtering.js`, and `test_output.txt`, and verify `npm test` and `npm run build` both pass with zero missing-import errors

## Workflow follow-up

- Archive `cleanup-scaffolding-and-unit-tests` once implementation and verification are complete.
