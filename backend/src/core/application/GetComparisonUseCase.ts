import { IRouteRepository } from '../ports/outbound/IRouteRepository';
import { computePercentDiff } from '../domain/ComplianceCalculator';
import { NotFoundError } from '../../shared/errors';

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

export class GetComparisonUseCase {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async execute(): Promise<ComparisonResult> {
    const routes = await this.routeRepo.findAll();
    const baseline = routes.find((r) => r.isBaseline);
    if (!baseline) {
      throw new NotFoundError('Baseline route not found');
    }
    const others = routes
      .filter((r) => !r.isBaseline)
      .map((route) => ({
        routeId: route.routeId,
        ghgIntensity: route.ghgIntensity,
        percentDiff: computePercentDiff(baseline.ghgIntensity, route.ghgIntensity),
        isBaseline: false,
      }));
    return {
      baseline: {
        routeId: baseline.routeId,
        ghgIntensity: baseline.ghgIntensity,
        percentDiff: 0,
        isBaseline: true,
      },
      others,
    };
  }
}
