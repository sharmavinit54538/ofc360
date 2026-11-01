# Specification: OFC360 Recruitment Module

Status: FINALIZED
Date: 2026-11-01
Owner: OFC360 Engineering

## Objective

Build the complete Recruitment module in this Vite/React target using the self-contained Prompt 0 through Prompt 5 specification supplied by the user. The inventory is P01-P42, PUB1-PUB4, F0-F6, and D1-D4. Keep the existing Talent hub integration compatible, and do not alter backend code.

## Requirements

- Preserve the existing Digital Signatures GSD files; this project uses the separate .gsd/recruitment/ workspace.
- Use docs/RECRUITMENT_CONTRACT.md as the payload/domain contract. Confirm each path and method from docs/openapi.json before wiring; the JSON has route/method data only. Do not guess fields absent from section 4 of the supplied prompt.
- Do not use mock, seeded, or hard-coded demo data. If a backend route is absent, render the requested Backend pending banner, disable mutations, and document the gap.
- Use the target's RTK Query baseQueryWithReauth for admin APIs and an unauthenticated fetch client for public candidate flows.
- Implement shared semantic theme tokens, accessible UI primitives, toast bridge, environment/public URL utilities, recruitment data layer, route shell, and all listed page waves in order.
- Every page must implement loading, error plus Retry, empty, and success states; responsive 375/768/1280 layouts; keyboard accessible dialogs; and light/dark themes.
- Role access follows the supplied role matrix. Public application, booking, and AI interview routes remain outside ProtectedRoute.
- Add tests and capture typecheck, test, build, and screenshot evidence. Respect the existing target's strict TypeScript settings and do not add @ts-ignore or unnecessary any.
- Keep current uncommitted Exit Management edits untouched.

## API verification boundary

The supplied data contract is transcribed verbatim in docs/RECRUITMENT_CONTRACT.md. The user's expected route-list-only file is docs/openapi.json, but it was absent on 2026-11-01; the public URL api.ofc360.com/openapi.json returned 404. Route existence verification is therefore pending. Prompt payload fields remain the only field source; any undocumented field is BLOCKED pending a precise user/backend answer.

## Baseline

- npm run typecheck: the first run appeared clean, but the full follow-up exited 1 with a large pre-existing TypeScript diagnostic set.
- npm run test: 257 passed and 5 failed across 24 files. Existing failures are 4 signatureUtils assertions and 1 SignatureCenter integration test.
- npm run build: failed in TypeScript compilation before Vite bundling with the pre-existing diagnostic set.
- npm run lint: placeholder only; no lint checks ran.
- Baseline screenshots are not captured; the Windows helper failed to attach to a stable Edge window.

## Finalization

This scope is finalized based on the self-contained build prompt. Route-dependent work remains gated on the expected OpenAPI file. The ROADMAP and tracker record the staged execution and evidence required.




## Route audit update
The user supplied the route-list-only OpenAPI comparison: 100 of 119 operations are present and 19 are absent. Missing operations are logged in docs/API_GAPS.md; their UI must remain Backend pending/disabled. The user says the JSON file is not required for this result. Payload fields remain limited to Prompt 0 section 4.

