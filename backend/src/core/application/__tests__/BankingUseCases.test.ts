import { BankSurplusUseCase } from '../BankSurplusUseCase';
import { ApplyBankedUseCase } from '../ApplyBankedUseCase';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';

class InMemoryBankRepo implements IBankRepository {
  balances = new Map<string, number>();
  entries: any[] = [];

  async getBalance(routeId: string, year: number): Promise<number> {
    return this.balances.get(`${routeId}-${year}`) ?? 0;
  }

  async saveBankEntry(entry: any): Promise<void> {
    this.entries.push(entry);
    this.balances.set(`${entry.routeId}-${entry.year}`, entry.cbAfter);
  }

  async findEntries(routeId: string, year: number) {
    return this.entries.filter((e) => e.routeId === routeId && e.year === year);
  }
}

class SimpleRouteRepo implements IRouteRepository {
  constructor(private readonly routes: Record<string, any>) {}

  async findAll() {
    return Object.values(this.routes);
  }

  async findById(id: string) {
    return this.routes[id] || null;
  }

  async setBaseline(id: string): Promise<void> {}
  async findBaseline(): Promise<any> { return null; }
}

describe('Banking use cases', () => {
  let bankRepo: InMemoryBankRepo;
  let routeRepo: SimpleRouteRepo;
  let bankUseCase: BankSurplusUseCase;
  let applyUseCase: ApplyBankedUseCase;

  beforeEach(() => {
    bankRepo = new InMemoryBankRepo();
    routeRepo = new SimpleRouteRepo({ R001: { routeId: 'R001' } });
    bankUseCase = new BankSurplusUseCase(bankRepo, routeRepo);
    applyUseCase = new ApplyBankedUseCase(bankRepo);
  });

  test('Banks surplus correctly', async () => {
    const entry = await bankUseCase.execute('R001', 2025, 100);
    expect(entry.cbAfter).toBe(100);
  });

  test('Cannot apply more than balance', async () => {
    await bankUseCase.execute('R001', 2025, 50);
    await expect(applyUseCase.execute('R001', 2025, 100)).rejects.toThrow('Insufficient banked surplus');
  });

  test('Apply decreases available balance', async () => {
    await bankUseCase.execute('R001', 2025, 200);
    const applied = await applyUseCase.execute('R001', 2025, 80);
    expect(applied.cbAfter).toBe(120);
  });
});
