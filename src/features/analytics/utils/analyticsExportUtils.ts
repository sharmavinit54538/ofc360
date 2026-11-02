/**
 * @file analyticsExportUtils.ts
 * @description Client-side CSV export generator and print/PDF trigger for OFC360 Analytics Hub.
 */

import Papa from 'papaparse';

/**
 * Sanitizes cell values to prevent CSV injection vulnerabilities.
 */
function sanitizeCell(val: any): string | number {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') return val;
  const str = String(val).trim();
  // Strip formula injection characters if at start
  if (['=', '+', '-', '@'].includes(str.charAt(0))) {
    return `'${str}`;
  }
  return str;
}

/**
 * Exports arbitrary array of records to a standard UTF-8 CSV file and triggers download.
 */
export function exportToCsv(filename: string, rows: Record<string, any>[]): boolean {
  if (!rows || rows.length === 0) return false;

  try {
    const cleanRows = rows.map((row) => {
      const sanitized: Record<string, any> = {};
      for (const [k, v] of Object.entries(row)) {
        sanitized[k] = sanitizeCell(v);
      }
      return sanitized;
    });

    const csvContent = Papa.unparse(cleanRows, { header: true });
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const cleanFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to export CSV:', err);
    return false;
  }
}

/**
 * Initiates the browser print dialog formatted for enterprise PDF generation.
 */
export function triggerPrintReport(): void {
  window.print();
}

/**
 * Currency formatter for Indian Rupees.
 */
export function formatInr(val: number): string {
  if (isNaN(val)) return '₹0';
  if (Math.abs(val) >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

