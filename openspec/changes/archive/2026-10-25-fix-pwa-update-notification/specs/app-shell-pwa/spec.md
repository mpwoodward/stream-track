# Spec Delta

## MODIFIED Requirements

### Requirement: PWA service worker registration and update prompt
The system SHALL register a Progressive Web App service worker that checks for updates on initial registration, every 60 minutes thereafter, and whenever the application returns to the foreground, and MUST display an unobstructed toast notification above the bottom navigation bar when new content is available.

#### Scenario: Service worker checks for updates when returning to foreground
- **WHEN** the application visibility state changes to `visible` after a service worker is registered
- **THEN** the system triggers a service worker update check (`r.update()`)

#### Scenario: Service worker detects an available update
- **WHEN** the registered service worker detects a new version waiting to activate
- **THEN** the system displays an update toast visibly above the bottom navigation bar prompting the user with "Reload" and "Close" actions

#### Scenario: User reloads or dismisses the PWA update toast
- **WHEN** the user clicks "Reload" or "Close" on the PWA update toast
- **THEN** clicking "Reload" activates the new service worker and reloads the app, while clicking "Close" dismisses the toast
