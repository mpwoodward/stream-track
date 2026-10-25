# Design

## Context

`HomeView.vue` currently defines an inline `normalize` helper inside its `filteredItems` computed property, and `test_filtering.js` in the project root duplicates that logic with `console.log` statements (`test_output.txt`). Unused starter files (`src/components/HelloWorld.vue`, `src/verify-firebase.js`) also remain in `src/`. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Extract the word-prefix filter matching logic into a shared pure module (`src/utils/filterMedia.js`) consumed by both `HomeView.vue` and automated unit tests.
- Provide a zero-dependency automated test runner via `node --test` (`npm test`).
- Remove unused scaffolding and scratch files from the repository.

**Non-Goals:**
- Adding browser/DOM component test dependencies (such as `@vue/test-utils` or `jsdom`).

## Decisions

### 1. Use Node's Built-in Test Runner (`node --test`)
- **Decision**: Wire `"test": "node --test tests/*.test.js"` in `package.json` using `node:test` and `node:assert/strict`.
- **Rationale**: Zero additional npm dependencies to install or maintain, fast execution in any environment, and directly exercises pure ES modules in `src/utils/`.
- **Alternatives Considered**:
  - *Add Vitest*: Heavier dependency footprint when only pure unit tests are needed initially; can be adopted later if Vue component mounting tests are desired.

## Risks / Trade-offs

- **[Risk] Pure utility modules tested under `node --test` must not import browser-only/Vite-only globals** -> **Mitigation**: Keep `src/utils/filterMedia.js` free of Vue or Firebase runtime imports.
