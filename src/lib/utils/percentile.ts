/**
 * Calculates a specific percentile value from an array of numbers
 * @param values - Array of numbers to calculate percentile from
 * @param percentile - The percentile to calculate (e.g., 50, 75, 90, 95, 99)
 * @returns The value at the specified percentile, or 0 if array is empty
 */
export function calculatePercentile(
  values: number[],
  percentile: number,
): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Calculates multiple percentiles (p50, p75, p90, p95, p99) from an array of numbers
 * @param values - Array of numbers to calculate percentiles from
 * @returns An object containing p50, p75, p90, p95, and p99 values
 */
export function calculatePercentiles(values: number[]): {
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
} {
  return {
    p50: calculatePercentile(values, 50),
    p75: calculatePercentile(values, 75),
    p90: calculatePercentile(values, 90),
    p95: calculatePercentile(values, 95),
    p99: calculatePercentile(values, 99),
  };
}
