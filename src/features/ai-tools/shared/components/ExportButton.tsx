import React from 'react';
import Papa from 'papaparse';
import { Download } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';

interface ExportButtonProps {
  filename: string;
  data: Record<string, any>[];
  headers?: string[];
  disabled?: boolean;
  className?: string;
  label?: string;
}

/**
 * Formula injection guard: prefixes single quote if string cell starts with =, +, -, @
 */
export function sanitizeCellForCsv(value: any): any {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('=') || trimmed.startsWith('+') || trimmed.startsWith('-') || trimmed.startsWith('@')) {
      return `'${value}`;
    }
  }
  return value;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  filename,
  data,
  headers,
  disabled = false,
  className,
  label = 'Export CSV',
}) => {
  const toast = useToast();

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.warning('No data available to export.', 'Export Empty');
      return;
    }

    try {
      // Sanitize every row cell
      const sanitizedRows = data.map((row) => {
        const cleanRow: Record<string, any> = {};
        for (const [k, v] of Object.entries(row)) {
          cleanRow[k] = sanitizeCellForCsv(v);
        }
        return cleanRow;
      });

      const csvString = Papa.unparse(sanitizedRows, {
        columns: headers,
        header: true,
      });

      // UTF-8 BOM
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} records successfully.`, 'CSV Downloaded');
    } catch (err: any) {
      toast.error('Failed to generate CSV export.', 'Export Error');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled || data.length === 0}
      onClick={handleExport}
      className={className}
      title="Export records to secure CSV"
    >
      <Download className="w-3.5 h-3.5 mr-1.5" />
      <span>{label}</span>
    </Button>
  );
};

