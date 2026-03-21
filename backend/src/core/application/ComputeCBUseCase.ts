import { IRouteRepository } from '../ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../ports/outbound/IComplianceRepository';
import { NotFoundError } from '../../shared/errors';
import { computeComplianceBalance } from '../domain/ComplianceCalculator';
import { ShipCompliance } from '../domain/ShipCompliance';

export class ComputeCBUseCase {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly complianceRepo: IComplianceRepository,
  ) {}

  async execute(routeId: string, year: number): Promise<ShipCompliance> {
    const route = await this.routeRepo.findById(routeId);
    if (!route) {
      throw new NotFoundError(`Route ${routeId} not found`);
    }
    const cb = computeComplianceBalance(route.ghgIntensity, route.fuelConsumption);
    const snapshot: ShipCompliance = {
      id: `${routeId}-${year}-${Date.now()}`,
      routeId,
      year,
      cbGco2eq: cb,
      createdAt: new Date().toISOString(),
    };
    await this.complianceRepo.save(snapshot);
    return snapshot;
  }
}
