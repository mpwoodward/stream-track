# Proposal

## Why

The PWA update notification toast is currently hidden underneath the fixed bottom navigation bar (`z-index: 100` vs `1000` at `bottom: 0`) and only checks for new versions on initial startup or a 60-minute timer—which is suspended when a mobile PWA is backgrounded. As a result, users with an installed PWA are not reliably notified when a new version of the app is deployed.

## What Changes

- Reposition and elevate the `.pwa-toast` notification in `src/App.vue` so it renders above the `.bottom-nav` bar across mobile and desktop viewports and supports dark mode.
- Trigger service worker update checks (`r.update()`) whenever the app returns to the foreground (`document.visibilityState === 'visible'` on `visibilitychange`), in addition to initial registration and the hourly interval.

## Capabilities

### New Capabilities

### Modified Capabilities
- `app-shell-pwa`: Update the `PWA service worker registration and update prompt` requirement to check for updates when the app returns to the foreground and ensure the update toast renders visibly above the persistent bottom navigation bar.

## Impact

- `src/App.vue`: Service worker registration lifecycle and `.pwa-toast` positioning/theme styles.
- `openspec/specs/app-shell-pwa/spec.md`: Updated requirement and scenarios for foreground update checks and toast visibility.
