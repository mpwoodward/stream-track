# Proposal

## Why

The repository contains leftover Vite scaffolding and scratch files (`src/components/HelloWorld.vue`, `src/verify-firebase.js`, `test_filtering.js`, and `test_output.txt`), while the filter-matching test cases in `test_filtering.js` only print to the console without assertions or a `package.json` test script.

## What Changes

- Remove unused scaffolding and scratch files: `src/components/HelloWorld.vue`, `src/verify-firebase.js`, `test_filtering.js`, and `test_output.txt`.
- Extract the normalized word-prefix filter helper (`matchesFilterQuery`) into `src/utils/filterMedia.js` and use it in `src/views/HomeView.vue`.
- Convert the test cases from `test_filtering.js` (along with provider-matching tests) into an automated unit test suite using Node's built-in test runner (`node --test`) wired to `"test": "node --test"` in `package.json`.

## Capabilities

### New Capabilities
<!-- None (repo maintenance, refactoring, and automated unit test tooling — skip_specs: true) -->

### Modified Capabilities
<!-- None -->

## Impact

- Removed files: `src/components/HelloWorld.vue`, `src/verify-firebase.js`, `test_filtering.js`, `test_output.txt`
- New utility & tests: `src/utils/filterMedia.js`, `tests/filterMedia.test.js`
- Updated files: `src/views/HomeView.vue`, `package.json` (`test` script)
