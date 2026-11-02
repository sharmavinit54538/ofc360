# Session State: Reports Hub — Real Exports & Interactive Charts

## Current Position
- **Phase**: 1 (Export Engine + Shared Shell + Workforce Report)
- **Status**: Phase 0 complete. SPEC/ROADMAP finalized. Baselines recorded. API gaps documented in `docs/API_GAPS.md`.

## Baselines Recorded
- **Typecheck**: 635 pre-existing errors (tsc -b)
- **Tests**: 311 tests, 5 pre-existing failures (4 in signatureUtils.test.ts, 1 in SignatureCenter.test.tsx)
- **Lint**: Echo stub only ("ESLint setup scheduled for Phase 4")

## Files Touched (Phase 0)
- `.gsd/archive/SPEC-ExitManagement.md` (moved)
- `.gsd/archive/ROADMAP-ExitManagement.md` (moved)
- `.gsd/archive/STATE-ExitManagement.md` (moved)
- `.gsd/SPEC.md` (new — Reports feature)
- `.gsd/ROADMAP.md` (new — Reports feature)
- `.gsd/STATE.md` (this file)
- `docs/API_GAPS.md` (new — 9 reports × gaps matrix)

## Phase 0 Complete: API Gap Audit Summary

### Critical Gaps (block core functionality)
1. **Workforce**: Age histogram needs DOB — not in API
2. **Recruitment**: Candidate `source` field missing; stage-history timestamps missing; cost-per-hire missing
3. **Leave**: **Org-wide per-employee balances endpoint missing** (`getLeaveBalances` is self-scoped only); liability needs salary data
4. **Performance**: **No `potential` field anywhere** — must derive "Potential (derived)" from goal completion + peer feedback
5. **Statutory**: Labour-law registers (wage/muster-roll), safety incidents, Form 16/24Q — no endpoints

### Partial Gaps (workaround exists)
- Recruitment: Open requisition ageing from `targetDate` only
- Payroll: MoM variance computed client-side from runs
- Travel: Department budgets missing
- Leave: Salary data may not cover all employees
- Performance: Goal completion by dept needs join with workforce
- Expenses: Category limits from config constant
- Assets: Depreciation config client-side (hardcoded map)

### Cross-Cutting
- No audit log write endpoint for exports
- `POST /analytics/export` backend unconfirmed
- FYTD (India FY Apr-Mar) computed client-side

## Phase 1 Tasks (RPT-10 through RPT-19)
- [ ] **RPT-10**: Create `src/features/reports/` folder structure
- [ ] **RPT-11**: Install `exceljs` (lazy-loaded)
- [ ] **RPT-12**: Build export engine (csv.ts, xlsx.ts, chartImage.ts, download.ts)
- [ ] **RPT-13**: Build shared report shell components
- [ ] **RPT-14**: Build `hooks/useReportDataset.ts`
- [ ] **RPT-15**: Build chart wrappers in `charts/`
- [ ] **RPT-16**: Implement Workforce report end-to-end
- [ ] **RPT-17**: Rewrite Hub page to use registry
- [ ] **RPT-18**: Register `/dashboard/reports/:reportId` route
- [ ] **RPT-19**: Unit tests for export engine + workforce dataset

## Next Action
Start RPT-10: Create folder structure and install exceljs.