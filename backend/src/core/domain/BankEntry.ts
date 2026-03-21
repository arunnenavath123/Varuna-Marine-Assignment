export interface BankEntry {
  id: string;
  routeId: string;
  year: number;
  cbBefore: number;
  cbAfter: number;
  action: 'bank' | 'apply';
  amount: number;
  createdAt: string;
}
