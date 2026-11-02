export * from './types';

export const REPORT_REGISTRY: ReportRegistry = createRegistry([]);

export function registerReport(report: ReportDefinition): void {
  if (!REPORT_REGISTRY.reports.some((r) => r.id === report.id)) {
    REPORT_REGISTRY.reports.push(report);
  }
}

export function getReportById(id: string): ReportDefinition | undefined {
  return REPORT_REGISTRY.getById(id);
}

export function getReportsByRole(role: ReportRole): ReportDefinition[] {
  return REPORT_REGISTRY.getByRole(role);
}

export function getReportsByCategory(category: ReportCategory): ReportDefinition[] {
  return REPORT_REGISTRY.getByCategory(category);
}