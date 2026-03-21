import { IRouteRepository } from '../ports/outbound/IRouteRepository';
import { NotFoundError } from '../../shared/errors';

export class SetBaselineUseCase {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async execute(routeId: string): Promise<void> {
    const route = await this.routeRepo.findById(routeId);
    if (!route) {
      throw new NotFoundError(`Route ${routeId} not found`);
    }
    await this.routeRepo.setBaseline(routeId);
  }
}
