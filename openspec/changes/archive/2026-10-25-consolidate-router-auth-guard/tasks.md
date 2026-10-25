# Tasks

## 1. Auth Readiness Helper & Router Guard (`src/composables/useAuth.js` & `src/router/index.js`)

- [x] 1.1 Add `awaitAuthReady()` to `useAuth` in `src/composables/useAuth.js` that resolves once initial Firebase Authentication and the Firestore `allowed_users` verification complete (`authLoading.value === false`), and verify `useAuth()` exports `{ user, isAllowed, authLoading, authError, login, logout, awaitAuthReady }`
- [x] 1.2 Update `router.beforeEach` in `src/router/index.js` to await `awaitAuthReady()` and redirect to `{ name: 'login' }` whenever `!user.value || !isAllowed.value` on protected routes, removing the duplicate direct `auth.onAuthStateChanged` listener, and verify `npm run build` succeeds

## Workflow follow-up

- Archive `consolidate-router-auth-guard` once implementation and verification are complete.
