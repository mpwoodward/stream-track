# media-tracking Specification

## Purpose

Manages the user's tracked movies and TV shows, including creation, editing, deletion, watch-status lifecycle transitions, unreleased media locking, ratings, and word-prefix list filtering.

## Requirements

### Requirement: Media item creation and editing
The system SHALL allow authorized users to create, edit, and delete tracked media items with a name, optional nickname, release date, media type (`movie` or `tv`), streaming service, status (`want_to_watch`, `watching`, or `watched`), and synopsis.

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

### Requirement: Supported streaming service selection
The system SHALL require each manually added or edited media item to specify a streaming service from the supported service list (`AMC+`, `Apple TV`, `Disney+`, `HBO Max`, `Hulu`, `MGM+`, `Netflix`, `Paramount+`, `Peacock`, `Prime Video`, `Other`, `Unknown`).

#### Scenario: Choosing a streaming service on add or edit
- **WHEN** a user configures a media item in the add or edit form
- **THEN** the form requires selecting one of the supported streaming services (the 10 primary streaming services, `Other`, or `Unknown`) before saving

#### Scenario: Editing a media item added from recommendations with Unknown or Other service
- **WHEN** a user opens the edit view for a media item whose `service` is `Unknown` or `Other`
- **THEN** the streaming service selector displays the existing `Unknown` or `Other` value as a valid selection without requiring the user to pick one of the 10 primary services unless desired

### Requirement: Watch status transitions
The system SHALL organize tracked media items into `watching`, `want_to_watch`, and `watched` lists ordered by creation timestamp descending, and MUST provide quick-action buttons on each item card to transition between statuses.

#### Scenario: Moving a released item from Want to Watch to Watching
- **WHEN** a user clicks "Start Watching" on a released item in the "To Watch" (`want_to_watch`) list
- **THEN** the system updates the item's status to `watching`

#### Scenario: Moving an item from Watching to Watched or back to Want to Watch
- **WHEN** a user clicks "Finished" or "Wait" on an item in the "Watching" (`watching`) list
- **THEN** the system updates the item's status to `watched` (for "Finished") or `want_to_watch` (for "Wait")

#### Scenario: Moving an item from Watched back to Watching or Want to Watch
- **WHEN** a user clicks "Watching" or "Wait" on an item in the "Watched" (`watched`) list
- **THEN** the system updates the item's status to `watching` (for "Watching") or `want_to_watch` (for "Wait")

### Requirement: Unreleased media status lock
The system SHALL prevent items with a future release date from transitioning out of `want_to_watch` until their release date arrives.

#### Scenario: Displaying an unreleased item on the To Watch list
- **WHEN** an item in `want_to_watch` has a `release_date` later than the current date
- **THEN** the card hides the "Start Watching" button and displays "Streaming <formatted release date>" instead

#### Scenario: Setting a future release date in the add or edit form
- **WHEN** a user enters or selects a `release_date` later than the current date in the add or edit form
- **THEN** the system automatically sets the status to `want_to_watch` and disables the status selector

### Requirement: Media item ratings
The system SHALL allow users to rate any tracked media item as `loved`, `liked`, or `disliked`, or clear an existing rating by clicking the active rating button again.

#### Scenario: Assigning a rating to a tracked item
- **WHEN** a user clicks the Love, Like, or Dislike button on a tracked item card where that rating is not currently active
- **THEN** the system persists the selected rating (`loved`, `liked`, or `disliked`) on the item

#### Scenario: Clearing an existing rating
- **WHEN** a user clicks the currently active rating button on a tracked item card
- **THEN** the system clears the item's rating by setting it to `null`

### Requirement: Normalized word-prefix filtering
The system SHALL filter items in the active tracked list (`watching`, `want_to_watch`, or `watched`) by matching the normalized query as a word- boundary prefix against either the item's `name` or `nickname`.

#### Scenario: Filtering by word prefix in title
- **WHEN** a user types a query into the filter input (e.g., "knives" or "dead man")
- **THEN** the system normalizes non-alphanumeric characters to spaces, lowercases both query and target, and displays only items whose `name` or `nickname` contains a word or phrase starting with the normalized query

#### Scenario: Substring inside a word does not match
- **WHEN** a user types "al" into the filter input
- **THEN** an item named "All Her Fault" matches while an item named "Malice" does not match

#### Scenario: Filter resets on tab change
- **WHEN** a user switches between bottom navigation tabs
- **THEN** the system clears the current filter query
