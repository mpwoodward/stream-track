# Proposal

## Why

On mobile screens such as the Pixel 10 XL, the combined horizontal padding and full-text header controls (`Settings` and `LOGOUT`) exceed the available width of the top navigation bar, causing the logout button to overflow outside the header bar. Replacing the text controls with compact inline SVG icon buttons and tightening header spacing ensures the top navigation bar fits cleanly on mobile viewports while preserving clear visual semantics and accessibility.

## What Changes

- Replace the text-based `Settings` link and `LOGOUT` button in the global application header (`src/App.vue`) with compact inline SVG icon controls (a gear icon for Settings and a log-out icon for Logout).
- Add accessible labels (`aria-label` and `title`) to both icon controls so screen readers and assistive technologies identify their actions clearly.
- Tighten header padding and action spacing in `src/App.vue` so the brand logo, title, and header action buttons fit comfortably inside the header bar across mobile and desktop viewports without overflowing.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `app-shell-pwa`: Update the global application header requirement to specify compact icon controls with accessible labels for Settings and Logout that fit within mobile viewports without overflowing the header bar.

## Impact

- **`src/App.vue`**: Template markup and scoped styles for `<header>`, `<nav>`, `.header-actions`, `.settings-link`, and `.logout-btn`.
- **No external dependencies or API changes**: Uses inline SVGs with `currentColor` stroke to preserve existing active/hover and danger color states.
