export interface ShipCompliance {
  id: string;
  routeId: string;
  year: number;
  cbGco2eq: number;
  createdAt: string;
}

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

export interface AdjustedCbSnapshot {
  routeId: string;
  year: number;
  adjustedCb: number;
}

export interface PoolMember {
  routeId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  year: number;
  createdAt: string;
  members: PoolMember[];
}
