# Specification

## Summary
**Goal:** Fix the Admin Login page so the authenticated user’s Principal ID is reliably fetched and displayed after Internet Identity sign-in on all browsers (including mobile), using the backend `getCallerIdAsText()` method.

**Planned changes:**
- Update `/admin/login` to retrieve and display the Principal ID via the backend call `getCallerIdAsText()` (not `window.ic`) after a successful Internet Identity sign-in.
- Tie the Principal ID fetch lifecycle to the current authentication state so it automatically re-attempts when the session/actor becomes available (after login/logout/identity change) and clears stale error states.
- Keep the page usable on failure by retaining an actionable Retry button that forces a refetch without crashing or blanking the UI.

**User-visible outcome:** After signing in with Internet Identity on `/admin/login` (including on mobile), the Principal ID field populates with a valid principal string; if it fails, the user can retry and the page remains functional.
