import { CreatePoolUseCase, PoolMemberInput } from '../CreatePoolUseCase';
import { IPoolRepository } from '../../ports/outbound/IPoolRepository';

class InMemoryPoolRepo implements IPoolRepository {
  pools = new Map<string, any>();

  async create(pool: any): Promise<void> {
    this.pools.set(pool.id, pool);
  }

  async findById(id: string) {
    return this.pools.get(id) || null;
  }

  async findAll() {
    return Array.from(this.pools.values());
  }
}

describe('CreatePoolUseCase', () => {
  let repo: InMemoryPoolRepo;
  let useCase: CreatePoolUseCase;

  beforeEach(() => {
    repo = new InMemoryPoolRepo();
    useCase = new CreatePoolUseCase(repo);
  });

  test('creates a pool with valid members and non-negative total', async () => {
    const members: PoolMemberInput[] = [
      { routeId: 'R001', cbBefore: 100 },
      { routeId: 'R002', cbBefore: -25 },
      { routeId: 'R003', cbBefore: -50 },
    ];
    const pool = await useCase.execute(2025, members);
    expect(pool).toBeDefined();
    expect(pool.members.length).toBe(3);
    expect(pool.members.reduce((sum, m) => sum + m.cbAfter, 0)).toBeGreaterThanOrEqual(0);
  });

  test('throws ValidationError when total after becomes negative', async () => {
    const members: PoolMemberInput[] = [
      { routeId: 'R001', cbBefore: 10 },
      { routeId: 'R002', cbBefore: -50 },
    ];
    await expect(useCase.execute(2025, members)).rejects.toThrow('Total pool adjusted CB must be non-negative');
  });

  test('throws ValidationError when have single member', async () => {
    const members: PoolMemberInput[] = [{ routeId: 'R001', cbBefore: 100 }];
    await expect(useCase.execute(2025, members)).rejects.toThrow('Pool must contain at least 2 members');
  });
});
