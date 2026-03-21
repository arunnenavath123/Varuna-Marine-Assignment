export const TARGET_INTENSITY_2025 = 89.3368; // gCO2e/MJ
export const ENERGY_CONVERSION = 41_000; // MJ per tonne

export function computeComplianceBalance(
  ghgIntensity: number,
  fuelConsumption: number,
): number {
  const energyInScope = fuelConsumption * ENERGY_CONVERSION;
  return (TARGET_INTENSITY_2025 - ghgIntensity) * energyInScope;
}

export function isCompliant(ghgIntensity: number): boolean {
  return ghgIntensity <= TARGET_INTENSITY_2025;
}

export function computePercentDiff(baseline: number, comparison: number): number {
  if (baseline === 0) {
    return Number.POSITIVE_INFINITY;
  }
  return (comparison / baseline - 1) * 100;
}
