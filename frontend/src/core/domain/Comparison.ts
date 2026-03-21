export interface ComparisonResultItem {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  isBaseline: boolean;
}

export interface ComparisonResult {
  baseline: ComparisonResultItem;
  others: ComparisonResultItem[];
}
