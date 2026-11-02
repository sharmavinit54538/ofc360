# ROADMAP: Real Excel/CSV Exports + Interactive Charts & Analysis for OFC360 Reports Hub

## Work Packages & Execution Plan

### Phase 0: Baselines, SPEC/ROADMAP, API Gap Audit
- [x] **RPT-00**: Record baselines (typecheck: 635 errors, tests: 311 tests/5 failures)
- [x] **RPT-01**: Archive old Exit Management SPEC/ROADMAP/STATE to `.gsd/archive/`
- [x] **RPT-02**: Write new SPEC.md (this feature) and ROADMAP.md, mark `Status: FINALIZED`
- [ ] **RPT-03**: API gap audit — grep each report's needed endpoints/fields, document in `docs/API_GAPS.md` with method, path, request/response fields, UI treatment

### Phase 1: Export Engine + Shared Shell + Workforce Report (Proves Pattern)
- [ ] **RPT-10**: Create `src/features/reports/` folder structure (registry, types, pages, components, charts, hooks, export, insights, __tests__)
- [ ] **RPT-11**: Install `exceljs` (lazy-loaded), verify `papaparse` + `recharts` available
- [ ] **RPT-12**: Build export engine:
  - `export/csv.ts` — PapaParse with BOM, formula-injection guard, RFC-4180
  - `export/xlsx.ts` — ExcelJS workbook builder (Summary, Data sheets, Chart Data, Charts as PNG)
  - `export/chartImage.ts` — Recharts SVG → canvas → PNG (2×, light theme, white bg)
  - `export/download.ts` — Blob trigger, filename slugifier, toast integration
- [ ] **RPT-13**: Shared report shell components:
  - `ReportFilterBar` — URL-synced filters (date range with FYTD, department, location, report-specific)
  - `KpiGrid` — memoized tiles from `ReportDataset.kpis`
  - `ChartCard` — wrapper with legend, tooltip, aria-label, "View data"/PNG buttons, responsive grid
  - `DataTable` — TanStack Table v8 (sort, search, column visibility, pagination 25/50/100)
  - `InsightsPanel` — deterministic findings from `insights/rules.ts` + `insights/stats.ts`
  - `ExportMenu` — dropdown (XLSX / CSV per table), bulk export entry point
  - `GapBanner` — shows partial-data warnings + links to API_GAPS.md
- [ ] **RPT-14**: `hooks/useReportDataset.ts` — composes RTK hooks → normalized `ReportDataset`
- [ ] **RPT-15**: Chart wrappers in `charts/` (Bar, StackedBar, Line, Area, Donut, Funnel, Heatmap grid, NineBox)
- [ ] **RPT-16**: **Workforce Report** end-to-end:
  - `registry.ts` entry with id `workforce-analytics`, KPIs, charts, table columns
  - `pages/ReportDetailPage.tsx` generic shell (lazy-loaded)
  - `buildDataset` for workforce: `getWorkforceStats` + `getEmployees` + `getDepartments` + analytics trends + exits
  - KPIs: total headcount, active, on probation, joiners/exits (period), retention %, attrition %, avg tenure
  - Charts: headcount trend (joiners vs leavers line), dept distribution (bar), gender split (donut), work-mode split (donut), tenure histogram, attrition risk by dept
  - Table: code, name, department, designation, manager, location, work mode, gender, join date, tenure (yrs), status
  - Verify: age/demographic bands need DOB — only show if present (gap banner)
- [ ] **RPT-17**: Hub rewrite (`pages/ReportsHubPage.tsx`):
  - Replace static `REPORT_MODULES` with dynamic cards from `registry.ts`
  - Each card fetches its headline KPI via the same `useReportDataset` hook (skeleton → live KPI or "—")
  - "Open report" → `/dashboard/reports/:reportId`
  - Quick CSV/XLSX icon buttons export with default filters
  - Keep search + category filter
- [ ] **RPT-18**: Route registration in `AppRoutes.tsx`: `/dashboard/reports/:reportId` lazy-loaded, same role gating as hub, driven by `registry.ts.roles`
- [ ] **RPT-19**: Unit tests for export engine (CSV escaping, XLSX read-back, chart PNG), workforce `buildDataset` fixtures, insight rules, consistency test

### Phase 2: Payroll, Attendance, Leave, Travel & Expense
- [ ] **RPT-20**: **Payroll Variance & Compensation** (`payroll-reports`)
  - Sources: `getPayrollRuns`, `getPayrollStats(month,year)`, `getPayrollRunEmployees`, `getPayslips`
  - KPIs: gross, net, deductions, employees processed, on-hold, MoM variance % (gross/net)
  - Charts: gross vs net trend (12mo), MoM variance bars (±5% threshold highlight), statutory breakdown PF/ESI/PT/TDS (stacked), cost by dept, salary-band histogram
  - Table: employee, department, gross, deductions, net, prev-month net, variance ₹/%, flag
  - Normalize paise → rupees. Mask PAN/bank/UAN. Gap: MoM variance needs prior-month run — verify endpoint
- [ ] **RPT-21**: **Attendance & Shift Utilization** (`attendance-reports`)
  - Sources: `getAttendanceStats`, `getAttendanceRecords` (company scope), `getShifts`, `getRosters`, `getRegularizationRequests`
  - KPIs: attendance %, late arrivals, avg work hours, total overtime hrs, absentee rate, pending regularizations, shift adherence % (punch-in ≤ shift start + grace)
  - Charts: daily attendance trend, late arrivals weekday×hour heatmap, overtime by dept, shift utilization (rostered vs present stacked), status split (donut)
  - Table: date, employee, department, shift, punch in/out, hours, overtime, status, late minutes, method/geofence (if present)
  - Gap: geofence/method fields — verify
- [ ] **RPT-22**: **Leave Balances & Absence Liability** (`leave-liability`)
  - Sources: `getLeaveBalances`, `getLeaveRequests`, `getLeaveStats`, `getLeaveCalendar`, `getHolidays`
  - KPIs: total available days, carried-forward, encashable, **estimated liability ₹** (encashable × daily rate; daily rate = monthly gross ÷ 26, constant labelled), avg leaves/mo, pending requests
  - Charts: balance by leave type (used/pending/available stacked), liability by dept, monthly leave trend, peak-absence heatmap, balances expiring ≤90 days
  - Table: employee, department, leave type, quota, used, pending, available, carried fwd, encashed, expires on, est. liability
  - Gap: `getLeaveBalances` takes no args (self-scoped) — org-wide per-employee balances endpoint likely missing. Liability needs salary/employee — if missing, show days only + banner.
- [ ] **RPT-23**: **Travel & Expense Spending Audit** (`expenses-travel`)
  - Sources: `getExpenseClaims`, `getExpensesSummary`, `getTravelRequests`, `getTravelSummary`
  - KPIs: total claimed, reimbursed, pending, rejected, avg turnaround days (submit→reimbursed), audit-flag count
  - Charts: spend by category (donut), monthly spend trend, spend by dept (vs budget if exists), top-10 claimants, turnaround histogram, travel by mode/destination
  - Deterministic audit flags (rules in code, thresholds in config): missing receipt, possible duplicate (same emp+amount+date), weekend/holiday claim, amount above category limit, approved without receipt
  - Table: claim id, employee, department, category, amount, date, status, receipt Y/N, approver, turnaround days, flags
  - Gap: dept budgets, receipt flag availability — verify
- [ ] **RPT-24**: Unit/component tests for Phase 2 reports

### Phase 3: Recruitment, Performance (9-Box), Assets, Statutory
- [ ] **RPT-30**: **Recruitment Funnel & Sourcing** (`recruitment-reports`)
  - Sources: `getRecruitmentStats`, `getJobOpenings`, `getCandidates` (has `source`), `getInterviews`
  - KPIs: open positions, applications, active pipeline, interviews this week, offers accepted, avg time-to-hire, offer-acceptance rate
  - Charts: funnel (Applied→Screening→Interview→Offer→Hired), source attribution (bar) + hire-rate by source, applications over time, openings by dept, open-req ageing
  - Table: candidate, job, department, source, stage, applied date, days in stage, recruiter
  - Gap: stage-history timestamps, cost-per-hire — likely missing. Call it "Source effectiveness (hire rate)" not "Source ROI" unless cost field exists.
- [ ] **RPT-31**: **Performance & 9-Box Talent Grid** (`performance-matrix`)
  - Sources: `getReviews`, `getReviewCycles`, `getGoals`, `getPerformanceStats`, `getPeerFeedback`
  - KPIs: reviews completed %, avg final score, high-performer %, goal completion %, overdue reviews
  - Charts: rating distribution, goal completion by dept, **9-box grid** (3×3: x=potential, y=performance; cell shows count + employee list on hover/drill-down), cycle-over-cycle score trend, high-performer retention
  - Performance axis = `finalScore`/`managerRating` bucketed: low<3, mid 3–<4, high≥4 (5-point scale, config constant)
  - **No `potential` field anywhere in `src`** → log in API_GAPS. Derive "Potential (derived)" = blend of goal completion % + peer-feedback avg, with visible note in UI and XLSX Summary
  - Table: employee, department, cycle, self rating, manager rating, final score, goal completion %, 9-box label
- [ ] **RPT-32**: **Asset Inventory & Depreciation** (`asset-audit`)
  - Sources: `getAssetsList`, `getAssetStats`, `getAssetById` (allocations + maintenance)
  - Fields: `purchaseDate`, `cost`, `warrantyExpiry`, `status`, `category`, `currentHolder`, `maintenanceRecords`
  - Depreciation: straight-line, useful life per category in config map (LAPTOP 3y, DESKTOP 4y, MOBILE 3y, SERVER 5y, FURNITURE 8y), salvage 0 default. NBV = cost − accumulated depreciation (floored at salvage). Label **"management estimate, not statutory (Companies Act / Income-Tax Act) depreciation"**
  - KPIs: total assets, total cost, net book value, assigned %, in maintenance, warranty expiring ≤90 days, retired
  - Charts: assets by category/status, cost vs NBV by category, depreciation schedule next 5y (stacked area), warranty-expiry timeline, age distribution, maintenance cost by category
  - Table: tag, name, category, serial, status, holder, purchase date, cost, age (months), accumulated depreciation, NBV, warranty expiry, days to warranty expiry
- [ ] **RPT-33**: **Statutory Registers & Audit Exports** (`statutory-compliance`)
  - Sources: `getPayrollStats().statutoryBreakdown` (PF/ESI/PT/TDS), `getStatutoryConfig`, `getPayslips` (UAN/PF/ESI), `PfComplianceCenter` data, `getAuditLogs`, exits F&F
  - KPIs: PF/ESI/PT/TDS payable this period, filings due/overdue/filed, UAN validation %, audit events in period
  - Charts: statutory liability trend by type, filing status timeline, on-time vs late filings, audit log by severity/resource type, UAN/ESI coverage
  - Tables (each own CSV/XLSX sheet): PF register, ESI register, PT register, TDS summary, Filing tracker, Audit log. User picks register in Export menu.
  - Gap: labour-law registers (wage/muster-roll), safety-incident logs, Form 16/24Q status — likely no endpoints → log in API_GAPS, render only what exists. Don't hardcode "Compliance Audit 100%".
- [ ] **RPT-34**: Unit/component tests for Phase 3 reports

### Phase 4: Bulk Export, Accessibility, Documentation
- [ ] **RPT-40**: Hub "Bulk Export" — multi-report picker + date range → single workbook (Summary + main table per report)
- [ ] **RPT-41**: Accessibility pass — ARIA labels, keyboard nav, colour-blind palette, focus management
- [ ] **RPT-42**: `docs/REPORTS.md` — user guide for each report (filters, KPIs, charts, tables, exports)
- [ ] **RPT-43**: Final `docs/API_GAPS.md` update with all gaps discovered
- [ ] **RPT-44**: Final verification — typecheck (no new), test (no new), build (success), screenshots (light/dark, `VITE_REPORTS_DEMO=true`), sample .xlsx/.csv outputs

---

## Definition of Done Per Task
- Code compiles (`npm run typecheck` — zero new diagnostics)
- Tests pass (`npm run test` — zero new failures)
- Component renders in all 4 states (loading, error, empty, success)
- Export produces valid `.xlsx` (readable by ExcelJS) and `.csv` (PapaParse round-trip)
- On-screen data = downloaded data (consistency test)
- Atomic commit: `feat(reports): <scope>` (e.g. `feat(reports): export engine + csv/xlsx helpers`)