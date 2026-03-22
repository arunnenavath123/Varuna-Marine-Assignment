import axios from 'axios';
import type { IComplianceService } from '../../core/ports/IComplianceService';
import type { ShipCompliance, BankEntry, AdjustedCbSnapshot, Pool } from '../../core/domain/ComplianceTypes';

export class ComplianceApiService implements IComplianceService {
  private readonly base = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  async getAllCb(year: number): Promise<ShipCompliance[]> {
    const { data } = await axios.get(`${this.base}/compliance/cb?year=${year}`);
    return data;
  }

  async getAllAdjustedCb(year: number): Promise<AdjustedCbSnapshot[]> {
    const { data } = await axios.get(`${this.base}/compliance/adjusted-cb?year=${year}`);
    return data;
  }

  async computeCb(shipId: string, year: number): Promise<ShipCompliance> {
    const { data } = await axios.get(`${this.base}/compliance/cb?shipId=${shipId}&year=${year}`);
    return data;
  }

  async getBankingRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const { data } = await axios.get(`${this.base}/banking/records?shipId=${shipId}&year=${year}`);
    return data;
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const { data } = await axios.post(`${this.base}/banking/bank`, { shipId, year, amount });
    return data;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const { data } = await axios.post(`${this.base}/banking/apply`, { shipId, year, amount });
    return data;
  }

  async createPool(year: number, members: { routeId: string; cbBefore: number; }[]): Promise<Pool> {
    const { data } = await axios.post(`${this.base}/pools`, { year, members });
    return data;
  }
}
