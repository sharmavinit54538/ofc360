# API Gaps for Reports & Analytics Hub

This document tracks backend endpoints/fields needed by the 9 reports that are **missing or unverified**. Each gap results in a UI gap banner on the affected report, and the specific KPI/chart/column is disabled with a tooltip explaining why.

Format: `Report → Missing Data → Evidence (grep result) → UI Treatment`

---

## 1. Workforce & Headcount Analytics (`workforce-analytics`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| Age / demographic bands (for age histogram) | `employee.date_of_birth` / `employee.dob` | ❌ MISSING | `workforceApi.ts` normalizes `date_of_birth` but `EmployeeItem` type doesn't include it; `getEmployees` doesn't return it | Hide age histogram chart; show gap banner "Age data requires DOB field — not available in current API" |
| Exit reason breakdown | `exitsApi.getExitStats()` → `reasonBreakdown` | ⚠️ UNVERIFIED | `ExitAnalyticsMetrics` in `exit.types.ts` not inspected; `getExitStats` returns `ExitAnalyticsMetrics` but fields unknown | If missing: show "Attrition by reason" chart with gap banner |
| Tenure buckets (0–1, 1–3, 3–5, 5+ yrs) | Computed from `joiningDate` | ✅ AVAILABLE | `normalizeEmployee` returns `joiningDate` | Compute client-side |
| Work mode split (office/remote/hybrid) | `getWorkforceStats().workModeSplit` | ✅ AVAILABLE | `workforceApi.ts:1167-1171` | Use directly |

---

## 2. Recruitment Funnel & Sourcing (`recruitment-reports`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| Candidate `source` field | `CandidateItem.source` | ❌ MISSING | `recruitment.types.ts:96` — `CandidateItem` has no `source`; only `AddCandidatePayload` has optional `source` (line 116) | Show "Source effectiveness (hire rate)" instead of "Source ROI"; gap banner "Source attribution requires `source` field on candidate — backend returns null" |
| Stage-history timestamps (for time-in-stage) | `CandidateItem.stageHistory[]` | ❌ MISSING | `CandidateItem` only has `currentStage` and `appliedDate` (line 92-95) | Show "Days in current stage" only; gap banner "Stage history timestamps not available — cannot compute time-in-stage per stage" |
| Cost-per-hire | `RecruitmentStats.costPerHire` | ❌ MISSING | `RecruitmentStats` (line 24-31) has no cost field | Hide cost-per-hire KPI/chart; gap banner "Cost-per-hire requires financial data not in recruitment stats" |
| Open requisition ageing | Computed from `JobOpening.targetDate` / `createdAt` | ⚠️ PARTIAL | `JobOpening` has `targetDate` (line 47) but no `createdAt` | Compute from `targetDate` if available; otherwise gap banner |

---

## 3. Attendance & Shift Utilization (`attendance-reports`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| Company-scoped attendance records | `getAttendanceRecords({ scope: 'ALL' })` | ✅ AVAILABLE | `attendanceApi.ts:879-889` tries `/attendance/company` first | Use company scope |
| Geofence / verification method | `AttendanceRecord.verificationMethod` | ✅ AVAILABLE | `normalizeAttendanceRecord` line 208-212 returns `verificationMethod` | Include in table if present |
| Shift adherence (punch-in ≤ shift start + grace) | Computed from `punchIn` + `Shift.gracePeriodMinutes` | ✅ AVAILABLE | `getShifts` returns `gracePeriodMinutes` (line 1124); attendance has `punchIn` | Compute client-side |
| Overtime by department | `AttendanceRecord.overtimeHours` + `department` | ✅ AVAILABLE | `normalizeAttendanceRecord` returns both | Aggregate client-side |
| Late arrivals weekday × hour heatmap | Computed from `punchIn` + `shift.startTime` | ✅ AVAILABLE | Both fields available | Compute client-side |

---

## 4. Payroll Variance & Compensation (`payroll-reports`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| Prior-month payroll run (for MoM variance) | `getPayrollRuns` with year filter + find previous month | ✅ AVAILABLE | `payrollApi.ts:234-258` returns runs with `month`, `year`, `total_gross_paise`, `total_net_paise` | Compute MoM client-side |
| Paise → Rupees normalization | `total_gross_paise` / 100 | ✅ AVAILABLE | `PayrollRunItem` has `total_gross_paise` (line 267); `PayrollRunEmployeeItem` has `gross_earnings_paise` (line 299) | Normalize in `buildDataset` |
| PAN / UAN / Bank masking | `PayslipItem.panNumber`, `uan`, `bankAccountMasked` | ✅ AVAILABLE | `PayslipItem` lines 362-366 | Mask by default; toggle for SUPER_ADMIN/HR_ADMIN |
| Salary bands for histogram | `SalaryStructureItem.annualCtc` or `monthlyGross` | ✅ AVAILABLE | `SalaryStructureItem` lines 409-411 | Use `annualCtc` or `monthlyGross` |
| Statutory breakdown (PF/ESI/PT/TDS) | `PayrollStats.statutoryBreakdown` | ✅ AVAILABLE | `PayrollStats` lines 242-247 | Use directly |
| Department-wise payroll cost | `PayrollRunEmployeeItem.department` + `gross_earnings_paise` | ✅ AVAILABLE | `PayrollRunEmployeeItem` line 297-298 | Aggregate client-side |

---

## 5. Leave Balances & Absence Liability (`leave-liability`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| **Org-wide per-employee leave balances** | `GET /leaves/balances?scope=ALL` or similar | ❌ MISSING | `getLeaveBalances` takes **no args** (line 362-399); returns `DEFAULT_LEAVE_BALANCES` for Super Admin; self-scoped only | **CRITICAL GAP** — show gap banner "Org-wide leave balances endpoint not implemented — showing current user only"; disable liability-by-dept chart & table |
| Employee salary (for daily rate = monthly gross ÷ 26) | `SalaryStructureItem.monthlyGross` per employee | ⚠️ PARTIAL | `getSalaryStructures` exists but may not cover all employees; no direct "salary per employee" endpoint | If missing: show liability in **days only** + gap banner "Estimated liability (₹) requires salary data — not available for all employees" |
| Leave type expiry dates | `LeaveBalance.expiresOn` | ✅ AVAILABLE | `normalizeLeaveBalance` line 223 returns `expiresOn` | Use for "expiring ≤90 days" chart |
| Holiday calendar | `getHolidays` | ✅ AVAILABLE | `attendanceApi.ts:1377-1422` | Use for peak-absence heatmap |

---

## 6. Performance & 9-Box Talent Grid (`performance-matrix`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| **`potential` field** | `AppraisalReview.potential` or similar | ❌ MISSING | `performance.types.ts` — no `potential` anywhere; `AppraisalReview` has `selfRating`, `managerRating`, `finalScore` only | **CRITICAL GAP** — derive "Potential (derived)" = blend of goal completion % + peer feedback avg; show visible note in UI & XLSX Summary: "Potential is derived (goal completion + peer feedback), not assessed" |
| 9-box grid data | Computed from performance + potential | ⚠️ DERIVED | Performance axis = `finalScore`/`managerRating` bucketed: low<3, mid 3–<4, high≥4 | Compute client-side with derived potential |
| High-performer retention (high performers still active) | Cross-ref `AppraisalReview.finalScore ≥ 4` with `workforceApi.getEmployees` status | ✅ AVAILABLE | Both sources exist | Compute client-side |
| Goal completion by department | `GoalItem.progressPercentage` + `employee.department` | ⚠️ PARTIAL | `GoalItem` has `progressPercentage` but `employee` ref only has `id`, `name` (line 199) — no department | Need to join with workforce data; gap banner if join fails |

---

## 7. Travel & Expense Spending Audit (`expenses-travel`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| Department budgets | `TravelSummaryMetrics.budgetByDepartment` or similar | ❌ MISSING | `TravelSummaryMetrics` (travel.types.ts:83-90) has only aggregate totals | Hide "spend vs budget" chart; gap banner "Department budgets not available in travel summary" |
| Receipt flag (has receipt Y/N) | `ExpenseClaim.receiptUrls.length > 0` | ✅ AVAILABLE | `ExpenseClaim` line 53 has `receiptUrls: string[]` | Compute client-side |
| Turnaround days (submit → reimbursed) | `ExpenseClaim.createdAt` → `paidAt` | ✅ AVAILABLE | `ExpenseClaim` lines 59, 57 | Compute client-side |
| Weekend/holiday claim detection | `ExpenseLineItem.date` + holiday calendar | ✅ AVAILABLE | `ExpenseLineItem` has `date` (line 31); holidays from `attendanceApi.getHolidays` | Compute client-side |
| Duplicate detection (same emp + amount + date) | `ExpenseClaim.employeeId` + `items[].amount` + `items[].date` | ✅ AVAILABLE | All fields present | Compute client-side |
| Category limits (for "amount above category limit" flag) | Config endpoint | ❌ MISSING | No category limit config in expenses API | Use hardcoded config constant with gap banner "Category limits from config — not backend-driven" |

---

## 8. Asset Inventory & Depreciation (`asset-audit`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| Purchase date, cost, warranty expiry | `Asset.purchaseDate`, `cost`, `warrantyExpiry` | ✅ AVAILABLE | `Asset` lines 61-64 | Use directly |
| Maintenance records with cost | `Asset.maintenanceRecords[].cost` | ✅ AVAILABLE | `MaintenanceRecord` line 40 has `cost` | Use for maintenance cost chart |
| Depreciation config (useful life per category) | Config constant (not backend) | ⚠️ CLIENT-SIDE | Not in API — will use hardcoded map: LAPTOP 3y, DESKTOP 4y, MOBILE 3y, SERVER 5y, FURNITURE 8y | Label clearly: "Management estimate, not statutory (Companies Act / Income-Tax Act) depreciation" |
| Asset age distribution | Computed from `purchaseDate` | ✅ AVAILABLE | `Asset.purchaseDate` | Compute client-side |
| Depreciation schedule next 5 years | Computed | ✅ DERIVED | Straight-line from purchase date + useful life | Compute client-side |

---

## 9. Statutory Registers & Audit Exports (`statutory-compliance`)

| Needed Data | Endpoint / Field | Exists? | Evidence | UI Treatment |
|-------------|------------------|---------|----------|--------------|
| PF register (ECR format) | `getPfEcr(periodId)` | ✅ AVAILABLE | `payrollApi.ts:511-523` returns `PfEcrResponse` with `records[]` | Use for PF register table |
| ESI register | `getPayslips` → filter `esiNumber` | ⚠️ PARTIAL | `PayslipItem.esiNumber` (line 366) | Build from payslips; gap banner if incomplete |
| PT register | `getPayslips` → `professionalTax` | ✅ AVAILABLE | `PayslipItem.deductions.professionalTax` (line 384) | Build from payslips |
| TDS summary | `PayrollStats.statutoryBreakdown.tdsTotal` + per-employee TDS | ✅ AVAILABLE | `PayslipItem.deductions.tds` (line 385) | Build from payslips |
| Filing tracker (PF/ESI/PT/TDS) | `getStatutoryFilingCalendar` | ✅ AVAILABLE | `payrollApi.ts:537-548` returns `StatutoryFilingCalendarItem[]` | Use directly |
| Audit logs | `hrDashboardApi.getAuditLogs` | ✅ AVAILABLE | `hrDashboardApi.ts:240-247` | Use with filters |
| **Labour-law registers (wage / muster-roll)** | Dedicated endpoints | ❌ MISSING | No endpoints found in any API | Gap banner "Wage register / Muster roll — no backend endpoint"; render only what exists |
| **Safety incident logs** | Dedicated endpoints | ❌ MISSING | No endpoints found | Gap banner "Safety incident logs — no backend endpoint" |
| **Form 16 / 24Q status** | Dedicated endpoints | ❌ MISSING | No endpoints found | Gap banner "Form 16 / 24Q — no backend endpoint" |
| UAN validation % | `getUanValidationAudit` | ✅ AVAILABLE | `payrollApi.ts:576-580` returns `UanValidationSummary` | Use for KPI |

---

## Cross-Cutting Gaps

| Area | Gap | Impact |
|------|-----|--------|
| **Audit log write for exports** | No `POST /audit-logs/export` endpoint found | Cannot record export events; log gap, show toast only |
| **Analytics export endpoint** | `POST /analytics/export` returns report URL but backend unconfirmed | Don't depend on it; use client-side export only |
| **FYTD date range (India FY Apr–Mar)** | No backend support; compute client-side | Implement in `ReportFilterBar` |
| **Role-scoped data for MANAGER** | Backend must enforce team scope; client-side filtering is not security | Rely on backend; if data leaks, it's a backend bug |

---

## Legend

- ✅ **AVAILABLE** — Endpoint exists and returns the field (verified by grep)
- ⚠️ **PARTIAL / DERIVED** — Data can be computed or joined client-side from multiple endpoints
- ❌ **MISSING** — No endpoint or field found; will show gap banner and disable affected UI element
- 🔴 **CRITICAL GAP** — Core report functionality blocked; report shows limited data with prominent banner