import axios from 'axios';
import type { IRouteService } from '../../core/ports/IRouteService';
import type { Route } from '../../core/domain/Route';
import type { ComparisonResult } from '../../core/domain/Comparison';

export class RouteApiService implements IRouteService {
  private readonly base = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  async getAllRoutes(): Promise<Route[]> {
    const { data } = await axios.get(`${this.base}/routes`);
    return data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await axios.post(`${this.base}/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<ComparisonResult> {
    const { data } = await axios.get(`${this.base}/routes/comparison`);
    return data;
  }
}
