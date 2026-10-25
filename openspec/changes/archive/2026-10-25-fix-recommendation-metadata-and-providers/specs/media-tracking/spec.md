# Spec Delta

## MODIFIED Requirements

### Requirement: Supported streaming service selection
The system SHALL require each manually added or edited media item to specify a streaming service from the supported service list (`AMC+`, `Apple TV`, `Disney+`, `HBO Max`, `Hulu`, `MGM+`, `Netflix`, `Paramount+`, `Peacock`, `Prime Video`, `Other`, `Unknown`).

#### Scenario: Choosing a streaming service on add or edit
- **WHEN** a user configures a media item in the add or edit form
- **THEN** the form requires selecting one of the supported streaming services (the 10 primary streaming services, `Other`, or `Unknown`) before saving

#### Scenario: Editing a media item added from recommendations with Unknown or Other service
- **WHEN** a user opens the edit view for a media item whose `service` is `Unknown` or `Other`
- **THEN** the streaming service selector displays the existing `Unknown` or `Other` value as a valid selection without requiring the user to pick one of the 10 primary services unless desired
