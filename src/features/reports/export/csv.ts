import { unparse } from 'papaparse';

export interface CsvExportOptions {
  filename: string;
  headers: string[];
  rows: any[][];
  bom?: boolean;
  delimiter?: string;
  newline?: string;
}

const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r', '\n'];

function sanitizeCell(value: any): any {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : '';
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  const str = String(value);
  if (FORMULA_PREFIXES.some((p) => str.startsWith(p))) {
    return `'` + str;
  }
  return str;
}

export function buildCsvContent(headers: string[], rows: any[][]): string {
  const sanitizedRows = rows.map((row) => row.map(sanitizeCell));
  return unparse([headers, ...sanitizedRows], {
    header: false,
    skipEmptyLines: false,
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ',',
    newline: '\r\n',
  });
}

export function downloadCsv(options: CsvExportOptions): void {
  const { filename, headers, rows, bom = true, delimiter = ',', newline = '\r\n' } = options;
  const content = buildCsvContent(headers, rows);
  const blob = new Blob([bom ? '\uFEFF' : '', content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function slugifyFilters(filters: Record<string, any>): string {
  return Object.entries(filters)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}-${String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`)
    .join('_')
    .slice(0, 100);
}

export function generateCsvFilename(reportId: string, filters: Record<string, any>): string {
  const date = new Date().toISOString().split('T')[0];
  const slug = slugifyFilters(filters);
  return `ofc360_${reportId}_${date}${slug ? `_${slug}` : ''}.csv`;
}