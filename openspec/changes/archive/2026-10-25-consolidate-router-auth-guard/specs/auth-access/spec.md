# Spec Delta

## MODIFIED Requirements

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
