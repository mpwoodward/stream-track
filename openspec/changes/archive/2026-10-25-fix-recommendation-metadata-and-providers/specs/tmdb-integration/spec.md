# Spec Delta

## MODIFIED Requirements

### Requirement: Search result selection and US watch provider auto-selection
The system SHALL populate the media form from a selected TMDB search result and normalize US `flatrate` watch providers against the shared list of 10 primary streaming services (`AMC+`, `Apple TV`, `Disney+`, `HBO Max`, `Hulu`, `MGM+`, `Netflix`, `Paramount+`, `Peacock`, `Prime Video`).

#### Scenario: Selecting a search result with a matching US flatrate provider
- **WHEN** a user clicks a search result on `/add` and TMDB `/watch/providers` returns a US `flatrate` provider matching one of the 10 primary services (including `+` to ` Plus` name variations and service aliases)
- **THEN** the system pre-fills `name`, `type`, `synopsis`, `release_date`, `tmdb_id`, `poster_path`, sets `status` to `want_to_watch`, and pre-selects the matched canonical streaming service

#### Scenario: Selecting a search result without a matching US flatrate provider
- **WHEN** a user clicks a search result on `/add` and no US `flatrate` provider matches the 10 primary services (or the provider lookup fails)
- **THEN** the system pre-fills the item metadata and pre-selects `Other` when an unrecognized US `flatrate` provider exists, or leaves the streaming service field unselected when no US `flatrate` provider exists
