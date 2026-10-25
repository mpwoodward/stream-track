# Spec Delta

## MODIFIED Requirements

### Requirement: Media item creation and editing
The system SHALL allow authorized users to create, edit, and delete tracked media items with a name, optional nickname, release date, media type (`movie` or `tv`), optional positive integer season number (for `tv` items only), streaming service, status (`want_to_watch`, `watching`, or `watched`), and synopsis.

#### Scenario: User saves a new media item
- **WHEN** an authorized user submits the add-media form with required fields (`name`, `type`, `service`, `status`)
- **THEN** the system persists the item with a creation timestamp and navigates to the home view tab matching the saved item's status

#### Scenario: User edits an existing media item
- **WHEN** an authorized user opens the edit view for a tracked item, modifies its details, and submits the form
- **THEN** the system updates the persisted item and navigates to the home view tab matching the item's status

#### Scenario: User deletes an existing media item
- **WHEN** an authorized user clicks delete on the edit view and confirms the deletion prompt
- **THEN** the system removes the item from persistent storage and navigates to the home view

#### Scenario: Editing a non-existent media item
- **WHEN** an authorized user navigates to the edit route for an item ID that does not exist in the tracked list
- **THEN** the system redirects the user to the home view

## ADDED Requirements

### Requirement: TV season input and display formatting
The system SHALL display an optional positive integer `Season` input in the add/edit form only when `type` is `tv`, default `season` to `1` when a TV show is selected on `/add`, omit or clear `season` when `type` is `movie`, and append ` (S#)` to the displayed card title when a `tv` item has a season number.

#### Scenario: Selecting or configuring a TV show in the form
- **WHEN** a user selects a TV show search result on `/add` or changes the media `type` to `tv`
- **THEN** the form displays the `Season` field and defaults its value to `1` if not already set

#### Scenario: Hiding and clearing season for movies
- **WHEN** the media `type` in the add or edit form is `movie`
- **THEN** the form hides the `Season` field and saves the item with `season` set to `null`

#### Scenario: Displaying a TV show card with a season number
- **WHEN** a tracked `tv` item has a positive integer `season` value (e.g., `2`)
- **THEN** the media card renders the title with ` (S#)` appended (e.g., `Scrubs (S2)`)

#### Scenario: Displaying a movie or a TV show without a season number
- **WHEN** a tracked item is a `movie` or is a `tv` item without a `season` value
- **THEN** the media card renders the item's `name` without a season suffix
