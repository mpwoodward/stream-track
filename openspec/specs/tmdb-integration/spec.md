# tmdb-integration Specification

## Purpose

Provides integration with The Movie Database (TMDB) API for API key configuration, multi-type media search, metadata enrichment, and US streaming watch provider lookup.

## Requirements

### Requirement: TMDB API key resolution and storage
The system SHALL resolve the TMDB API key using an in-memory cache first, then persistent database configuration (`config/tmdb`), and finally browser `localStorage` (`tmdb_api_key`), and MUST allow authorized users to save a key via the settings view while immediately updating the in-memory cache.

#### Scenario: Resolving API key from persistent configuration
- **WHEN** the application needs to call the TMDB API and no key is cached in memory
- **THEN** the system fetches the key from the `config/tmdb` document and caches it in memory for subsequent requests

#### Scenario: Falling back to localStorage when database config is absent
- **WHEN** the `config/tmdb` document does not exist or has no key
- **THEN** the system falls back to reading `tmdb_api_key` from `localStorage`

#### Scenario: Saving TMDB API key in Settings
- **WHEN** an authorized user enters an API key on the `/settings` view and clicks "Save"
- **THEN** the system writes the key to both the `config/tmdb` database document and `localStorage` under `tmdb_api_key`, and immediately updates the in-memory cached API key so subsequent TMDB requests use the new key without a page reload

#### Scenario: Missing API key warning on Add Media view
- **WHEN** a user visits `/add` and no TMDB API key is available
- **THEN** the system disables the search input and displays a warning linking to `/settings`

### Requirement: Multi-media search
The system SHALL search TMDB using the multi-search endpoint with adult content excluded (`include_adult=false`) and filter results to include only `movie` and `tv` media types.

#### Scenario: Searching for a movie or TV show
- **WHEN** a user enters a search query on `/add` and submits the search
- **THEN** the system queries TMDB `/search/multi` and renders matching `movie` and `tv` results with poster thumbnail, title/name, media type, and 4-digit release or first-air year

#### Scenario: Search returns no movie or TV results
- **WHEN** a search query returns no `movie` or `tv` results
- **THEN** the system clears the search input and displays a message stating no results were found for that query

### Requirement: Search result selection and US watch provider auto-selection
The system SHALL populate the media form from a selected TMDB search result and normalize US `flatrate` watch providers against the shared list of 10 primary streaming services (`AMC+`, `Apple TV`, `Disney+`, `HBO Max`, `Hulu`, `MGM+`, `Netflix`, `Paramount+`, `Peacock`, `Prime Video`).

#### Scenario: Selecting a search result with a matching US flatrate provider
- **WHEN** a user clicks a search result on `/add` and TMDB `/watch/providers` returns a US `flatrate` provider matching one of the 10 primary services (including `+` to ` Plus` name variations and service aliases)
- **THEN** the system pre-fills `name`, `type`, `synopsis`, `release_date`, `tmdb_id`, `poster_path`, sets `status` to `want_to_watch`, and pre-selects the matched canonical streaming service

#### Scenario: Selecting a search result without a matching US flatrate provider
- **WHEN** a user clicks a search result on `/add` and no US `flatrate` provider matches the 10 primary services (or the provider lookup fails)
- **THEN** the system pre-fills the item metadata and pre-selects `Other` when an unrecognized US `flatrate` provider exists, or leaves the streaming service field unselected when no US `flatrate` provider exists
