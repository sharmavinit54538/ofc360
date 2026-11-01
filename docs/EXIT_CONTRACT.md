# EXIT_CONTRACT.md — Exit Management API Contract Baseline

## 1. Route Diff: Reality vs Prototype

| Method | Prototype Route (`/offboarding/*`) | Actual Backend Route (`/api/v1/exits/*`) | Status | Notes |
|---|---|---|---|---|
| `GET` | `/offboarding/cases` | `/exits` | REPLACED | Paginated exit cases list |
| `GET` | `/offboarding/analytics` | `/exits/stats` | REPLACED | KPI metrics summary |
| `POST` | `/offboarding/cases` | `/exits/resign` | REPLACED | ESS Resignation initiation |
| `GET` | *(none)* | `/exits/my-request` | NEW | Employee active exit request query |
| `DELETE` | *(none)* | `/exits/my-request` | NEW | Employee withdraws active exit |
| `GET` | `/offboarding/cases/{id}` | `/exits/{id}` | REPLACED | Full exit case details |
| `PATCH` | `/offboarding/cases/{id}/stage` | `/exits/{id}/manager-approve` | REPLACED | Manager approval of exit case |
| `PATCH` | `/offboarding/cases/{id}/reject` | `/exits/{id}/manager-reject` | REPLACED | Manager rejection of exit case |
| `PATCH` | `/offboarding/cases/{id}/stage` | `/exits/{id}/approve` | REPLACED | HR approval of exit case |
| `PATCH` | `/offboarding/cases/{id}/reject` | `/exits/{id}/reject` | REPLACED | HR rejection of exit case |
| `PATCH` | *(none)* | `/exits/{id}/start-notice-period` | NEW | Formally initiate notice period |
| `PATCH` | *(none)* | `/exits/{id}/knowledge-transfer-complete` | NEW | Sign off KT handover completion |
| `GET` | *(none)* | `/exits/{id}/assets` | NEW | List assigned assets for exit |
| `PATCH` | *(none)* | `/exits/{id}/asset-return` | NEW | Mark asset returned / condition verified |
| `PATCH` | `/offboarding/cases/{id}/clearance` | `/exits/{id}/clearance` | REPLACED | Department clearance (Clear/Hold/Reject) |
| `GET` | *(none)* | `/exits/{id}/fnf-preview` | NEW | Full & Final calculation preview |
| `PATCH` | `/offboarding/cases/{id}/settlement` | `/exits/{id}/fnf` | REPLACED | Submit/update F&F settlement |
| `POST` | `/offboarding/cases/{id}/interview` | `/exits/{id}/exit-interview` | REPLACED | Submit exit interview feedback |
| `POST` | *(none)* | `/exits/{id}/generate-documents` | NEW | Generate Relieving, Experience, F&F docs |
| `GET` | *(none)* | `/exits/{id}/documents` | NEW | List generated exit documents |
| `PATCH` | `/offboarding/cases/{id}/stage` | `/exits/{id}/complete` | REPLACED | Final completion of exit case |

---

## 2. Unverified Routes & API Gaps (Disabled in UI)

The following capabilities have no backend routes exposed in `/api/v1/exits` and are tracked in `docs/API_GAPS.md`:
1. Request Discussion with employee (`POST /exits/{id}/request-discussion` - Missing)
2. Forward to HR (`POST /exits/{id}/forward-to-hr` - Missing)
3. Management / Department Head Approval Chain (`POST /exits/{id}/approvals/chain` - Missing)
4. Notice Period Waiver / Early Release / Extension / Buyout / Revised LWD (`PATCH /exits/{id}/notice-waiver` - Missing)
5. Task-Level KT Tracking (`POST /exits/{id}/kt-tasks` - Missing)
6. Scheduled IT Access Revocation (`POST /exits/{id}/schedule-revocation` - Missing)
7. Rehire Eligibility Assessment (`POST /exits/{id}/rehire-eligibility` - Missing)
8. Post-Exit Alumni Directory Entry (`POST /exits/{id}/alumni` - Missing)
9. Exit Policies & Template Settings (`GET/PUT /exits/settings` - Missing)
10. Case Edit / Case Delete (`PUT/DELETE /exits/{id}` - Missing)

---

## 3. Data Contracts & Tolerant Mapper Specification

All payloads are parsed through `src/features/exit-management/mappers/exitMappers.ts` with snake_case and camelCase fallback tolerance.

### 3.1 Exit Case Schema (`ExitCase`)

| UI Property | Sibling/Backend Key Candidates | Type | Default / Fallback |
|---|---|---|---|
| `id` | `id`, `_id`, `exit_id` | `string` | Mandatory |
| `caseNumber` | `case_number`, `caseNumber`, `exit_number` | `string` | `EXIT-${id.slice(0,6)}` |
| `employeeId` | `employee_id`, `employeeId` | `string` | `""` |
| `employeeName` | `employee_name`, `employeeName`, `employee.name` | `string` | `"Unknown Employee"` |
| `employeeEmail` | `employee_email`, `employeeEmail`, `employee.email` | `string` | `""` |
| `designation` | `designation`, `job_title`, `employee.designation` | `string` | `"Employee"` |
| `department` | `department`, `employee.department` | `string` | `"General"` |
| `managerName` | `manager_name`, `managerName`, `manager.name` | `string` | `"Direct Manager"` |
| `joiningDate` | `joining_date`, `joiningDate`, `date_of_joining` | `string` | `""` |
| `resignationDate` | `resigned_at`, `resignation_date`, `resignationDate` | `string` | ISO string |
| `noticePeriodDays`| `notice_days`, `notice_period_days`, `noticePeriodDays` | `number` | `30` |
| `expectedLwd` | `last_working_day`, `expected_last_working_day` | `string` | Calculated |
| `actualLwd` | `actual_last_working_day`, `actualLastWorkingDay` | `string?` | `undefined` |
| `reason` | `reason`, `exit_reason` | `string` | `"Other"` |
| `comments` | `comments`, `notes`, `detailed_comments` | `string?` | `""` |
| `stage` | `stage`, `exit_stage`, `status` | `ExitStage` | `"RESIGNATION_SUBMITTED"` |
| `exitStatus` | `exit_status`, `status` | `ExitStatus` | `"IN_PROGRESS"` |
| `fnfStatus` | `fnf_status`, `settlement_status` | `FnFStatus` | `"DRAFT"` |
| `managerApproval`| `manager_approval_status`, `manager_approval` | `ApprovalRecord` | Pending record |
| `hrApproval` | `hr_approval_status`, `hr_approval` | `ApprovalRecord` | Pending record |
| `clearances` | `clearance_workflow`, `clearances` | `DepartmentClearanceItem[]` | 5 dept defaults |
| `assignedAssets` | `assigned_assets`, `assets` | `ExitAssetItem[]` | `[]` |
| `ktStatus` | `kt_status`, `knowledge_transfer_complete` | `boolean` | `false` |
| `timeline` | `timeline`, `audit_trail`, `history` | `TimelineEvent[]` | `[]` |
| `documents` | `documents`, `generated_documents` | `ExitDocumentItem[]` | `[]` |

---

## 4. Open Questions & Blocked Items For The User

1. **OpenAPI Schema Confirmation**: The production URL `https://api.ofc360.com/openapi.json` returned HTTP 404. We have structured the contract around the exact 19 endpoints provided in the user prompt, with tolerant mappers handling both snake_case and camelCase. If you have the exported OpenAPI JSON or FastAPI router file, please attach it.
2. **Finance & Admin Clearance Roles**: The system roles are strictly `SUPER_ADMIN | HR_ADMIN | MANAGER | EMPLOYEE | IT_ADMIN`. No `FINANCE` or `ADMIN` roles exist. The UI defaults to allowing `HR_ADMIN` and `SUPER_ADMIN` to sign off Finance and Admin clearances on behalf of those departments.
3. **Full & Final Settlement Overlap**: `/exits/{id}/fnf-preview` and `PATCH /exits/{id}/fnf` operate on the exit case, while `/api/v2/payroll/full-and-final` manages payroll disbursements. The UI uses `/exits/{id}/fnf-preview` and `PATCH /exits/{id}/fnf` for exit case signoff, with cross-links to statement PDF downloads.
4. **Resignation Supporting Documents**: Because `POST /exits/resign` payload schema in the backend does not confirm file upload multipart support, document upload in ESS is hidden by default and logged in `docs/API_GAPS.md`.
