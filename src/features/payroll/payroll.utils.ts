export const formatCurrency = (value: number, currency = 'INR'): string => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  }
};

export const formatPayrollMonth = (month: number, year: number): string => {
  const date = new Date(Date.UTC(year, month - 1, 1));
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

export const formatPayrollDate = (value?: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getCurrentFinancialYear = (): string => {
  const now = new Date();
  const startYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${startYear}-${String(startYear + 1).slice(-2)}`;
};

export const getPayrollErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object' || !('data' in error)) return fallback;
  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== 'object') return fallback;

  if ('message' in data && typeof data.message === 'string') return data.message;
  if ('detail' in data && typeof data.detail === 'string') return data.detail;
  return fallback;
};
