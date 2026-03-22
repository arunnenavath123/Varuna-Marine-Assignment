import type { IRouteService } from '../ports/IRouteService';

export const createRouteUseCases = (routeService: IRouteService) => ({
  fetchRoutes: async () => await routeService.getAllRoutes(),
  setBaseline: async (routeId: string) => await routeService.setBaseline(routeId),
  fetchComparison: async () => await routeService.getComparison(),
});
