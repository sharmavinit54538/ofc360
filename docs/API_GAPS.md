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
