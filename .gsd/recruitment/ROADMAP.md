# Recruitment Module Roadmap

All paths are relative to the Vite target repository. Follow the user-provided prompts in order; each task is verified and committed before the next dependent task.

## Prompt 0  Foundation

- [ ] F0: contract, tracker, baseline commands, screenshots, OpenAPI comparison
- [ ] F1: Tailwind semantic token bridge
- [ ] F2: accessible shared primitives
- [ ] F3: imperative toast bridge
- [ ] F4: dependencies, env typing, public URL helpers
- [ ] D1: domain types and pure API mappers
- [ ] D2: RTK Query endpoint groups (route verification required)
- [ ] D3: useRecruitment facade and cache behavior
- [ ] D4: public fetch client and endpoint/mapper tests
- [ ] F5: recruitment data layer and public client
- [ ] F6: nested routes, RecruitmentLayout, module hub, legacy compatibility

## Prompt 1  Wave 1 core hiring

- [ ] P01P13: Dashboard, Jobs, New Job, Job Detail, Job Publish, Candidates, Candidate Profile, Pipeline, Offers, Compensation Offer Builder, Interview Calendar, Interviews, Hiring Manager Hub

## Prompt 2  Wave 2 AI

- [ ] P14P20: AI Screening, Resume Intelligence, Recruitment AI, AI Interview wrapper/results/simulator, Global Search

## Prompt 3  Wave 3 public candidate flows

- [ ] PUB1PUB3 and P21: Job Application, Interview Booking, Candidate AI Interview, Career Site

## Prompt 4  Wave 4 operations

- [ ] P22P41: Workforce Planning through Import/Export, including routes that must honestly show Backend pending

## Prompt 5  Wave 5 onboarding and cutover

- [ ] P42 and PUB4: Admin Onboarding and employee 10-step flow (do not restructure the existing checklist without user approval)
- [ ] Cutover old recruitment endpoints only after all P/PUB routes are complete
- [ ] Finalize status, gaps, role matrix, navigation documentation, regression checks

## Blocking dependencies

- Route existence checks require docs/openapi.json. The user-provided path was absent at initialization; ask for the file while continuing contract-independent foundations.
- Baseline desktop screenshots are pending because the Windows UI helper did not retain a stable Edge window. Use a browser screenshot path if available; otherwise record the exact blocker and ask for the screenshots.




## Route audit update (2026-11-01)
The user supplied route-list results (100 of 119 paths/methods exist; 19 are absent). The missing operations are in docs/API_GAPS.md. No alternative route is used without approval. The local JSON file is not required for the supplied existence results.

