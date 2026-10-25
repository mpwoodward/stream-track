# app-shell-pwa Specification

## Purpose

Defines the global application shell, URL-synchronized bottom tab navigation, contextual header controls, and Progressive Web App (PWA) service worker update lifecycle.

## Requirements

### Requirement: URL-synchronized bottom tab navigation
The system SHALL display a persistent bottom navigation bar for authorized users with four tabs (`watching`, `want_to_watch`, `watched`, and `recommendations`) and keep the active tab synchronized with the `tab` URL query parameter on `/`.

#### Scenario: Default home tab when no query parameter is provided
- **WHEN** an authorized user visits `/` without a `tab` query parameter
- **THEN** the system defaults the active tab to `watching`

#### Scenario: Switching tabs updates the URL query parameter
- **WHEN** an authorized user clicks a tab in the bottom navigation bar
- **THEN** the system navigates to `/?tab=<selected-tab-id>` and renders the corresponding list or recommendations view

#### Scenario: Browser back/forward navigation updates the active tab
- **WHEN** the `tab` query parameter changes to a valid tab identifier via browser navigation
- **THEN** the home view updates its active tab state to match the URL query parameter

### Requirement: Contextual home header controls
The system SHALL render a sticky action bar on the home view containing the search filter input and "+ Add New" button on tracked-list tabs, and MUST hide those controls when viewing the `recommendations` tab.

#### Scenario: Viewing a tracked list tab
- **WHEN** the active tab is `watching`, `want_to_watch`, or `watched`
- **THEN** the sticky header displays the filter input and the "+ Add New" (or "+ Add" when a filter query is present) button

#### Scenario: Viewing the recommendations tab
- **WHEN** the active tab is `recommendations`
- **THEN** the sticky header hides both the filter input and the add button

### Requirement: PWA service worker registration and update prompt
The system SHALL register a Progressive Web App service worker that checks for updates on initial registration and every 60 minutes thereafter, and MUST display a toast notification when new content is available.

#### Scenario: Service worker detects an available update
- **WHEN** the registered service worker detects a new version waiting to activate
- **THEN** the system displays an update toast prompting the user with "Reload" and "Close" actions

#### Scenario: User reloads or dismisses the PWA update toast
- **WHEN** the user clicks "Reload" or "Close" on the PWA update toast
- **THEN** clicking "Reload" activates the new service worker and reloads the app, while clicking "Close" dismisses the toast

### Requirement: Persistent header navigation to Settings
The system SHALL display a persistent navigation control in the global application header for authorized users that navigates to the `/settings` view.

#### Scenario: Navigating to Settings from the application header
- **WHEN** an authorized user clicks the Settings control in the top navigation bar
- **THEN** the system navigates to `/settings` so the user can view or update configuration at any time
