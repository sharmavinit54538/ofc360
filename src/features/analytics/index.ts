/**
 * @file index.ts
 * @description Central barrel export for the Analytics Center module.
 */

export * from './types';
export * from './api/analyticsApi';
export * from './api/analyticsMockData';
export * from './utils/analyticsExportUtils';
export * from './components/AnalyticsEmptyState';
export * from './components/AnalyticsFilterBar';
export * from './components/AnalyticsKpiGrid';
export * from './components/WorkforceGrowthChart';
export * from './components/DepartmentDistributionChart';
export * from './components/AttritionRiskTable';
export * from './components/reports';
export * from './pages/AnalyticsCenterPage';
export * from './pages/ReportsAnalyticsHubPage';
