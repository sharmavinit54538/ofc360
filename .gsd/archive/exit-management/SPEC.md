# Specification: Real Excel/CSV Exports + Interactive Charts & Analysis for OFC360 Reports Hub

Status: FINALIZED
Date: 2026-11-02
Author: Senior Frontend Engineer

---

## 1. Executive Summary

This specification transforms the Reports & Analytics Hub at `/dashboard/reports` from a static gallery of 9 non-functional cards into a fully working reporting module. Each of the 9 reports will have a dedicated page with filters, KPI tiles, 4–6 interactive charts, an auto-generated "Key findings" panel, and a sortable data table — all with **real `.xlsx` and `.csv` downloads** matching exactly what is on screen.

**No fake data on the production path.** Demo fixtures only in vitest and behind `VITE_REPORTS_DEMO=true`.

---

## 2. Baseline Verification Evidence

- **Typecheck Baseline**: `npm run typecheck` (`tsc -b`) currently fails with **635 pre-existing diagnostics** across existing modules (`src/features/settings`, `src/features/analytics`, `src/features/workforce`, `src/features/documents`, etc.). Any new code in `src/features/reports` must be strictly typed and introduce **zero new diagnostics**.
- **Test Baseline**: `npm run test` (`vitest run`) executes **311 tests with 5 pre-existing failures** (4 in `signatureUtils.test.ts`, 1 in `SignatureCenter.test.tsx` — React element child object mismatch). All new report tests must run green.
- **Lint Baseline**: `npm run lint` executes an echo stub: `"ESLint setup scheduled for Phase 4"`. No linter currently enforces rules.
- **Libraries**: `recharts@^3.10.1` installed (used only in ExitAnalyticsCharts), `papaparse` installed (unused). **No xlsx library installed** — will add `exceljs` as the only new dependency, lazy-loaded.
- **Existing export code is weak**: `ExitAnalyticsPage.tsx` builds CSV by hand without escaping embedded quotes; `ExitManagementPage.tsx` builds an HTML table labeled `application/vnd.ms-excel` (not real `.xlsx`). Will migrate to new helper only if low-risk; otherwise leave and list in final report.
- **Existing analytics slice** (`src/services/analytics.api.ts`): `/analytics/summary`, `/analytics/workforce-trends`, `/analytics/department-breakdown`, `/analytics/attrition-risk`, `POST /analytics/export` (returns a report URL; no evidence backend implements it — verify, don't depend on it).
- **Existing RTK Query slices** (all registered in `src/app/store.ts`) — reuse their hooks and normalizers:
  - workforce: `getWorkforceStats`, `getEmployees`, `getDepartments`
  - recruitment: `getRecruitmentStats`, `getJobOpenings`, `getCandidates`, `getInterviews`
  - attendance: `getAttendanceStats`, `getAttendanceRecords`, `getShifts`, `getRosters`, `getRegularizationRequests`
  - payroll: `getPayrollStats(month,year)`, `getPayrollRuns`, `getPayrollRunEmployees`, `getPayslips`, `getStatutoryConfig`
  - leave: `getLeaveStats`, `getLeaveBalances`, `getLeaveRequests`, `getLeaveCalendar`
  - performance: `getReviews`/`getAppraisalReviews`, `getReviewCycles`, `getGoals`, `getPerformanceStats`, `getPeerFeedback`
  - expenses/travel: `getExpenseClaims`, `getExpensesSummary`, `getTravelRequests`, `getTravelSummary`
  - assets: `getAssetsList`, `getAssetStats`, `getAssetById`
  - hr-dashboard: `getAuditLogs`, `getPayrollDashboard`
  - exits: `exitsApi`
- **UI kit**: `@/shared/ui/*` (Button, Badge, Card, Tabs, Select, Skeleton, EmptyState, ErrorDisplay, Toast), `cn` from `@/shared/lib/utils`. Roles: `SUPER_ADMIN`, `HR_ADMIN`, `MANAGER`, `EMPLOYEE`, `IT_ADMIN` via `ProtectedRoute allowedRoles`.

---

## 3. Scope & The 9 Reports

| # | Report | Categories | Primary Sources |
|---|--------|------------|-----------------|
| 1 | Workforce & Headcount Analytics | workforce | `getWorkforceStats`, `getEmployees`, `getDepartments`, analytics slice, exits |
| 2 | Recruitment Funnel & Sourcing | recruitment | `getRecruitmentStats`, `getJobOpenings`, `getCandidates`, `getInterviews` |
| 3 | Attendance & Shift Utilization | attendance | `getAttendanceStats`, `getAttendanceRecords`, `getShifts`, `getRosters`, `getRegularizationRequests` |
| 4 | Payroll Variance & Compensation | payroll | `getPayrollRuns`, `getPayrollStats`, `getPayrollRunEmployees`, `getPayslips` |
| 5 | Leave Balances & Absence Liability | attendance | `getLeaveBalances`, `getLeaveRequests`, `getLeaveStats`, `getLeaveCalendar`, `getHolidays` |
| 6 | Performance & 9-Box Talent Grid | workforce | `getReviews`, `getReviewCycles`, `getGoals`, `getPerformanceStats`, `getPeerFeedback` |
| 7 | Travel & Expense Spending Audit | payroll | `getExpenseClaims`, `getExpensesSummary`, `getTravelRequests`, `getTravelSummary` |
| 8 | Asset Inventory & Depreciation | compliance | `getAssetsList`, `getAssetStats`, `getAssetById` |
| 9 | Statutory Registers & Audit Exports | compliance | `getPayrollStats().statutoryBreakdown`, `getStatutoryConfig`, `getPayslips`, `PfComplianceCenter`, `getAuditLogs`, exits F&F |

---

## 4. Architectural Rules

1. **No Fake Data / No Optimistic Persistence**: Demo data only in vitest and behind `VITE_REPORTS_DEMO=true` (tree-shaken from production).
2. **UI 4-State Architecture**: Every screen implements Loading (`Skeleton`), Error with Retry (`ErrorDisplay`), Empty (`EmptyState`), and Success.
3. **Defensive Data Layer**: `hooks/useReportDataset.ts` composes existing RTK hooks → one normalized `ReportDataset`. KPI tiles, charts, table, CSV and XLSX all derived from it.
4. **Strict RBAC** (declare in `registry.ts`; hide cards the user can't open):
   - `SUPER_ADMIN` / `HR_ADMIN` → all 9
   - `MANAGER` → workforce, attendance, leave, performance, recruitment (team-scoped — backend enforces scope)
   - `IT_ADMIN` → assets
   - `EMPLOYEE` → none
   - Payroll and Statutory → `SUPER_ADMIN` / `HR_ADMIN` only
5. **Route Hierarchy**:
   - `/dashboard/reports` (hub) — keep existing, rewire to new `ReportsHubPage`
   - `/dashboard/reports/:reportId` (lazy-loaded detail pages, same role gating, driven by `registry.ts`)
   - Keep `/dashboard/analytics`; link to it from Workforce report as "Open interactive analytics"
6. **Single Source of Truth**: `src/features/reports/registry.ts` — `ReportDefinition[]` defines all 9 reports (id, title, category, roles, filters, useData hook, kpis, charts, tables, xlsx sheets).

---

## 5. Data Contract: ReportDataset

```ts
type ReportDataset = {
  meta: {
    reportId: string;
    title: string;
    generatedAt: string;        // ISO
    filters: Record<string, any>;
    currency: string;           // 'INR'
  };
  kpis: KpiTile[];              // { label, value, unit?, trend?, format: 'number'|'currency'|'percent'|'days' }
  series: Record<string, ChartSeries>;  // keyed by chartId
  tables: Record<string, DataTableDef>; // { [name]: { columns: ColumnDef[], rows: any[][] } }
  warnings: string[];           // partial-data source failures
};
```

**Consistency invariant**: KPI = chart series total = sum of table column. Unit test enforces this.

---

## 6. Export Specification

### CSV (`papaparse.unparse`)
- One file per table; Export menu lets user pick table (default: main detail table)
- UTF-8 **with BOM**, CRLF, RFC-4180 quoting
- **Formula-injection guard**: string cell starting with `= + - @` (or tab/CR) gets leading `'`
- Numbers are real numbers; dates ISO `YYYY-MM-DD`; money in rupees; unit in header (e.g. `Gross Pay (INR)`)
- Filename: `ofc360_<report-id>_<YYYY-MM-DD>_<filters-slug>.csv`

### XLSX (`exceljs`, real `.xlsx` mime)
- **Sheet Summary**: title, generated at, generated by (name only), applied filters, KPI table, "Key findings", data-gap warnings, confidentiality note when personal data present
- **Sheet(s) Data – <table>**: bold+filled header, frozen header row, autofilter, column widths, number formats (`#,##0.00`, `0.0%`, `dd-mmm-yyyy`), SUM formulas in totals row
- **Sheet Chart Data**: exact series behind every chart (for native Excel pivots)
- **Sheet Charts**: PNG images of each on-screen chart (SVG→canvas→PNG at 2×, white bg, light-theme colours even in dark mode), laid out in grid with titles
- Async generation: spinner, disabled button, yield to event loop in chunks, success/failure toast
- >50,000 rows → warn and ask to narrow filters
- **Hub Bulk Export**: pick reports + date range → one workbook with Summary sheet + one main-table sheet per report

**PDF badges/buttons removed** (out of scope).

---

## 7. "Key Findings" Panel (Deterministic, No LLM)

Shared helpers in `insights/stats.ts`: `topN`, `share`, `momDelta`, `zScore` (flag `|z|>2`), `trend` (last 3 periods), `concentration`.

Each finding has severity (info/warn/critical) **and the number behind it**, e.g.:
- "Engineering attrition 12.4% — 2.1× company average"
- "Net payroll +8.3% MoM; 5 employees explain 62% of the increase"
- "3 claims look like duplicates (₹48,200)"

Findings also written into XLSX Summary sheet.

---

## 8. Filters, RBAC, Privacy

- **Common filters**: date range (this month, last month, quarter, **FYTD with India FY Apr–Mar**, custom), department, location; plus report-specific ones (status, cycle, category, leave type, shift…). Kept in URL search params (shareable, export matches).
- **Privacy**: payroll/statutory exports mask PAN (`ABCDE****F`), UAN, bank account (last 4) by default. "Include sensitive identifiers" toggle only for `SUPER_ADMIN`/`HR_ADMIN` (logged). Summary sheet carries "Confidential — contains personal data" when relevant. Never log row data to console.
- **Audit**: record each export via audit-log write endpoint if exists (grep first); otherwise log gap.

---

## 9. UX Requirements

- **Hub**: each card shows live headline KPI from same data hook (skeleton while loading, "—" if unavailable — no hardcoded numbers), primary "Open report" action, quick CSV/XLSX icon buttons exporting with default filters. Search + category filter stay.
- **Report page**: sticky header (title, filters, Export dropdown: Excel/CSV), KPI row, responsive chart grid (1 col mobile / 2 col desktop), per-chart "View data" toggle and "Download PNG", then data table (sort, search, column visibility, pagination 25/50/100).
- **Charts**: legend + tooltips, `Intl.NumberFormat('en-IN')` for ₹ and counts, colour-blind-safe palette (works light/dark), `aria-label` on every chart, never colour-only meaning.
- **States**: loading skeleton; error + retry; empty + "clear filters"; **partial** (some sources failed → show what loaded, warning banner listing failed sources, same warning in XLSX Summary).
- **Performance**: `React.lazy` report pages, recharts and exceljs; memoize derived datasets; paginate tables.

---

## 10. Verification & Acceptance Criteria (GSD "VERIFY")

### Unit (vitest)
- CSV escaping + BOM + formula-injection guard
- XLSX builder (read back with exceljs: sheet names, header row, frozen pane, number formats, row count = table rows)
- Each report's `buildDataset` with fixtures (camelCase/snake_case, paise/rupees, empty, partial failure)
- Insight rules; depreciation math; 9-box bucketing; payroll variance flags
- **On-screen = downloaded consistency test**

### Component (RTL + MSW)
- Hub renders 9 cards with no hardcoded numbers
- Clicking Export triggers Blob download with right filename and mime type
- Role gating hides/blocks reports correctly

### Evidence for Final Report
- `npm run typecheck` (no new diagnostics vs baseline 635)
- `npm run test` (no new failures vs baseline 5)
- `npm run build` (success)
- Light + dark screenshots of every report page (`VITE_REPORTS_DEMO=true`)
- Sample `.xlsx` and `.csv` outputs: sheet list + first rows

---

## 11. Work Order — Stop for Review After Each Phase

- **Phase 0**: Baselines (done), SPEC/ROADMAP (this doc), verified **API-gap table** (report × needed data × exists? × evidence) → `docs/API_GAPS.md`
- **Phase 1**: Export engine + shared report shell + **Workforce report end-to-end** + hub wiring
- **Phase 2**: Payroll, Attendance, Leave, Travel & Expense
- **Phase 3**: Recruitment, Performance (9-box), Assets, Statutory
- **Phase 4**: Bulk Export, accessibility pass, `docs/REPORTS.md`, final `docs/API_GAPS.md` update

---

## 12. Definition of Done — Final Report Must Contain

1. Files added/changed
2. Matrix: for each of 9 reports, what is **live**, what is **gap-bannered**, and why
3. API gaps added to `docs/API_GAPS.md`
4. Typecheck / test / build evidence vs baseline
5. Sample `.xlsx` and `.csv` outputs
6. Known limitations (e.g. Excel charts are images; native Excel charts would need backend endpoint)

**Out of scope**: PDF export, scheduled/emailed reports, native Excel charts, AI chat on reports. Do not start them.