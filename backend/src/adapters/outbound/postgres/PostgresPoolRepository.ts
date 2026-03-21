import { Pool } from 'pg';
import { IPoolRepository } from '../../../core/ports/outbound/IPoolRepository';
import { Pool as PoolEntity, PoolMember } from '../../../core/domain/Pool';

function mapPoolMembers(rows: any[]): PoolMember[] {
  return rows.map((row) => ({
    routeId: row.route_id,
    cbBefore: parseFloat(row.cb_before),
    cbAfter: parseFloat(row.cb_after),
  }));
}

export class PostgresPoolRepository implements IPoolRepository {
  constructor(private readonly db: Pool) {}

  async create(pool: PoolEntity): Promise<void> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO pools (id, year, created_at) VALUES ($1,$2,$3)', [pool.id, pool.year, pool.createdAt]);
      for (const member of pool.members) {
        await client.query(
          'INSERT INTO pool_members (pool_id, route_id, cb_before, cb_after) VALUES ($1,$2,$3,$4)',
          [pool.id, member.routeId, member.cbBefore, member.cbAfter],
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<PoolEntity | null> {
    const poolRes = await this.db.query('SELECT * FROM pools WHERE id = $1', [id]);
    if (!poolRes.rows.length) return null;

    const membersRes = await this.db.query('SELECT * FROM pool_members WHERE pool_id = $1', [id]);
    return {
      id: poolRes.rows[0].id,
      year: parseInt(poolRes.rows[0].year, 10),
      createdAt: poolRes.rows[0].created_at,
      members: mapPoolMembers(membersRes.rows),
    };
  }

  async findAll(): Promise<PoolEntity[]> {
    const poolsRes = await this.db.query('SELECT * FROM pools ORDER BY created_at DESC');
    const results: PoolEntity[] = [];
    for (const row of poolsRes.rows) {
      const membersRes = await this.db.query('SELECT * FROM pool_members WHERE pool_id = $1', [row.id]);
      results.push({
        id: row.id,
        year: parseInt(row.year, 10),
        createdAt: row.created_at,
        members: mapPoolMembers(membersRes.rows),
      });
    }
    return results;
  }
}
