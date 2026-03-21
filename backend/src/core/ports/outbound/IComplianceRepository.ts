import { ShipCompliance } from '../../domain/ShipCompliance';

export interface IComplianceRepository {
  findByRouteAndYear(routeId: string, year: number): Promise<ShipCompliance | null>;
  save(entry: ShipCompliance): Promise<void>;
  findAll(): Promise<ShipCompliance[]>;
}
