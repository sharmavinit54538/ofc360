# OFC360 Sidebar Navigation Audit

## Current Structure (4 sections, ~68 tabs)

### 1. Core (always visible, 13 tabs + 3 child items = 16 items)
- Overview (LayoutGrid) - `/dashboard` (OverviewView)
- AI Insights (Sparkles) - AnalyticsCenterPage
- Employees (Users) - ComingSoonView
- HR Management (UserCog) - ComingSoonView
- Managers (UserPlus) - ComingSoonView
- Departments (Building2) - ComingSoonView
- Attendance (CalendarDays) - ComingSoonView + children:
  - Shifts (Clock) - `/dashboard/attendance/shifts` (ShiftsView)
  - Rosters (ScrollText) - `/dashboard/attendance/rosters` (RostersView)
  - Holidays (Palmtree) - `/dashboard/attendance/holidays` (HolidaysView)
- Shifts (Clock) - **DUPLICATE** - `/dashboard/attendance/shifts` (ShiftsView)
- Rosters (ScrollText) - **DUPLICATE** - `/dashboard/attendance/rosters` (RostersView)
- Holidays (Palmtree) - **DUPLICATE** - `/dashboard/attendance/holidays` (HolidaysView)
- Timesheets (Timer) - ComingSoonView
- Leaves (FileText) - ComingSoonView
- Payroll (CreditCard) - ComingSoonView
- Performance (Gauge) - ComingSoonView
- Documents (FolderKanban) - ComingSoonView
- Assets (Box) - ComingSoonView (but AssetManagementPage exists)

### 2. Recruitment (collapsible, 27 tabs)
- Dashboard (LayoutGrid) - ComingSoonView
- Requisitions (FileSpreadsheet) - ComingSoonView
- All Jobs (Briefcase) - ComingSoonView
- Create Job (FilePlus) - ComingSoonView
- Candidates (UserSearch) - ComingSoonView
- Talent Pool (UserCheck) - ComingSoonView
- Pipeline (Layers) - ComingSoonView
- Interviews (CalendarCheck) - ComingSoonView
- Interview Calendar (CalendarDays) - ComingSoonView
- Scorecards (ClipboardCheck) - ComingSoonView
- Offers (FileText) - ComingSoonView
- Onboarding (UserCheck) - ComingSoonView
- Candidate CRM (MessageSquare) - ComingSoonView
- Resume Intelligence (ScanText) - ComingSoonView
- Email Templates (Mail) - ComingSoonView
- Referrals (Gift) - ComingSoonView
- Vendors (Building2) - ComingSoonView
- Career Site (Globe) - ComingSoonView
- Automation (Workflow) - ComingSoonView
- Compliance (ShieldCheck) - ComingSoonView
- Global Search (Search) - ComingSoonView
- Notifications (Bell) - ComingSoonView
- Import/Export (Download) - ComingSoonView
- Hiring Reports (BarChart2) - ComingSoonView
- Analytics (LineChart) - ComingSoonView
- Recruitment AI (Sparkles) - ComingSoonView
- AI Copilot (Bot) - ComingSoonView

### 3. AI Hub (collapsible, 15 tabs)
- Hub Dashboard (LayoutGrid) - ComingSoonView
- Workforce Insights (Brain) - ComingSoonView
- AI Recruiter (Briefcase) - ComingSoonView
- Attendance Monitor (Clock) - ComingSoonView
- Leave Assistant (FileText) - ComingSoonView
- Performance Coach (Gauge) - ComingSoonView
- Payroll Insights (CreditCard) - ComingSoonView
- Workforce Planning (Target) - ComingSoonView
- Employee Health (HeartPulse) - ComingSoonView
- Policy Assistant (BookOpen) - ComingSoonView
- Document Generator (FilePlus2) - ComingSoonView
- Meeting Intelligence (Video) - MeetingIntelligencePage
- Compliance Monitor (ShieldAlert) - ComingSoonView
- Chat Assistant (MessageSquare) - ChatAssistantPage
- Analytics Center (LineChart) - AnalyticsCenterPage

### 4. HR Ops & Administration (collapsible, 13 tabs)
- HR Ops Dashboard (LayoutDashboard) - HrOpsPage
- Employee Timeline (Activity) - TimelinePage
- Asset Management (Box) - AssetManagementPage
- Visitor Management (Users) - VisitorsPage
- Expense Claims (Receipt) - ExpenseClaimsPage
- Travel Requests (Plane) - TravelRequestsPage
- Onboarding Checklist (UserCheck) - OnboardingChecklistPage
- Offboarding (PackageMinus) - ExitManagementPage
- Exit Management (LogOut) - ExitManagementPage **DUPLICATE**
- Settings (Settings) - ComingSoonView

## Actual Implemented Pages (with routes)
1. Overview - `/dashboard` (OverviewView)
2. Shifts - `/dashboard/attendance/shifts` (ShiftsView)
3. Rosters - `/dashboard/attendance/rosters` (RostersView)
4. Holidays - `/dashboard/attendance/holidays` (HolidaysView)
5. Analytics Center - `/dashboard/analytics` or `/ai/analytics-center` (AnalyticsCenterPage)
6. Chat Assistant - `/ai/chat-assistant` or `/dashboard/chat-assistant` (ChatAssistantPage)
7. Meeting Intelligence - `/ai/meeting-intelligence` or `/dashboard/meeting-intelligence` (MeetingIntelligencePage)
8. Travel Requests - `/dashboard/travel` (TravelRequestsPage)
9. Expense Claims - `/dashboard/expenses` (ExpenseClaimsPage)
10. Exit Management - `/dashboard/exit-management` (ExitManagementPage)
11. Onboarding Checklist - `/dashboard/onboarding-checklist` (OnboardingChecklistPage)
12. Visitors - `/dashboard/visitors` (VisitorsPage)
13. Asset Management - `/dashboard/asset-management` or `/dashboard/assets` (AssetManagementPage)
14. Timeline - `/dashboard/timeline` or `/dashboard/employee-timeline` (TimelinePage)
15. HR Ops - `/dashboard/hr-ops` or `/dashboard/hrops` (HrOpsPage)
16. Settings - `/settings/*` (SettingsLayout with subsections)

## New Required 12-Group IA

1. **Overview** - Main dashboard/overview
2. **Workforce** - Employees, Departments, Managers, HR Management
3. **Recruitment** - All recruitment tabs (keep separate)
4. **Attendance & Time** - Attendance, Shifts, Rosters, Holidays, Timesheets
5. **Payroll & Benefits** - Payroll
6. **Leave Management** - Leaves
7. **Performance** - Performance
8. **Reports** - Analytics from all modules
9. **AI Hub** - All AI features
10. **Documents** - Documents, Policies, Templates, Compliance
11. **HR Operations** - Assets, Visitors, Travel, Expenses, Onboarding, Offboarding, Exit, Timeline
12. **Settings & Integrations** - Settings

## Mapping Plan

### 1. Overview
- Overview (from Core)

### 2. Workforce
- Employees (from Core)
- HR Management (from Core)
- Managers (from Core)
- Departments (from Core)

### 3. Recruitment (keep all 27 tabs, but reorganize if needed)
- All 27 recruitment tabs stay here

### 4. Attendance & Time
- Attendance (parent from Core) -> Shifts, Rosters, Holidays
- Timesheets (from Core)
- **Remove duplicate Shifts, Rosters, Holidays standalone tabs**

### 5. Payroll & Benefits
- Payroll (from Core)

### 6. Leave Management
- Leaves (from Core)

### 7. Performance
- Performance (from Core)

### 8. Reports
- AI Insights (from Core) -> AnalyticsCenterPage
- Hiring Reports (from Recruitment)
- Recruitment Analytics (from Recruitment)
- Analytics Center (from AI Hub)
- Any other analytics/reporting tabs

### 9. AI Hub
- All 15 AI Hub tabs
- Recruitment AI (from Recruitment)
- AI Copilot (from Recruitment)
- Meeting Intelligence (from AI Hub - already there)

### 10. Documents
- Documents (from Core)
- Compliance (from Recruitment)
- Compliance Monitor (from AI Hub)
- Policy Assistant (from AI Hub)
- Document Generator (from AI Hub)

### 11. HR Operations
- Asset Management (from Core/HR Ops)
- Visitor Management (from HR Ops)
- Expense Claims (from HR Ops)
- Travel Requests (from HR Ops)
- Onboarding Checklist (from HR Ops)
- Offboarding/Exit Management (from HR Ops - merge duplicates)
- Employee Timeline (from HR Ops)
- HR Ops Dashboard (from HR Ops)

### 12. Settings & Integrations
- Settings (from HR Ops)
- All settings subsections (Company, Employees, Attendance, Leave, Payroll, Documents, Assets, Notifications, Profile)

## Duplicates to Resolve
1. Shifts, Rosters, Holidays - appear as children of Attendance AND as standalone tabs -> Keep only as children
2. Offboarding & Exit Management - both point to ExitManagementPage -> Keep one (Exit Management)
3. Analytics Center appears in Core (as AI Insights) and AI Hub -> Move to Reports
4. Meeting Intelligence appears in AI Hub and as separate route -> Keep in AI Hub
5. Assets appears in Core (ComingSoon) and HR Ops (AssetManagementPage) -> Use HR Ops version