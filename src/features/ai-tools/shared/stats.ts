/**
 * @file stats.ts
 * @description Robust statistical functions for AI Hub deterministic rule engines:
 * Median, MAD (Median Absolute Deviation), Robust Z-Score, Top-N ranking, and Shares.
 */

/**
 * Calculates the median of a numerical array.
 */
export function median(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculates Median Absolute Deviation (MAD): median(|x_i - median(x)|).
 */
export function mad(values: number[], med?: number): number {
  if (!values || values.length === 0) return 0;
  const m = med !== undefined ? med : median(values);
  const deviations = values.map((v) => Math.abs(v - m));
  return median(deviations);
}

/**
 * Calculates the Robust Z-Score using MAD:
 * z = (x - median) / (1.4826 * MAD)
 * If MAD is zero, falls back to 0 (or standard deviation if non-zero variance exists).
 */
export function robustZ(value: number, med: number, madVal: number): number {
  if (madVal === 0 || isNaN(madVal)) {
    return 0;
  }
  const scale = 1.4826 * madVal;
  return (value - med) / scale;
}

/**
 * Returns the top N items sorted in descending order by score function.
 */
export function topN<T>(items: T[], scoreFn: (item: T) => number, n: number): T[] {
  if (!items || items.length === 0 || n <= 0) return [];
  return [...items].sort((a, b) => scoreFn(b) - scoreFn(a)).slice(0, n);
}

/**
 * Calculates percentage share (0 - 100), safe against division by zero.
 */
export function share(part: number, total: number): number {
  if (total <= 0 || isNaN(total) || isNaN(part)) return 0;
  const result = (part / total) * 100;
  return Math.round(result * 100) / 100;
}

/**
 * Calculates Month-over-Month (MoM) or Run-over-Run delta and percentage.
 */
export function momDelta(current: number, previous: number): { diff: number; pct: number } {
  const diff = current - previous;
  if (previous === 0) {
    return { diff, pct: current === 0 ? 0 : 100 };
  }
  const pct = Math.round(((current - previous) / Math.abs(previous)) * 10000) / 100;
  return { diff, pct };
}

