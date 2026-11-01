# API_GAPS.md — Exit Management Missing Backend Endpoints

The following features and actions are disabled or presented with informational banners in the UI because no corresponding backend endpoints exist in the OFC360 API. They are documented here with the exact required HTTP method, path, request fields, and expected response fields.

---

## 1. Request Discussion with Resigning Employee

- **Feature Area**: Approvals (Manager / HR Queue)
- **Desired Method**: `POST`
- **Desired Path**: `/api/v1/exits/{id}/request-discussion`
- **Required Request Fields**:
  ```json
  {
    "discussion_topic": "string",
    "proposed_date": "YYYY-MM-DDTHH:mm:ssZ",
    "notes": "string"
  }
  ```
- **Expected Response Fields**:
  ```json
  {
    "success": true,
    "discussion_id": "string",
    "status": "SCHEDULED",
    "message": "Discussion invitation sent to employee"
  }
  ```
- **UI Treatment**: "Request Discussion" button is disabled with tooltip "Backend pending" and banner displayed on Approvals page.

---

## 2. Forward Exit Case to HR / Department Head

- **Feature Area**: Approvals (Manager Queue)
- **Desired Method**: `POST`
- **Desired Path**: `/api/v1/exits/{id}/forward`
- **Required Request Fields**:
  ```json
  {
    "forward_to": "HR" | "DEPT_HEAD" | "MANAGEMENT",
    "target_user_id": "string?",
    "comments": "string"
  }
  ```
- **Expected Response Fields**:
  ```json
  {
    "success": true,
    "stage": "string",
    "forwarded_at": "string"
  }
  ```
- **UI Treatment**: Forwarding action disabled with tooltip "Backend pending".

---

## 3. Notice Period Adjustment (Early Release, Extension, Waiver, Buyout)

- **Feature Area**: Notice Period Management
- **Desired Method**: `PATCH`
- **Desired Path**: `/api/v1/exits/{id}/notice-adjustment`
- **Required Request Fields**:
  ```json
  {
    "adjustment_type": "EARLY_RELEASE" | "WAIVER" | "EXTENSION" | "BUYOUT",
    "revised_last_working_day": "YYYY-MM-DD",
    "waiver_days": 15,
    "buyout_amount": 25000,
    "approval_reason": "string"
  }
  ```
- **Expected Response Fields**:
  ```json
  {
    "id": "string",
    "revised_lwd": "YYYY-MM-DD",
    "buyout_status": "APPROVED",
    "notice_days_served": 15,
    "notice_days_remaining": 0
  }
  ```
- **UI Treatment**: "Early Release" and "Buyout" tabs on the Notice Period screen display an informational banner: *"Notice period waiver, early release, and buyout adjustments are pending backend route implementation. Date adjustments are currently read-only."*

---

## 4. Task-Level Knowledge Transfer Tracking

- **Feature Area**: Knowledge Transfer
- **Desired Method**: `POST` / `PATCH`
- **Desired Path**: `/api/v1/exits/{id}/kt-tasks` and `/api/v1/exits/{id}/kt-tasks/{taskId}`
- **Required Request Fields**:
  ```json
  {
    "title": "string",
    "category": "PROJECT" | "REPO" | "DOCS" | "CLIENT" | "TASKS" | "TRAINING" | "FINAL",
    "assignee_id": "string",
    "status": "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED" | "REJECTED",
    "notes": "string"
  }
  ```
- **Expected Response Fields**:
  ```json
  {
    "tasks": [
      {
        "id": "string",
        "title": "string",
        "status": "COMPLETED",
        "verified_by": "string?"
      }
    ]
  }
  ```
- **UI Treatment**: If case payload does not carry task-level items, a standard 7-task reference checklist is rendered for guidance with a single "Mark KT Complete" button (`PATCH /exits/{id}/knowledge-transfer-complete`).

---

## 5. Scheduled IT Access Revocation

- **Feature Area**: IT Access Revocation
- **Desired Method**: `POST`
- **Desired Path**: `/api/v1/exits/{id}/schedule-revocation`
- **Required Request Fields**:
  ```json
  {
    "scheduled_timestamp": "YYYY-MM-DDTHH:mm:ssZ",
    "scope": ["EMAIL", "VPN", "GITHUB", "DATABASE", "SLACK"],
    "notify_manager": true
  }
  ```
- **Expected Response Fields**:
  ```json
  {
    "status": "SCHEDULED",
    "scheduled_time": "string"
  }
  ```
- **UI Treatment**: Revocation actions must strictly enforce the employee's Last Working Day (comparing with company timezone). Immediate button is disabled if today < LWD.

---

## 6. Post-Exit Alumni & Rehire Eligibility

- **Feature Area**: Exited Employees / Post-Exit
- **Desired Method**: `POST` / `PUT`
- **Desired Path**: `/api/v1/exits/{id}/rehire-eligibility` and `/api/v1/exits/{id}/alumni-profile`
- **Required Request Fields**:
  ```json
  {
    "rehire_eligible": true,
    "rehire_category": "RECOMMENDED" | "CONDITIONAL" | "NOT_ELIGIBLE",
    "reason": "string",
    "alumni_opt_in": true,
    "personal_email": "string"
  }
  ```
- **Expected Response Fields**:
  ```json
  {
    "id": "string",
    "rehire_status": "RECOMMENDED"
  }
  ```
- **UI Treatment**: Exited Employees screen displays a read-only badge and banner: *"Post-exit alumni portal sync and formal rehire rating criteria require backend route implementation."*

---

## 7. Exit Management Settings & Policies

- **Feature Area**: Settings
- **Desired Method**: `GET` / `PUT`
- **Desired Path**: `/api/v1/exits/settings`
- **Required Request Fields**:
  ```json
  {
    "default_notice_period_days": 60,
    "mandatory_clearance_departments": ["MANAGER", "IT", "FINANCE", "ADMIN", "HR"],
    "require_exit_interview": true,
    "auto_generate_relieving_letter": true
  }
  ```
- **UI Treatment**: `/dashboard/exit-management/settings` displays a clean unavailable banner describing the required configuration schema and API routes.

---

## 8. Supporting Document Upload on Resignation

- **Feature Area**: ESS My Exit Form
- **Desired Method**: `POST` (multipart/form-data)
- **Desired Path**: `/api/v1/exits/resign` or `/api/v1/exits/my-request/attachments`
- **Required Request Fields**:
  Multipart `files`: array of document files (PDF/DOCX/PNG)
- **UI Treatment**: File upload input in ESS resignation form is conditionally hidden until backend multipart attachment route is verified; user is guided to submit standard resignation details.


## Recruitment API gaps (2026-11-01)

The user-specified route-list-only contract is expected at docs/openapi.json, but that file is absent from this checkout. The public URL https://api.ofc360.com/openapi.json returned 404. Do not infer route existence from the frontend contract. The field payloads in docs/RECRUITMENT_CONTRACT.md remain the source of request/response shapes, but every route+method comparison is pending until the local JSON is supplied.

### Contract rows requiring route-list comparison

- All paths and methods in docs/RECRUITMENT_CONTRACT.md section 4.4: existence is unverified because the JSON is unavailable. This is not evidence that any of those routes is missing.
- Interview reschedule, cancel, reminder, no-show, interviewer lookup, candidate booking, and interview-bot paths are explicitly called out by the contract as possibly absent. Confirm each exact method/path against the route list before wiring.
- Task toggle and POST admin employee onboarding may be absent; verify method/path before enabling those actions.
- Document-template GET/POST may exist but their category/body fit is not established by the route list alone; payload shape must come from the provided prompt contract.

### Features with no backend route in the supplied contract

For these items, the backend contract gives no endpoint, so no path, method, request fields, or response fields are invented here. Use Backend pending UI and disabled mutations until the backend owner supplies the concrete contract.

| Feature | Needed route/method | Request and response fields | Exact question for backend owner |
|---|---|---|---|
| Candidate Email/WhatsApp/SMS dispatch and template test-send | Not specified | Not specified | What path and method should dispatch a candidate message, and what request/response fields does it accept? |
| Requisition reject | Not specified | Not specified | Is requisition rejection supported? If so, what path, method, and response shape should the UI use? |
| Background verification cases and actions | Not specified | Not specified | What routes and request/response fields support BGV case list, detail, manual override, and audit history? |
| Preboarding readiness and tasks | Not specified | Not specified | What routes and request/response fields support candidate preboarding status and task updates? |
| Cross-department onboarding tasks | Not specified | Not specified | Which route returns department-tagged onboarding tasks, and what fields identify department, status, and task updates? |
| Knowledge transfer and probation reviews | Not specified | Not specified | What routes and fields support KT curriculum, mentor pairing, Day 30/60/90 reviews, confirmation, or extension? |
| Rehire/alumni | Not specified | Not specified | Is a rehire/alumni endpoint planned? If so, what path, method, and schemas should be used? |
| Excel/PDF hiring summary export | Not specified | Not specified | Do /analytics/export or /reports/export return these files? If not, what exact endpoint and file response metadata are supported? |
| Vendor spend/hires metrics | Not specified | Not specified | Which API response fields, if any, provide vendor hires and spend metrics? |
| GDPR/EEO compliance data | Not specified | Not specified | Which existing API returns consent, retention, gender, and ethnicity data, and what fields may be displayed? |
| Workflow canvas persistence | Not specified | Not specified | Are automation rules the only persisted workflow representation? If not, what endpoint and fields support a canvas? |

Do not reuse /exits/{id}/knowledge-transfer-complete for onboarding knowledge transfer.



## Route-list result supplied by the user (2026-11-01)

The user completed a route/method check against the route-list-only OpenAPI contract: 100 of 119 operations from Prompt 0 section 4.4 exist and 19 are absent. This result supersedes the earlier note that the comparison was pending; the JSON file itself is not required to continue. Treat the 19 source operations below as unconfirmed. Do not switch to alternate paths unless the user approves. Request and response fields remain governed by section 4 of docs/RECRUITMENT_CONTRACT.md; undocumented fields stay blocked.

| Source operation absent from route list | Affected UI | Handling |
|---|---|---|
| POST /resume-parser/upload-and-parse | P15 Resume Intelligence | Show Backend pending and disable upload. |
| GET /interviews/interviewers | P11/P12 Interview Calendar and Interviews | Do not schedule without a confirmed interviewer source; show Backend pending. |
| POST /interviews/{interviewId}/rounds/{roundId}/schedule | P11/P12 | Do not switch to the different existing POST /api/v1/interviews/{id}/schedule; keep scheduling disabled pending approval/contract. |
| PATCH /interviews/schedules/{id}/reschedule | P11/P12 | Disable reschedule and drag rescheduling. |
| POST /interviews/schedules/{id}/cancel | P12 | Disable cancel. |
| POST /interviews/schedules/{id}/reminder | P12 | Disable reminders. |
| PATCH /interviews/schedules/{id}/no-show | P12 | Disable no-show action. |
| GET /interviews/book/{token} | PUB2 Interview Booking | Render public Backend pending state; do not substitute. |
| POST /interviews/book/{token} | PUB2 Interview Booking | Disable booking confirmation. |
| GET /api/v2/interview-bot/public/{token} | PUB3 Candidate AI Interview | Render Backend pending state. |
| POST /api/v2/interview-bot/public/{token}/start | PUB3 Candidate AI Interview | Disable start. |
| POST /api/v2/interview-bot/public/{token}/answer | PUB3 Candidate AI Interview | Disable answer submission. |
| POST /api/v2/interview-bot/public/{token}/finish | PUB3 Candidate AI Interview | Disable finish. |
| POST /api/v2/interview-bot/public/{token}/request-human | PUB3 Candidate AI Interview | Disable request-human action. |
| POST /api/v2/interview-bot/invite | P17/P18 AI Interview | Disable invitations. |
| GET /api/v2/interview-bot/results | P18 AI Interview Results | Show Backend pending; do not substitute. |
| POST /api/v2/interview-bot/results/{id}/decision | P18 AI Interview Results | Disable human decision submission. |
| POST /admin/employee-onboarding | P42 Admin Onboarding | Disable start-onboarding action. |
| PATCH /admin/employee-onboarding/{id}/tasks/{taskKey} | P35/P42 onboarding task actions | Keep tasks read-only; disable toggles. |

Different existing routes must not be silently substituted: POST /api/v1/interviews/{id}/schedule; POST /api/v2/interview-bot/sessions and /sessions/{id}/start|answer|finalize|proctor-alert; and PATCH /api/v1/interviews/rounds/{round_id}/pass|hold|reject. These route differences need user approval before use.

Confirmed route families include jobs, candidates, applications, CRM notes, interviews listing, scorecards, offers, requisitions, vendors, referrals, automations, screening, ranking, recruiter AI, analytics metrics/exports, recruitment notifications, document templates, offer letters, employee onboarding list/detail/document verification, employee onboarding steps, and public careers. A route-list confirmation does not define payload or response schemas.

