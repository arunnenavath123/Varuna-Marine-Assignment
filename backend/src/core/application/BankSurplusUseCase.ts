import { IBankRepository } from '../ports/outbound/IBankRepository';
 import { IRouteRepository } from '../ports/outbound/IRouteRepository';
 import { BankEntry } from '../domain/BankEntry';
 import { NotFoundError, ValidationError } from '../../shared/errors';
 import { randomUUID } from 'crypto';
 
 export class BankSurplusUseCase {
   constructor(
     private readonly bankRepo: IBankRepository,
     private readonly routeRepo: IRouteRepository,
   ) {}
 
   async execute(routeId: string, year: number, amount: number): Promise<BankEntry> {
     if (amount <= 0) {
       throw new ValidationError('Bank amount must be positive');
     }
 
     const route = await this.routeRepo.findById(routeId);
     if (!route) {
       throw new NotFoundError(`Route ${routeId} not found`);
     }
 
     const currentBalance = await this.bankRepo.getBalance(routeId, year);
     const nextBalance = currentBalance + amount;
 
     const entry: BankEntry = {
       id: randomUUID(),
      routeId,
      year,
      cbBefore: currentBalance,
      cbAfter: nextBalance,
      action: 'bank',
      amount,
      createdAt: new Date().toISOString(),
    };
    await this.bankRepo.saveBankEntry(entry);
    return entry;
  }
}
