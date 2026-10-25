# Tasks

## 1. Service Worker Foreground Update Check

- [x] 1.1 Update `onRegistered(r)` in `src/App.vue` to check `r.update()` when `document` `visibilitychange` fires with `document.visibilityState === 'visible'` (in addition to initial startup and the 60-minute interval), and verify `npm run build` succeeds.

## 2. Update Toast Visibility and Styling

- [x] 2.1 Update `.pwa-toast` styles in `src/App.vue` to sit above `.bottom-nav` (`z-index: 1100`, `bottom: calc(80px + env(safe-area-inset-bottom, 0px))`), fit mobile/desktop viewports cleanly, and support `@media (prefers-color-scheme: dark)`, and verify `npm test` and `npm run build` pass.
