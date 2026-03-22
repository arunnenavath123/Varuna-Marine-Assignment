import { IPoolRepository } from '../ports/outbound/IPoolRepository';
import { Pool, PoolMember } from '../domain/Pool';
import { ValidationError } from '../../shared/errors';
import { randomUUID } from 'crypto';

export interface PoolMemberInput {
  routeId: string;
  cbBefore: number;
}

function allocate(members: PoolMemberInput[]): PoolMember[] {
  const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
  const result: PoolMember[] = sorted.map((m) => ({ routeId: m.routeId, cbBefore: m.cbBefore, cbAfter: m.cbBefore }));

  for (let i = 0; i < result.length - 1; i++) {
    for (let j = result.length - 1; j > i; j--) {
      if (result[i].cbAfter > 0 && result[j].cbAfter < 0) {
        const transfer = Math.min(result[i].cbAfter, -result[j].cbAfter);
        result[i].cbAfter -= transfer;
        result[j].cbAfter += transfer;
      }
    }
  }

  return result;
}

export class CreatePoolUseCase {
  constructor(private readonly poolRepo: IPoolRepository) {}

  async execute(year: number, memberInputs: PoolMemberInput[]): Promise<Pool> {
    if (memberInputs.length < 2) {
      throw new ValidationError('Pool must contain at least 2 members');
    }

    const allocations = allocate(memberInputs);

    // validation rules
    const totalAfter = allocations.reduce((sum, m) => sum + m.cbAfter, 0);
    if (totalAfter < 0) {
      throw new ValidationError('Total pool adjusted CB must be non-negative');
    }

    for (const idx of allocations) {
      const before = memberInputs.find((m) => m.routeId === idx.routeId)?.cbBefore ?? 0;
      if (before < 0 && idx.cbAfter < before) {
        throw new ValidationError("Deficit member can't get worse");
      }
      if (before > 0 && idx.cbAfter < 0) {
        throw new ValidationError('Surplus member cannot exit negative');
      }
    }

    const pool: Pool = {
      id: randomUUID(),
      year,
      createdAt: new Date().toISOString(),
      members: allocations,
    };

    await this.poolRepo.create(pool);
    return pool;
  }
}
