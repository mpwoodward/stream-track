# Tasks

## 1. Header Icon Controls and Layout

- [x] 1.1 Replace the text labels inside `.settings-link` and `.logout-btn` in `src/App.vue` with inline SVG icons (`stroke="currentColor"`, `aria-hidden="true"`) and add `aria-label` and `title` attributes (`"Settings"` and `"Logout"`), verifying both controls preserve their click/navigation behavior and accessible names.
- [x] 1.2 Tighten header spacing and style `.settings-link` and `.logout-btn` as compact square icon buttons (`36px × 36px` with centered flex alignment, `header` padding `0.75rem 1rem`, `nav` gap `0.75rem`, and `.header-actions` gap `0.5rem`) in `src/App.vue`, verifying `npm run build` and `npm test` pass and the header no longer overflows on mobile viewports.
