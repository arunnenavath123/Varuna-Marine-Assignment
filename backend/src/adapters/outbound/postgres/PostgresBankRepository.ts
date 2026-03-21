import { Pool } from 'pg';
import { IBankRepository } from '../../../core/ports/outbound/IBankRepository';
import { BankEntry } from '../../../core/domain/BankEntry';

function mapRowToBankEntry(row: any): BankEntry {
  return {
    id: row.id,
    routeId: row.route_id,
    year: parseInt(row.year, 10),
    cbBefore: parseFloat(row.cb_before),
    cbAfter: parseFloat(row.cb_after),
    action: row.action,
    amount: parseFloat(row.amount),
    createdAt: row.created_at,
  };
}

export class PostgresBankRepository implements IBankRepository {
  constructor(private readonly db: Pool) {}

  async getBalance(routeId: string, year: number): Promise<number> {
    const { rows } = await this.db.query(
      'SELECT cb_after FROM bank_entries WHERE route_id = $1 AND year = $2 ORDER BY created_at DESC LIMIT 1',
      [routeId, year],
    );
    if (!rows.length) return 0;
    return parseFloat(rows[0].cb_after);
  }

  async saveBankEntry(entry: BankEntry): Promise<void> {
    await this.db.query(
      'INSERT INTO bank_entries (id, route_id, year, cb_before, cb_after, action, amount, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [entry.id, entry.routeId, entry.year, entry.cbBefore, entry.cbAfter, entry.action, entry.amount, entry.createdAt],
    );
  }

  async findEntries(routeId: string, year: number): Promise<BankEntry[]> {
    const { rows } = await this.db.query('SELECT * FROM bank_entries WHERE route_id = $1 AND year = $2 ORDER BY created_at ASC', [routeId, year]);
    return rows.map(mapRowToBankEntry);
  }
}
