import { BankEntry } from '../../domain/BankEntry';

export interface IBankRepository {
  getBalance(routeId: string, year: number): Promise<number>;
  saveBankEntry(entry: BankEntry): Promise<void>;
  findEntries(routeId: string, year: number): Promise<BankEntry[]>;
}
