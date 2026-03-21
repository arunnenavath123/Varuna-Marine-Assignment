import { Pool } from 'pg';
import { IComplianceRepository } from '../../../core/ports/outbound/IComplianceRepository';
import { ShipCompliance } from '../../../core/domain/ShipCompliance';

function mapRowToShipCompliance(row: any): ShipCompliance {
  return {
    id: row.id,
    routeId: row.route_id,
    year: parseInt(row.year, 10),
    cbGco2eq: parseFloat(row.cb_gco2eq),
    createdAt: row.created_at,
  };
}

export class PostgresComplianceRepository implements IComplianceRepository {
  constructor(private readonly db: Pool) {}

  async findByRouteAndYear(routeId: string, year: number): Promise<ShipCompliance | null> {
    const { rows } = await this.db.query('SELECT * FROM ship_compliance WHERE route_id = $1 AND year = $2 ORDER BY created_at DESC LIMIT 1', [routeId, year]);
    if (!rows.length) return null;
    return mapRowToShipCompliance(rows[0]);
  }

  async save(entry: ShipCompliance): Promise<void> {
    await this.db.query(
      'INSERT INTO ship_compliance (id, route_id, year, cb_gco2eq, created_at) VALUES ($1,$2,$3,$4,$5)',
      [entry.id, entry.routeId, entry.year, entry.cbGco2eq, entry.createdAt],
    );
  }

  async findAll(): Promise<ShipCompliance[]> {
    const { rows } = await this.db.query('SELECT * FROM ship_compliance');
    return rows.map(mapRowToShipCompliance);
  }
}
