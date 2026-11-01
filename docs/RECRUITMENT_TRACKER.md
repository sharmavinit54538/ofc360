# Recruitment Module Tracker

One row per requested page, public flow, foundation, and data-layer item. A row becomes DONE only with its code, tests, and proof. The user supplied route-list results (100 of 119 section-4.4 operations are present, 19 are absent); see docs/API_GAPS.md. Payload shapes remain limited to the Prompt 0 contract.

| ID | Name | Wave | Status (TODO/DONE/BLOCKED) | Files | API calls | States | Tests | Screenshot |
|---|---|---|---|---|---|---|---|---|
| P01 | Recruitment Dashboard | Wave 1 | TODO | Pending | /jobs, /candidates, /interviews, /offers | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P02 | Jobs | Wave 1 | TODO | Pending | /jobs, /jobs/{id}, /jobs/{id}/close, /jobs/{id}/duplicate | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P03 | New Job | Wave 1 | TODO | Pending | POST /jobs, PUT /jobs/{id}, description generation | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P04 | Job Detail | Wave 1 | TODO | Pending | /jobs/{id}, sourcing-link, qr, applicants/export | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P05 | Job Publish | Wave 1 | TODO | Pending | GET/POST /jobs/{id}/publish | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P06 | Candidates | Wave 1 | TODO | Pending | /candidates | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P07 | Candidate Profile | Wave 1 | TODO | Pending | /candidates/{id}, /applications/{id}/stage, /crm/notes, /applications/{id}/offer | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P08 | Pipeline | Wave 1 | TODO | Pending | PATCH /applications/{id}/stage | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P09 | Offers | Wave 1 | TODO | Pending | /offers, PATCH accept/reject | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P10 | Compensation Offer Builder | Wave 1 | TODO | Pending | POST /applications/{id}/offer, offer-letter v2 | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P11 | Interview Calendar | Wave 1 | TODO | Pending | /interviews, schedule routes after contract verification | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P12 | Interviews | Wave 1 | TODO | Pending | /interviews, schedule/reschedule/cancel/reminder/no-show/feedback | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P13 | Hiring Manager Hub | Wave 1 | TODO | Pending | /jobs, /candidates, /interviews | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P14 | AI Screening | Wave 2 | TODO | Pending | screening v2 run/results/decision/history | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P15 | Resume Intelligence | Wave 2 | TODO | Pending | POST /resume-parser/upload-and-parse | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P16 | Recruitment AI | Wave 2 | TODO | Pending | ranking, recommendation, interview questions | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P17 | AI Interview wrapper | Wave 2 | TODO | Pending | interview-bot results/invite | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P18 | AI Interview Results | Wave 2 | TODO | Pending | interview-bot results/decision | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P19 | AI Interview Simulator | Wave 2 | TODO | Pending | No API; simulation-only | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P20 | Global Search | Wave 2 | TODO | Pending | Loaded jobs/candidates/interviews/offers | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P21 | Career Site | Wave 3 | TODO | Pending | company settings GET/PUT | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P22 | Workforce Planning | Wave 4 | TODO | Pending | /departments, /requisitions, approve | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P23 | Requisitions | Wave 4 | TODO | Pending | /requisitions, approve | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P24 | Candidate Sourcing | Wave 4 | TODO | Pending | /candidates, import | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P25 | Vendors | Wave 4 | TODO | Pending | /vendors | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P26 | Referrals | Wave 4 | TODO | Pending | /referrals, /employees, /departments | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P27 | Talent Pool | Wave 4 | TODO | Pending | /candidates, CSV import/export | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P28 | Candidate CRM | Wave 4 | TODO | Pending | /candidates, /crm/notes | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P29 | Automation | Wave 4 | TODO | Pending | /automations/rules, toggle, test | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P30 | Candidate Communication | Wave 4 | TODO | Pending | No dispatch route | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P31 | Recruitment Templates | Wave 4 | TODO | Pending | /document-templates; verify category/body fit | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P32 | Scorecards | Wave 4 | TODO | Pending | /scorecards/templates, /scorecards/submissions | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P33 | Background Verification | Wave 4 | TODO | Pending | No route specified | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P34 | Preboarding | Wave 4 | TODO | Pending | No route specified | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P35 | Enterprise Onboarding Hub | Wave 4 | TODO | Pending | /admin/employee-onboarding if contract supports read-only | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P36 | Knowledge Transfer and Probation | Wave 4 | TODO | Pending | No route specified | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P37 | Compliance and Diversity | Wave 4 | TODO | Pending | /ai-hub/analytics-center/diversity, /compliance/* if present | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P38 | Recruitment Reports | Wave 4 | TODO | Pending | /analytics/export, /reports/export, /applications/stats | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P39 | Recruitment Analytics | Wave 4 | TODO | Pending | analytics v2, /applications/stats | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P40 | Recruitment Notifications | Wave 4 | TODO | Pending | /recruitment/notifications, read | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P41 | Import and Export | Wave 4 | TODO | Pending | CSV, applicants export, analytics/reports export | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| P42 | Admin Onboarding | Wave 5 | TODO | Pending | /admin/employee-onboarding, verify document | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| PUB1 | Job Application | Wave 3 | TODO | Pending | /api/public/careers lookup/apply | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| PUB2 | Interview Booking | Wave 3 | TODO | Pending | /interviews/book/{token} | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| PUB3 | Candidate AI Interview | Wave 3 | TODO | Pending | /api/v2/interview-bot/public/* | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| PUB4 | Employee 10-step Onboarding | Wave 5 | TODO | Pending | /employee-onboarding progress/draft/step/upload/complete | loading/error/empty/success | Pending | 375/768/1280 light/dark pending |
| F0 | Baseline, contract, screenshots | Prompt 0 | TODO | docs/RECRUITMENT_CONTRACT.md, docs/RECRUITMENT_TRACKER.md, .gsd/recruitment | user route audit: 100/119 present, 19 unconfirmed | N/A | typecheck/test/build baseline recorded; screenshots pending | Pending |
| F1 | Tailwind semantic theme bridge | Prompt 0 | TODO | Pending | N/A | N/A | Regression screenshots | Pending |
| F2 | Accessible shared UI primitives | Prompt 0 | TODO | Pending | N/A | N/A | Primitive unit tests | Pending |
| F3 | Imperative toast bridge | Prompt 0 | DONE | src/shared/lib/toast.ts, src/shared/ui/Toast.tsx, src/shared/lib/toast.test.tsx | N/A | N/A | 2 passed | N/A |
| F4 | Dependencies, environment, public URLs | Prompt 0 | DONE | package.json, package-lock.json, .env.example, src/vite-env.d.ts, src/shared/lib/publicUrl.ts, src/shared/lib/publicUrl.test.ts | N/A | N/A | 5 passed; targeted tsc passed | N/A |
| F5 | Recruitment API data layer and public client | Prompt 0 | TODO | Pending | Section 4 routes; verify from OpenAPI | N/A | MSW and mapper tests | Pending |
| F6 | Recruitment routes, shell, landing hub | Prompt 0 | TODO | Pending | N/A | 4 states on route pages | Router/navigation tests | Pending |
| D1 | Domain types and API mappers | Prompt 0 | TODO | Pending | Section 4 mapping rules | N/A | Pure mapper tests | Pending |
| D2 | RTK Query endpoint groups | Prompt 0 | TODO | Pending | Section 4.4; route existence pending OpenAPI | N/A | MSW endpoint tests | Pending |
| D3 | useRecruitment facade and optimistic cache | Prompt 0 | TODO | Pending | Verified endpoints only | N/A | Facade and rollback tests | Pending |
| D4 | Public fetch client and response/error normalization | Prompt 0 | TODO | Pending | Public route groups in section 4.4 | N/A | Public client and normalization tests | Pending |

## Baseline (2026-11-01)

- `npm run typecheck`: the first observed invocation printed no diagnostics; a clean follow-up returned exit code 1 with a large existing TypeScript diagnostic set (759 lines of output, including `src/app/store.ts` circular state typing and widespread unused imports/type mismatches). Exact baseline output should be retained when recapturing with redirection.
- `npm run test`: 24 files, 262 tests; 257 passed and 5 failed in the existing Digital Signatures suite (4 `signatureUtils` assertions and 1 `SignatureCenter.test.tsx` integration test). Running inside the sandbox initially failed to spawn esbuild; the escalated run collected tests.
- `npm run build`: failed at TypeScript compilation with the same existing large diagnostic set; Vite build did not run.
- `npm run lint`: placeholder script only; it prints `ESLint setup scheduled for Phase 4`.
- OpenAPI: `docs/openapi.json` was absent; `https://api.ofc360.com/openapi.json` returned HTTP 404. User supplied the expected local path but the file was not present.
- Baseline screenshots: pending. The computer-use helper could not attach to a stable Edge window (`window is not a usable app window`; refreshed window ID disappeared before capture).


## Route audit update (user supplied, 2026-11-01)

The user compared section 4.4 against the route-list-only OpenAPI contract: 100 of 119 operations exist and 19 are absent. Missing operations are recorded in docs/API_GAPS.md and must render Backend pending/disabled UI. Do not switch to alternate schedule or interview-bot routes without asking. The JSON file itself is not required for this route-existence result.

