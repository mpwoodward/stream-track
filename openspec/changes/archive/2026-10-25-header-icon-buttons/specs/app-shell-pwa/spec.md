# Spec Delta

## MODIFIED Requirements

### Requirement: Persistent header navigation to Settings
The system SHALL display persistent, compact icon controls with accessible labels (`aria-label`) for Settings and Logout in the global application header for authorized users so that all header elements fit within mobile and desktop viewports without overflowing the header bar.

#### Scenario: Navigating to Settings from the application header
- **WHEN** an authorized user clicks the Settings icon control in the top navigation bar
- **THEN** the system navigates to `/settings` so the user can view or update configuration at any time

#### Scenario: Header action controls fit within mobile viewports
- **WHEN** an authorized user views the application on a mobile viewport
- **THEN** the brand link, Settings icon control, and Logout icon control remain fully contained within the header bar with accessible labels for each action
