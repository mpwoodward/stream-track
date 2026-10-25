# Spec Delta

## MODIFIED Requirements

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
