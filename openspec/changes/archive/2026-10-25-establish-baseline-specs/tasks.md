# Tasks

## 1. Baseline Spec Verification

- [x] 1.1 Verify `specs/auth-access/spec.md` requirements and scenarios against `src/composables/useAuth.js`, `src/router/index.js`, and `src/views/LoginView.vue`
- [x] 1.2 Verify `specs/media-tracking/spec.md` requirements and scenarios against `src/services/mediaStore.js`, `src/views/HomeView.vue`, `src/views/AddMediaView.vue`, and `src/components/ShowCard.vue`
- [x] 1.3 Verify `specs/tmdb-integration/spec.md` requirements and scenarios against `src/services/tmdb.js`, `src/views/SettingsView.vue`, and `src/views/AddMediaView.vue`
- [x] 1.4 Verify `specs/recommendations/spec.md` requirements and scenarios against `src/views/HomeView.vue`, `src/components/ShowCard.vue`, and `src/services/mediaStore.js`
- [x] 1.5 Verify `specs/app-shell-pwa/spec.md` requirements and scenarios against `src/App.vue` and `vite.config.js`

## 2. OpenSpec Validation

- [x] 2.1 Run `openspec validate "establish-baseline-specs" --strict` and verify all 5 capability delta specs pass with zero errors or warnings
- [x] 2.2 Verify `git status` confirms no application source files under `src/` were modified

## Workflow follow-up

- Sync or archive `establish-baseline-specs` (via `/openspec-sync-specs` or `/openspec-archive-change`) to promote the 5 capability specs into `openspec/specs/`.
- Verify `openspec list --specs` lists `auth-access`, `media-tracking`, `tmdb-integration`, `recommendations`, and `app-shell-pwa`.
- Propose follow-up OpenSpec changes from the Post-Baseline Improvements Backlog documented in `design.md`.
