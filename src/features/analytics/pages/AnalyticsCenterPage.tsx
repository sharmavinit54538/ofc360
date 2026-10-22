/**
 * @file AnalyticsCenterPage.tsx
 * @description Enterprise Workforce Analytics & Intelligence Center orchestrating executive KPI grids,
 * dynamic headcount growth charts, department distribution, predictive AI attrition tables, and report exports.
 */

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Brain,
  Sparkles,
} from 'lucide-react';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetAnalyticsSummaryQuery,
  useGetWorkforceTrendsQuery,
  useGetDepartmentBreakdownQuery,
  useGetAttritionRiskAnalysisQuery,
  useExportAnalyticsReportMutation,
} from '../api/analyticsApi';
import type {
  AnalyticsDateRange,
  AnalyticsFilterParams,
  AIAttritionRiskItem,
} from '../types';
import { AnalyticsKpiGrid } from '../components/AnalyticsKpiGrid';
import { WorkforceGrowthChart } from '../components/WorkforceGrowthChart';
import { DepartmentDistributionChart } from '../components/DepartmentDistributionChart';
import { AttritionRiskTable } from '../components/AttritionRiskTable';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';

export const AnalyticsCenterPage: React.FC = () => {
  const toast = useToast();

  // Filter States
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('QUARTER');
  const [departmentId, setDepartmentId] = useState('ALL');

  // Query Filters Payload
  const queryFilters: AnalyticsFilterParams = useMemo(
    () => ({
      dateRange,
      departmentId: departmentId !== 'ALL' ? departmentId : undefined,
    }),
    [dateRange, departmentId]
  );

  // RTK Query Hooks (Zero mock data, real production contracts)
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
    error: summaryError,
    refetch: refetchSummary,
  } = useGetAnalyticsSummaryQuery(queryFilters);

  const {
    data: trendsData,
    isLoading: isTrendsLoading,
    refetch: refetchTrends,
  } = useGetWorkforceTrendsQuery(queryFilters);

  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    refetch: refetchDepartments,
  } = useGetDepartmentBreakdownQuery(queryFilters);

  const {
    data: attritionData,
    isLoading: isAttritionLoading,
    refetch: refetchAttrition,
  } = useGetAttritionRiskAnalysisQuery(queryFilters);

  const [exportReport, { isLoading: isExporting }] = useExportAnalyticsReportMutation();

  const handleRefreshAll = () => {
    refetchSummary();
    refetchTrends();
    refetchDepartments();
    refetchAttrition();
    toast.info('Syncing workforce models and KPI metrics from server...', 'Analytics Refreshed');
  };

  const handleExport = async (format: 'PDF' | 'CSV' | 'XLSX') => {
    try {
      const res = await exportReport({
        format,
        filters: queryFilters,
      }).unwrap();
      toast.success(
        `Report ${res?.fileName || `${format}_Workforce_Report`} generated successfully!`,
        'Export Ready'
      );
      if (res?.reportUrl) {
        window.open(res.reportUrl, '_blank');
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to export analytics report.',
        'Export Error'
      );
    }
  };

  const handleTakeAction = (item: AIAttritionRiskItem) => {
    toast.info(
      `Initiated retention workflow for ${item.employeeName}. Recommended: ${item.recommendedAction}`,
      'Action Triggered'
    );
  };

  const departmentOptions = (departmentsData || []).map((d) => ({
    id: d.departmentId,
    name: d.departmentName,
  }));

  const isGlobalLoading =
    isSummaryLoading || isTrendsLoading || isDepartmentsLoading || isAttritionLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
            Workforce Analytics & Intelligence Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Executive workforce KPIs, headcount trajectories, department budget consumption, and predictive attrition AI.
          </p>
        </div>
      </div>

      {/* Filter and Period Selection Bar */}
      <AnalyticsFilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        departments={departmentOptions}
        onExport={handleExport}
        isExporting={isExporting}
        onRefresh={handleRefreshAll}
        isRefreshing={isSummaryFetching}
      />

      {/* Primary KPI Grid */}
      <AnalyticsKpiGrid
        summary={summaryData}
        isLoading={isSummaryLoading}
      />

      {/* Visual Analytics Grid: Growth Trends + Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WorkforceGrowthChart
            trends={trendsData || []}
            isLoading={isTrendsLoading}
          />
        </div>

        <div className="lg:col-span-5">
          <DepartmentDistributionChart
            departments={departmentsData || []}
            isLoading={isDepartmentsLoading}
          />
        </div>
      </div>

      {/* Predictive AI Attrition Risk Section */}
      <AttritionRiskTable
        items={attritionData || []}
        isLoading={isAttritionLoading}
        onTakeAction={handleTakeAction}
      />
    </div>
  );
};

export default AnalyticsCenterPage;
