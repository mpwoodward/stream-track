# Design

## Context

In `src/App.vue`, `<header>` currently uses `padding: 1rem 2rem` inside `#app` (`padding: 2rem` in `src/style.css`), leaving ~`284px`–`320px` of inner width on mobile screens like the Pixel 10 XL. Meanwhile, `<nav>` has `gap: 1.5rem` and `.header-actions` renders two wide text controls (`Settings` and `LOGOUT`), requiring ~`368px` total and pushing the logout button outside the right edge of the header bar. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Replace the text labels on `.settings-link` and `.logout-btn` with crisp, accessible inline SVG icons.
- Tighten header padding and internal flex gaps so the entire header fits comfortably on mobile screens (`320px`+ viewports, including the Pixel 10 XL) without horizontal overflow.
- Preserve existing color semantics (`#475569` slate default and `#42b983` active/hover for Settings; `#dc2626` red outline and fill on hover for Logout).

**Non-Goals:**
- Redesigning the bottom navigation bar or moving header controls into a drawer or sub-menu.
- Adding an external icon library dependency.

## Decisions

- **Inline SVGs with `stroke="currentColor"` over emoji or external icon packages**:
  - *Rationale*: Inline SVGs require zero npm dependencies, scale crisply on high-DPI mobile screens, and inherit text color via `currentColor` so `.router-link-active` (`#42b983`) and `.logout-btn:hover` (`white` on `#dc2626`) work naturally with CSS transitions.
  - *Alternatives considered*: Emoji icons (cannot inherit CSS color for active green or danger red states); external icon packages like `lucide-vue-next` (unnecessary bundle weight for two icons).
- **Square icon button sizing and tighter header spacing**:
  - *Rationale*: Sizing `.settings-link` and `.logout-btn` as compact square flex containers (`width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center;`) with `18px × 18px` SVGs reduces `.header-actions` width from ~`194px` to ~`80px`. Reducing `header` padding from `1rem 2rem` to `0.75rem 1rem`, `nav` gap from `1.5rem` to `0.75rem`, and `.header-actions` gap from `0.75rem` to `0.5rem` ensures ample breathing room on mobile viewports.
- **Explicit accessibility attributes (`aria-label` and `title`)**:
  - *Rationale*: Icon-only controls require accessible names (`aria-label="Settings"` / `title="Settings"` and `aria-label="Logout"` / `title="Logout"`) for screen readers and hover tooltips.

## Risks / Trade-offs

- **[Risk] Icon-only buttons may be less immediately self-explanatory than text labels** → **Mitigation**: Use universally recognized icons (a standard gear icon for Settings and a door/arrow-right-from-bracket icon for Logout), retain the red danger styling on Logout, and include `title` and `aria-label` attributes on both controls.
