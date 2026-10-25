# MEETING 002 | S1 acceptance checklist

Scope: security/s1-booking-remediation only. No production deploy, Firebase modification, main merge or real email delivery.

## P0
- [ ] Chair's reported App Password revocation independently verified.
- [ ] Investigate Git history, reuse and available account activity.
- [x] Isolated branch created from approved fixed commit.

## P1
- [x] Hardcoded Gmail credential removed from booking Server Action on this branch.
- [x] Server-only environment variables; missing configuration fails closed.
- [x] Booking action disabled by default under D08.
- [x] Generic errors, no raw provider exception sent to users or logs.
- [x] Server-side input validation and HTML escaping.
- [x] Storage failure and notification failure have distinct statuses.
- [ ] Decide and verify production Secret Manager integration separately.
- [ ] Review rate limits, duplicate submissions and abuse prevention before public booking.

## P2
- [ ] Execute isolated tests: npx playwright test tests/security/booking.spec.ts
- [ ] Run npx tsc --noEmit and npm run build in an isolated environment.
- [ ] Run secret scan of repository and Git history, with redacted output.
- [ ] Confirm no secrets in client bundles and no sensitive error leakage.
- [ ] Independent reviewer signs off on sanitized evidence.

Checked entries mean source code was changed, not that runtime verification passed.
