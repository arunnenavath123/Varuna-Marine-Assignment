import { IBankRepository } from '../ports/outbound/IBankRepository';
import { IRouteRepository } from '../ports/outbound/IRouteRepository';

export class GetAdjustedCBUseCase {
  constructor(
    private readonly bankRepo: IBankRepository,
    private readonly routeRepo: IRouteRepository,
  ) {}

  async execute(year: number, routeId?: string): Promise<any> {
    if (routeId) {
      const balance = await this.bankRepo.getBalance(routeId, year);
      return { routeId, year, adjustedCb: balance };
    }
    // Fetch all routes
    const routes = await this.routeRepo.findAll();
    const results = await Promise.all(
      routes.map(async (route) => {
        const balance = await this.bankRepo.getBalance(route.routeId, year);
        return { routeId: route.routeId, year, adjustedCb: balance };
      })
    );
    return results;
  }
}
