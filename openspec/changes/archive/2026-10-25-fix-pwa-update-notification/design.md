# Design

## Context

In `src/App.vue`, `useRegisterSW` from `virtual:pwa-register/vue` already registers the service worker (`registerType: 'prompt'` in `vite.config.js`) and exposes `needRefresh` and `updateServiceWorker`. However:
1. `.pwa-toast` is styled with `position: fixed; bottom: 0; right: 0; z-index: 100`, while `.bottom-nav` uses `position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000`. The bottom navigation bar completely covers the update toast.
2. `onRegistered(r)` only calls `r.update()` once at startup and inside a 60-minute `setInterval`, which is suspended when an installed PWA is in the background on mobile OSes.

See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Ensure the PWA update toast is always visible above `.bottom-nav` on both mobile and desktop viewports and supports light/dark color schemes.
- Trigger `r.update()` when the app returns to the foreground (`visibilitychange` to `visible`) so backgrounded PWAs detect new deployments immediately upon reopen.

**Non-Goals:**
- Changing the service worker caching strategy or switching from `prompt` to `autoUpdate` (we want the user to explicitly confirm reloading).
- Adding a separate backend version-polling endpoint.

## Decisions

- **Foreground update check via `visibilitychange`**:
  - Inside `onRegistered(r)` in `src/App.vue`, register a `document.addEventListener('visibilitychange', ...)` listener that calls `r.update()` when `document.visibilityState === 'visible'`.
  - *Alternative considered*: Listening to `window` `focus` events. `visibilitychange` is standard across mobile standalone PWAs (iOS Safari/WebKit and Android Chrome) when switching apps or unlocking the device.
- **Toast elevation and positioning above `.bottom-nav`**:
  - Set `.pwa-toast` `z-index: 1100` (above `.bottom-nav`'s `z-index: 1000`) and `bottom: calc(80px + env(safe-area-inset-bottom, 0px))` so it clears the bottom navigation bar on all screen sizes.
  - Constrain width and horizontal margins (`left: 16px; right: 16px` on mobile or `max-width: 420px; margin-left: auto` on larger screens) and add `@media (prefers-color-scheme: dark)` styling matching `.bottom-nav`.

## Risks / Trade-offs

- **Frequent foreground switches triggering `r.update()`** → Browser service worker `registration.update()` is a lightweight byte-comparison check of `sw.js` and is naturally coalesced by the browser; no rate-limiting overhead is required, and errors can be safely ignored when offline.
