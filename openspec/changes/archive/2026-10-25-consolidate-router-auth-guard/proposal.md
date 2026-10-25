# Proposal

## Why

`router.beforeEach` currently registers a new `auth.onAuthStateChanged` listener on every navigation and resolves as soon as Firebase Auth returns a user—before the asynchronous Firestore `allowed_users` check in `useAuth.js` completes. This splits route access control across `router/index.js` and a secondary redirect watcher in `App.vue` and leaves unused variables and exploratory comments in the router guard.

## What Changes

- Expose an `awaitAuthReady()` helper from `src/composables/useAuth.js` that resolves once both initial Firebase Authentication and the Firestore `allowed_users` verification have settled (`authLoading.value === false`).
- Update `router.beforeEach` in `src/router/index.js` to await `awaitAuthReady()` from `useAuth()` and enforce both authentication (`user.value`) and allowlist authorization (`isAllowed.value`) directly in the navigation guard before entering any protected route.
- Remove the duplicate direct `auth.onAuthStateChanged` listener and commentary in `src/router/index.js`.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `auth-access`: Update `Route access protection` so the router navigation guard directly awaits both authentication and allowlist verification before permitting navigation to protected routes.

## Impact

- `src/composables/useAuth.js` (`awaitAuthReady` readiness helper)
- `src/router/index.js` (consolidated `router.beforeEach` guard)
- `src/App.vue` (streamlined auth/allowlist watcher)
