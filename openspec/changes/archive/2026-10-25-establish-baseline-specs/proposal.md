# Proposal

## Why

Stream Track currently has no formal OpenSpec specifications (`openspec/specs/` is empty), making it harder to plan, scope, and validate future feature additions and bug fixes as clean delta changes. Establishing an as-built baseline specification across the application's core domains gives us a complete, validated source of truth before making code changes.

## What Changes

- Introduce initial baseline specifications documenting the existing, as-built behavior of the Stream Track application across 5 cohesive capability domains.
- Record discovered implementation quirks and improvement opportunities as a prioritized backlog in `design.md` so each improvement can be executed as a follow-up OpenSpec change.
- **No application source code changes** are included in this change.

## Capabilities

### New Capabilities
- `auth-access`: Google OAuth authentication, Firestore `allowed_users` email allowlist verification, route guarding, and real-time listener session lifecycle.
- `media-tracking`: Watchlist item CRUD on Firestore (`media_items`), list status lifecycle (`want_to_watch`, `watching`, `watched`), unreleased item status locking, user ratings (`loved`, `liked`, `disliked`), and normalized word-prefix search filtering.
- `tmdb-integration`: TMDB API key resolution and persistence (`config/tmdb` and `localStorage` fallback), multi-search for movies and TV shows, and US flatrate streaming provider matching.
- `recommendations`: Personalized recommendations seeded from watched/watching history, deduplication against tracked and ignored items (`ignored_items`), pagination retries, US provider lookup, and recommendation card actions.
- `app-shell-pwa`: Bottom tab navigation synchronized with URL query parameters (`/?tab=...`), sticky header layout, and PWA service worker registration with hourly update checks and reload prompts.

### Modified Capabilities
<!-- None - no existing specs in openspec/specs/ -->

## Impact

- **Specs**: Creates 5 new capability specifications under `openspec/specs/` when synced/archived (`auth-access`, `media-tracking`, `tmdb-integration`, `recommendations`, `app-shell-pwa`).
- **Application Code**: None (documentation and specification baseline only).
