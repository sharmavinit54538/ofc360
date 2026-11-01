# EXIT_ROLE_MATRIX.md — Exit Management Role-Based Access Control Matrix

This matrix documents screen access and actionable mutations across the 5 system roles (`SUPER_ADMIN`, `HR_ADMIN`, `MANAGER`, `EMPLOYEE`, `IT_ADMIN`).

---

## 1. Screen & Navigation Access

| Screen / Sub-Route | Path | EMPLOYEE | MANAGER | IT_ADMIN | HR_ADMIN | SUPER_ADMIN |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **My Exit (ESS)** | `/dashboard/exit-management/my-exit` | **YES** | **YES** | **YES** | **YES** | **YES** |
| **Exit Overview / Dashboard** | `/dashboard/exit-management/overview` | NO | **YES** | **YES** | **YES** | **YES** |
| **Approvals Queue** | `/dashboard/exit-management/approvals` | NO | **YES** (Direct reports) | NO | **YES** (All) | **YES** (All) |
| **Notice Period** | `/dashboard/exit-management/notice-period` | NO | **YES** | NO | **YES** | **YES** |
| **Knowledge Transfer** | `/dashboard/exit-management/knowledge-transfer` | NO | **YES** (Verify KT) | NO | **YES** | **YES** |
| **Asset Recovery** | `/dashboard/exit-management/asset-recovery` | NO | View-only | **YES** (Signoff) | **YES** | **YES** |
| **Department Clearance** | `/dashboard/exit-management/clearance` | NO | **YES** (Manager clearance) | **YES** (IT clearance) | **YES** (HR + on behalf) | **YES** (All) |
| **Full & Final (F&F)** | `/dashboard/exit-management/fnf` | NO | NO | NO | **YES** | **YES** |
| **Exit Interview** | `/dashboard/exit-management/interview` | NO (Submitted via ESS) | **NO** (Strictly blocked) | NO | **YES** (Read & Submit) | **YES** (Read & Submit) |
| **Exit Documents** | `/dashboard/exit-management/documents` | NO | View-only | NO | **YES** (Generate & Download) | **YES** (Generate & Download) |
| **Access Deactivation** | `/dashboard/exit-management/access-deactivation` | NO | NO | **YES** | **YES** | **YES** |
| **Exited Employees Archive**| `/dashboard/exit-management/exited-employees` | NO | View-only (Past reports) | View-only | **YES** | **YES** |
| **Exit Analytics** | `/dashboard/exit-management/analytics` | NO | View-only (Team) | NO | **YES** | **YES** |
| **Exit Settings** | `/dashboard/exit-management/settings` | NO | NO | NO | **YES** | **YES** |

---

## 2. Actionable Mutations & Endpoints

| Action | Endpoint | EMPLOYEE | MANAGER | IT_ADMIN | HR_ADMIN | SUPER_ADMIN |
|---|---|:---:|:---:|:---:|:---:|:---:|
| Submit Resignation | `POST /exits/resign` | **YES** | **YES** | **YES** | **YES** | **YES** |
| Withdraw Resignation | `DELETE /exits/my-request` | **YES** (Own request) | **YES** (Own request) | **YES** (Own request) | **YES** (Own request) | **YES** (Own request) |
| Manager Approve Exit | `PATCH /exits/{id}/manager-approve` | NO | **YES** (Reports) | NO | **YES** (Override) | **YES** |
| Manager Reject Exit | `PATCH /exits/{id}/manager-reject` | NO | **YES** (Reports) | NO | **YES** (Override) | **YES** |
| HR Approve Exit | `PATCH /exits/{id}/approve` | NO | NO | NO | **YES** | **YES** |
| HR Reject Exit | `PATCH /exits/{id}/reject` | NO | NO | NO | **YES** | **YES** |
| Start Notice Period | `PATCH /exits/{id}/start-notice-period` | NO | NO | NO | **YES** | **YES** |
| Mark KT Complete | `PATCH /exits/{id}/knowledge-transfer-complete` | NO | **YES** | NO | **YES** | **YES** |
| Signoff Asset Return | `PATCH /exits/{id}/asset-return` | NO | NO | **YES** | **YES** | **YES** |
| Manager Clearance Signoff | `PATCH /exits/{id}/clearance` (dept=MANAGER) | NO | **YES** | NO | **YES** | **YES** |
| IT Clearance Signoff | `PATCH /exits/{id}/clearance` (dept=IT) | NO | NO | **YES** | **YES** | **YES** |
| Finance Clearance Signoff | `PATCH /exits/{id}/clearance` (dept=FINANCE) | NO | NO | NO | **YES** (On behalf) | **YES** |
| Admin Clearance Signoff | `PATCH /exits/{id}/clearance` (dept=ADMIN) | NO | NO | NO | **YES** (On behalf) | **YES** |
| HR Clearance Signoff | `PATCH /exits/{id}/clearance` (dept=HR) | NO | NO | NO | **YES** | **YES** |
| Update F&F Settlement | `PATCH /exits/{id}/fnf` | NO | NO | NO | **YES** | **YES** |
| Submit Exit Interview | `POST /exits/{id}/exit-interview` | NO | **NO** | NO | **YES** | **YES** |
| View Interview Answers | `GET /exits/{id}` (interview block) | NO | **NO** (Hidden) | NO | **YES** | **YES** |
| Generate Documents | `POST /exits/{id}/generate-documents` | NO | NO | NO | **YES** | **YES** |
| Complete Exit Case | `PATCH /exits/{id}/complete` | NO | NO | NO | **YES** | **YES** |

---

## 3. Server Authorization Handling

The UI enforces permissions optimistically to prevent confusion, but backend authorization is the ultimate source of truth. All HTTP `401`, `403`, `409`, and `422` error payloads returned by the server are caught and displayed in user-facing toasts and alert displays, showing the exact server message.
