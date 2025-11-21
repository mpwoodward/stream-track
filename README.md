# Stream Track

A personal media tracking application built with Vue 3 and Vite. Keep track of movies and TV shows you are watching, want to watch, or have finished.

## Features

- **Track Status**: Organize media into "Watching", "Want to Watch", and "Watched" lists.
- **TMDB Integration**: Search for movies and TV shows using The Movie Database (TMDB) API.
- **Smart Recommendations**: Get personalized recommendations based on your viewing history, excluding shows you've already added.
- **Streaming Info**: See which streaming services (US) carry the recommended titles.
- **Advanced Filtering**: Filter your list by title or nickname with "starts-with" logic (e.g., "knives" matches "Wake Up Dead Man: A Knives Out Mystery").
- **Responsive Design**: Mobile-friendly interface with a clean, card-based layout.

## Tech Stack

- **Frontend**: Vue 3, Vite
- **Styling**: Vanilla CSS (Scoped)
- **Data Source**: TMDB API
- **Backend/Storage**: Firebase (Firestore & Auth) - *In Progress*

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    Create a `.env` file in the root directory (or set via local storage for development):
    ```
    VITE_TMDB_API_KEY=your_tmdb_api_key
    ```
    *Note: Currently, the app may look for the API key in `localStorage` under `tmdb_api_key`.*

3.  **Run Locally**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/views`: Main page views (Home, Add, Settings).
- `src/components`: Reusable UI components (ShowCard).
- `src/services`: API integrations (TMDB) and state management (MediaStore).
