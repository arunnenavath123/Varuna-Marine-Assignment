import { IBankRepository } from '../ports/outbound/IBankRepository';
import { BankEntry } from '../domain/BankEntry';
import { NotFoundError, ValidationError } from '../../shared/errors';

export class ApplyBankedUseCase {
  constructor(private readonly bankRepo: IBankRepository) {}

  async execute(routeId: string, year: number, amount: number): Promise<BankEntry> {
    if (amount <= 0) {
      throw new ValidationError('Apply amount must be positive');
    }
    const currentBalance = await this.bankRepo.getBalance(routeId, year);
    if (currentBalance < amount) {
      throw new ValidationError('Insufficient banked surplus to apply');
    }

    const nextBalance = currentBalance - amount;
    const entry: BankEntry = {
      id: `${routeId}-${year}-apply-${Date.now()}`,
      routeId,
      year,
      cbBefore: currentBalance,
      cbAfter: nextBalance,
      action: 'apply',
      amount,
      createdAt: new Date().toISOString(),
    };
    await this.bankRepo.saveBankEntry(entry);
    return entry;
  }
}
