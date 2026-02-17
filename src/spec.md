# Specification

## Summary
**Goal:** Fix the admin access flow so first-admin bootstrap, access-denied troubleshooting, and admin-route navigation behave correctly for unauthenticated users, admins, and authenticated non-admin users.

**Planned changes:**
- Backend: add/adjust a query that reliably reports whether any admin principals exist (or returns an admin count) so the frontend can determine first-admin bootstrap state from the backend (not from the caller role being `guest`).
- Frontend: update `/admin/login` to show “Become the First Admin” only when the backend confirms there are zero admins, and hide it when at least one admin exists.
- Frontend: update the Access Denied / troubleshooting experience to always fetch and display “Your Principal ID” via `getCallerIdAsText()`, with retry on failure and a copy-to-clipboard action that works on mobile (including user-visible error messaging on clipboard failure).
- Frontend: adjust admin route guarding so:
  - unauthenticated users are redirected to `/admin/login`,
  - admins can access admin routes normally,
  - authenticated non-admin users are routed to the dedicated troubleshooting/admin-login experience (showing Principal ID and sign-out/home options) without redirect loops.

**User-visible outcome:** Users only see “Become the First Admin” when no admins exist; authenticated non-admin users are guided to a troubleshooting screen that shows their Principal ID (with copy and retry) and can navigate out, while admin pages route correctly for all user states.
