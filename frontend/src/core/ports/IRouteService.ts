import { Route } from '../domain/Route';
import { ComparisonResult } from '../domain/Comparison';

export interface IRouteService {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonResult>;
}
