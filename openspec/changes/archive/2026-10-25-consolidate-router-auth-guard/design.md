# Design

## Context

`src/composables/useAuth.js` registers a module-scoped `onAuthStateChanged(auth, async (currentUser) => ...)` listener that sets `authLoading.value = true`, checks `allowed_users/<email>` in Firestore when `currentUser` is present, updates `isAllowed.value`, and sets `authLoading.value = false`. Meanwhile, `src/router/index.js` defines its own `getCurrentUser()` promise using `auth.onAuthStateChanged` on every navigation, which resolves before the Firestore `allowed_users` check in `useAuth.js` completes. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Ensure `useAuth.js` is the single source of truth for authentication state, allowlist status, and initialization readiness.
- Enforce both `user.value` and `isAllowed.value` inside `router.beforeEach` after `useAuth` finishes loading.

**Non-Goals:**
- Changing the Firestore `allowed_users` schema or Google OAuth sign-in flow.

## Decisions

### 1. Expose `awaitAuthReady()` from `useAuth.js`
- **Decision**: Add an `awaitAuthReady()` function to `useAuth()` in `src/composables/useAuth.js` that returns `Promise.resolve()` immediately when `authLoading.value === false`, or returns a promise that resolves as soon as the `onAuthStateChanged` + Firestore allowlist check completes and sets `authLoading.value = false`.
- **Rationale**: Reuses the single global `onAuthStateChanged` listener in `useAuth.js` rather than attaching and detaching temporary Firebase Auth listeners on every route transition, and guarantees `isAllowed.value` has settled before `router.beforeEach` evaluates route access.
- **Alternatives Considered**:
  - *Keep `getCurrentUser()` in `router/index.js` and duplicate the Firestore `allowed_users` query inside the router*: Duplicates Firestore reads and state management across two modules.

## Risks / Trade-offs

- **[Risk] Initial route navigation waits for Firestore `allowed_users` read** -> **Mitigation**: `App.vue` already renders `<div v-if="authLoading" class="loading-screen">Loading...</div>` until `authLoading` is `false`, so awaiting `awaitAuthReady()` in the router aligns route resolution with the existing loading screen.
