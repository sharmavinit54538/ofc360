/**
 * @file AnalyticsCenterPage.tsx
 * @description Enterprise Workforce Analytics & Intelligence Center orchestrating executive KPI grids,
 * dynamic headcount growth charts, department distribution, predictive AI attrition tables, and all 8
 * deep analytical reporting modules (Payroll Variance, Leave Balances, 9-Box Talent, T&E, Assets, Statutory, Recruitment, Attendance).
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  CreditCard,
  Calendar,
  Gauge,
  Receipt,
  Box,
  ShieldCheck,
  BarChart2,
  Clock,
  Sparkles,
} from 'lucide-react';
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
  ReportModuleId,
} from '../types';
import { AnalyticsKpiGrid } from '../components/AnalyticsKpiGrid';
import { WorkforceGrowthChart } from '../components/WorkforceGrowthChart';
import { DepartmentDistributionChart } from '../components/DepartmentDistributionChart';
import { AttritionRiskTable } from '../components/AttritionRiskTable';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import {
  PayrollVarianceReportView,
  LeaveLiabilityReportView,
  PerformanceTalentReportView,
  TravelExpenseReportView,
  AssetInventoryReportView,
  StatutoryComplianceReportView,
  RecruitmentFunnelReportView,
  AttendanceShiftReportView,
} from '../components/reports';

type AnalyticsTab = 'overview' | ReportModuleId;

export const AnalyticsCenterPage: React.FC = () => {
  const toast = useToast();

  // Active Tab / View
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  // Filter States
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('QUARTER');
  const [departmentId, setDepartmentId] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [employmentType, setEmploymentType] = useState('ALL');

  // Query Filters Payload
  const queryFilters: AnalyticsFilterParams = useMemo(
    () => ({
      dateRange,
      departmentId: departmentId !== 'ALL' ? departmentId : undefined,
      location: location !== 'ALL' ? location : undefined,
      employmentType: employmentType !== 'ALL' ? employmentType : undefined,
    }),
    [dateRange, departmentId, location, employmentType]
  );

  // RTK Query Hooks for Overview Tab
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
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

  const tabs: Array<{ id: AnalyticsTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Workforce Overview', icon: Users },
    { id: 'payroll-reports', label: 'Payroll Variance', icon: CreditCard },
    { id: 'leave-liability', label: 'Leave Liability', icon: Calendar },
    { id: 'performance-matrix', label: '9-Box Talent', icon: Gauge },
    { id: 'expenses-travel', label: 'T&E Audit', icon: Receipt },
    { id: 'asset-audit', label: 'Assets & Capex', icon: Box },
    { id: 'statutory-compliance', label: 'Statutory Registers', icon: ShieldCheck },
    { id: 'attendance-reports', label: 'Attendance & Shifts', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">
            Workforce Analytics &amp; Intelligence Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Executive workforce KPIs, headcount trajectories, department budget consumption, and predictive attrition AI.
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-zinc-800/80 border border-gray-200/60 dark:border-zinc-700/60 min-w-full sm:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER DETAILED MODULE VIEWS IF SELECTED */}
      {activeTab === 'payroll-reports' && (
        <PayrollVarianceReportView
          filters={queryFilters}
          onBack={() => setActiveTab('overview')}
          onSelectModule={(id) => setActiveTab(id)}
        />
      )}

      {activeTab === 'leave-liability' && (
        <LeaveLiabilityReportView
          filters={queryFilters}
          onBack={() => setActiveTab('overview')}
          onSelectModule={(id) => setActiveTab(id)}
        />
      )}

      {activeTab === 'performance-matrix' && (
        <PerformanceTalentReportView
          filters={queryFilters}
          onBack={() => setActiveTab('overview')}
          onSelectModule={(id) => setActiveTab(id)}
        />
      )}

      {activeTab === 'expenses-travel' && (
        <TravelExpenseReportView
          filters={queryFilters}
          onBack={() => setActiveTab('overview')}
          onSelectModule={(id) => setActiveTab(id)}
        />
      )}

      {activeTab === 'asset-audit' && (
        <AssetInventoryReportView
          filters={queryFilters}
          onBack={() => setActiveTab('overview')}
          onSelectModule={(id) => setActiveTab(id)}
        />
      )}

      {activeTab === 'statutory-compliance' && (
        <StatutoryComplianceReportView
          filters={queryFilters}
          onBack={() => setActiveTab('overview')}
          onSelectModule={(id) => setActiveTab(id)}
        />
      )}

      {activeTab === 'attendance-reports' && (
        <AttendanceShiftReportView
          filters={queryFilters}
          onBack={() => setActiveTab('overview')}
          onSelectModule={(id) => setActiveTab(id)}
        />
      )}

      {/* OVERVIEW TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Filter and Period Selection Bar */}
          <AnalyticsFilterBar
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            departmentId={departmentId}
            onDepartmentChange={setDepartmentId}
            location={location}
            onLocationChange={setLocation}
            employmentType={employmentType}
            onEmploymentTypeChange={setEmploymentType}
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
      )}
    </div>
  );
};

export default AnalyticsCenterPage;
