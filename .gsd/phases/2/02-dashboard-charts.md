---
phase: 2
plan: 2
wave: 2
depends_on: ["1.1", "1.2"]
files_modified:
  - src/features/recruitment/components/HiringFunnelChart.tsx
  - src/features/recruitment/components/SourceEfficiencyChart.tsx
  - src/features/recruitment/components/TimeToHireChart.tsx
autonomous: true
must_haves:
  truths:
    - "All charts render with real data only"
    - "Loading skeletons during fetch"
    - "Empty states when no data"
    - "Error boundaries with retry"
    - "Responsive design (375/768/1280)"
    - "Dark/light theme support"
    - "Tooltips with detailed metrics on hover"
  artifacts:
    - "HiringFunnelChart.tsx - funnel visualization"
    - "SourceEfficiencyChart.tsx - horizontal bar chart"
    - "TimeToHireChart.tsx - line/area trend chart"
---

# Plan 2.2: Dashboard Chart Components

## Objective
Build three chart components for the recruitment dashboard: Hiring Funnel (conversion visualization), Source Efficiency (horizontal bar chart), and Time to Hire Trend (line chart). All using Recharts with consistent styling, loading/empty/error states.

## Context
Load for context:
- .gsd/SPEC.md
- src/features/analytics/components/DepartmentDistributionChart.tsx (chart patterns)
- src/features/analytics/components/WorkforceGrowthChart.tsx (chart patterns)
- src/features/analytics/components/AnalyticsEmptyState.tsx
- src/shared/ui/Skeleton.tsx
- src/shared/ui/ErrorDisplay.tsx
- src/shared/ui/Card.tsx
- Recharts documentation (AreaChart, BarChart, FunnelChart, Tooltip, ResponsiveContainer)
- src/features/recruitment/utils/dashboardCalculators.ts (FunnelStageMetric type)

## Tasks

<task type="auto">
  <name>Create HiringFunnelChart component</name>
  <files>src/features/recruitment/components/HiringFunnelChart.tsx</files>
  <action>
    Build a hiring funnel visualization showing candidate flow through stages:
    
    Visual Design:
    - Segmented funnel shape using CSS (not Recharts FunnelChart - custom stacked bars)
    - Each stage: colored bar width proportional to count
    - Stage label, count, conversion % from previous, dropoff %
    - Color gradient: brand-500 (top) to emerald-500 (bottom)
    - Hover tooltip: detailed metrics
    
    Data Input:
    interface HiringFunnelChartProps {
      funnelData: { stage: string; count: number; conversion_pct: number }[];
      isLoading: boolean;
      error?: unknown;
      onRetry?: () => void;
    }
    
    Stages (in order): Applied → Screening → Shortlisted → Interview → Technical → HR → Offer → Hired
    
    States:
    - Loading: Skeleton bars (4-5 animated)
    - Empty: AnalyticsEmptyState with "No pipeline data"
    - Error: ErrorDisplay with retry
    
    Implementation:
    - Use ResponsiveContainer for responsive sizing
    - Custom SVG funnel or stacked horizontal bars with clipped paths
    - Show conversion % between stages
    - Show absolute count on each stage
    - Dark mode compatible colors
    - Follow DepartmentDistributionChart styling patterns
    
    Tooltip on hover:
    - Stage name
    - Candidate count
    - Conversion from previous stage
    - Dropoff from previous stage
    - Conversion from Applied (overall)
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/HiringFunnelChart.tsx</verify>
  <done>Component renders funnel with real data, handles all states, TypeScript passes</done>
</task>

<task type="auto">
  <name>Create SourceEfficiencyChart component</name>
  <files>src/features/recruitment/components/SourceEfficiencyChart.tsx</files>
  <action>
    Build a horizontal bar chart showing candidate sourcing effectiveness:
    
    Visual Design:
    - Horizontal grouped bars: Candidates sourced vs Hired per source
    - Sources on Y-axis, Count on X-axis
    - Two bar groups per source: Total Candidates (muted), Hired (brand color)
    - Hire rate % shown as label on hired bars
    - Sortable: by total candidates, hire rate, or alphabetical
    
    Data Input:
    interface SourceEfficiencyChartProps {
      sourceData: { source: string; candidates: number; hired: number; conversionRate: number }[];
      isLoading: boolean;
      error?: unknown;
      onRetry?: () => void;
      sortBy?: 'candidates' | 'conversionRate' | 'source';
    }
    
    States:
    - Loading: Skeleton horizontal bars
    - Empty: AnalyticsEmptyState with "No sourcing data"
    - Error: ErrorDisplay with retry
    
    Implementation:
    - Use Recharts BarChart with layout="vertical"
    - Bar categories: source names
    - Two Bar series: candidates (gray), hired (brand-500)
    - Custom Tooltip showing: source, candidates, hired, hire rate %
    - X-axis: numeric with appropriate ticks
    - Y-axis: category (source names)
    - Legend: Candidates vs Hired
    - ResponsiveContainer for sizing
    - Dark mode support
    
    Sorting:
    - Default: by candidates desc
    - Clickable column headers or dropdown for sort options
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/SourceEfficiencyChart.tsx</verify>
  <done>Component renders horizontal bars with real data, handles all states, TypeScript passes</done>
</task>

<task type="auto">
  <name>Create TimeToHireChart component</name>
  <files>src/features/recruitment/components/TimeToHireChart.tsx</files>
  <action>
    Build a line/area chart showing time-to-hire trends over periods:
    
    Visual Design:
    - Area chart with gradient fill (brand-500/20 to transparent)
    - Line: Average Time to Hire (days) per period
    - Second line: Average Time to Fill (days) per period (dashed, amber)
    - Periods on X-axis (weekly/monthly buckets)
    - Days on Y-axis
    - Hover tooltip: period, time to hire, time to fill, hires count
    - Target line: 30 days (dotted gray) as benchmark
    
    Data Input:
    interface TimeToHireChartProps {
      trendData: { period: string; avgTimeToHire: number; avgTimeToFill: number; hiresCount: number }[];
      isLoading: boolean;
      error?: unknown;
      onRetry?: () => void;
      granularity?: 'weekly' | 'monthly';
    }
    
    States:
    - Loading: Skeleton chart area
    - Empty: AnalyticsEmptyState with "No trend data"
    - Error: ErrorDisplay with retry
    
    Implementation:
    - Use Recharts AreaChart + LineChart combination
    - Two Area series (or one Area + one Line for Time to Fill)
    - X-axis: category (period labels)
    - Y-axis: number (days) with 0 baseline
    - ReferenceLine at y=30 for benchmark
    - Custom Tooltip with both metrics + hires count
    - Legend: Time to Hire, Time to Fill, Benchmark
    - ResponsiveContainer
    - Dark mode support
    - Follow WorkforceGrowthChart patterns for tooltip/hover
    
    Granularity:
    - Weekly: last 12 weeks
    - Monthly: last 12 months
    - Control via prop or filter bar
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/TimeToHireChart.tsx</verify>
  <done>Component renders trend lines with real data, handles all states, TypeScript passes</done>
</task>

<task type="auto">
  <name>Export chart components from index</name>
  <files>src/features/recruitment/components/index.ts</files>
  <action>
    Update components index.ts to export:
    - HiringFunnelChart
    - SourceEfficiencyChart
    - TimeToHireChart
  </action>
  <verify>TypeScript compiles: npx tsc --noEmit src/features/recruitment/components/index.ts</verify>
  <done>Exports work correctly</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] HiringFunnelChart renders funnel stages with conversion %
- [ ] SourceEfficiencyChart shows horizontal bars with hire rates
- [ ] TimeToHireChart shows dual trend lines with benchmark
- [ ] All charts have loading/empty/error states
- [ ] Responsive at 375/768/1280 breakpoints
- [ ] Dark/light theme works
- [ ] TypeScript compilation passes
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
</success_criteria>