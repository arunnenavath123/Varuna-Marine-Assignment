import { Pool } from '../../domain/Pool';

export interface IPoolRepository {
  create(pool: Pool): Promise<void>;
  findById(id: string): Promise<Pool | null>;
  findAll(): Promise<Pool[]>;
}
