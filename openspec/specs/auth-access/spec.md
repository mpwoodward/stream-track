# auth-access Specification

## Purpose

Governs user authentication, email allowlist authorization, route access control, and session-scoped data synchronization for Stream Track.

## Requirements

### Requirement: Google OAuth sign-in
The system SHALL authenticate users via Google OAuth sign-in before granting access to application views.

#### Scenario: User signs in with Google
- **WHEN** an unauthenticated user clicks the Google sign-in button on the login screen
- **THEN** the system initiates a Google OAuth sign-in flow and evaluates the authenticated account against the allowlist

#### Scenario: Existing session is cleared before re-authentication
- **WHEN** a user who is signed in but not authorized clicks the sign-in button to switch accounts
- **THEN** the system signs out the current session before starting a new Google OAuth sign-in flow

### Requirement: Email allowlist verification
The system SHALL verify that an authenticated user's email address exists in the configured allowlist store before marking the user as authorized.

#### Scenario: Allowlisted user is granted access
- **WHEN** a user completes Google sign-in and their email address matches an entry in the allowlist
- **THEN** the system marks the user as authorized and redirects them to the home view

#### Scenario: Non-allowlisted user is denied access
- **WHEN** a user completes Google sign-in and their email address does not exist in the allowlist
- **THEN** the system marks the user as unauthorized, displays an allowlist error message, and keeps the user on the login view

#### Scenario: Allowlist verification failure
- **WHEN** the allowlist lookup fails due to a storage or permission error
- **THEN** the system marks the user as unauthorized and displays a permission verification error message

### Requirement: Route access protection
The system SHALL restrict navigation to all non-login routes by awaiting both authentication and allowlist verification in the router navigation guard so that unauthenticated or unauthorized users are redirected to the login view before protected routes resolve.

#### Scenario: Unauthenticated navigation to protected route
- **WHEN** an unauthenticated user navigates to the home, add, edit, or settings route
- **THEN** the system redirects the user to the login route

#### Scenario: Authenticated but unauthorized navigation to protected route
- **WHEN** an authenticated user whose email is not in the allowlist navigates directly to the home, add, edit, or settings route
- **THEN** the router navigation guard awaits allowlist verification and redirects the user to the login route

#### Scenario: Initial authentication loading state
- **WHEN** the application is verifying authentication and allowlist status on load
- **THEN** the system displays a loading screen instead of rendering protected navigation or views

### Requirement: Session lifecycle and data subscription cleanup
The system SHALL subscribe to tracked and ignored media data only while an authorized user is signed in, and MUST clear local state and subscriptions upon logout.

#### Scenario: Authorized user signs out
- **WHEN** an authorized user activates the logout control in the header
- **THEN** the system terminates active media and ignored-item subscriptions, clears in-memory media lists, signs out the user, and redirects to the login route
