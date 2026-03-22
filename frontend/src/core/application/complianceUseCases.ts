import type { IComplianceService } from '../ports/IComplianceService';

export function createComplianceUseCases(service: IComplianceService) {
  return {
    fetchAllCb: (year: number) => service.getAllCb(year),
    fetchAllAdjustedCb: (year: number) => service.getAllAdjustedCb(year),
    computeCb: (shipId: string, year: number) => service.computeCb(shipId, year),
    fetchBankingRecords: (shipId: string, year: number) => service.getBankingRecords(shipId, year),
    bankSurplus: (shipId: string, year: number, amount: number) => service.bankSurplus(shipId, year, amount),
    applyBanked: (shipId: string, year: number, amount: number) => service.applyBanked(shipId, year, amount),
    createPool: (year: number, members: { routeId: string, cbBefore: number }[]) => service.createPool(year, members),
  };
}
