import { Pool } from 'pg';
import { IRouteRepository } from '../../../core/ports/outbound/IRouteRepository';
import { Route } from '../../../core/domain/Route';

function mapRowToRoute(row: any): Route {
  return {
    id: row.id,
    routeId: row.route_id,
    vesselType: row.vessel_type,
    fuelType: row.fuel_type,
    year: parseInt(row.year, 10),
    ghgIntensity: parseFloat(row.ghg_intensity),
    fuelConsumption: parseFloat(row.fuel_consumption),
    distance: parseFloat(row.distance),
    totalEmissions: parseFloat(row.total_emissions),
    isBaseline: row.is_baseline,
  };
}

export class PostgresRouteRepository implements IRouteRepository {
  constructor(private readonly db: Pool) {}

  async findAll(): Promise<Route[]> {
    const { rows } = await this.db.query('SELECT * FROM routes');
    return rows.map(mapRowToRoute);
  }

  async findById(id: string): Promise<Route | null> {
    const { rows } = await this.db.query('SELECT * FROM routes WHERE route_id = $1', [id]);
    if (rows.length === 0) return null;
    return mapRowToRoute(rows[0]);
  }

  async setBaseline(id: string): Promise<void> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE routes SET is_baseline = false WHERE is_baseline = true');
      const result = await client.query('UPDATE routes SET is_baseline = true WHERE route_id = $1', [id]);
      if (result.rowCount === 0) {
        throw new Error('Route not found');
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async findBaseline(): Promise<Route | null> {
    const { rows } = await this.db.query('SELECT * FROM routes WHERE is_baseline = true LIMIT 1');
    if (rows.length === 0) return null;
    return mapRowToRoute(rows[0]);
  }
}
