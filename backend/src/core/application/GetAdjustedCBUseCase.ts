import { IPoolRepository } from '../ports/outbound/IPoolRepository';
import { NotFoundError } from '../../shared/errors';

export class GetAdjustedCBUseCase {
  constructor(private readonly poolRepo: IPoolRepository) {}

  async execute(poolId: string) {
    const pool = await this.poolRepo.findById(poolId);
    if (!pool) {
      throw new NotFoundError(`Pool ${poolId} not found`);
    }
    return pool;
  }
}
