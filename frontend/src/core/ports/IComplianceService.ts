import type { ShipCompliance, BankEntry, AdjustedCbSnapshot, Pool } from '../domain/ComplianceTypes';

export interface IComplianceService {
  // Compliance
  getAllCb(year: number): Promise<ShipCompliance[]>;
  getAllAdjustedCb(year: number): Promise<AdjustedCbSnapshot[]>;
  computeCb(shipId: string, year: number): Promise<ShipCompliance>;
  
  // Banking
  getBankingRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankEntry>;
  
  // Pooling
  createPool(year: number, members: { routeId: string, cbBefore: number }[]): Promise<Pool>;
}
