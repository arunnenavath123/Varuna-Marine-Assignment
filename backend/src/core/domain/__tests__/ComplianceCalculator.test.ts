import { computeComplianceBalance, isCompliant, computePercentDiff, TARGET_INTENSITY_2025, ENERGY_CONVERSION } from '../ComplianceCalculator';

describe('ComplianceCalculator', () => {
  test('computeComplianceBalance should calculate correct positive surplus', () => {
    const ghgIntensity = 80.0;
    const fuelConsumption = 100;
    const energy = fuelConsumption * ENERGY_CONVERSION;
    const expected = (TARGET_INTENSITY_2025 - ghgIntensity) * energy;
    expect(computeComplianceBalance(ghgIntensity, fuelConsumption)).toBeCloseTo(expected);
  });

  test('isCompliant returns true when intensity <= target', () => {
    expect(isCompliant(TARGET_INTENSITY_2025)).toBe(true);
    expect(isCompliant(80)).toBe(true);
    expect(isCompliant(90)).toBe(false);
  });

  test('computePercentDiff handles baseline zero', () => {
    expect(computePercentDiff(0, 100)).toBe(Number.POSITIVE_INFINITY);
  });

  test('computePercentDiff normal operation', () => {
    expect(computePercentDiff(100, 110)).toBeCloseTo(10);
  });
});
