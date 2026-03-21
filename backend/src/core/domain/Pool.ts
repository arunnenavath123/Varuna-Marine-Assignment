export interface Pool {
  id: string;
  year: number;
  createdAt: string;
  members: PoolMember[];
}

export interface PoolMember {
  routeId: string;
  cbBefore: number;
  cbAfter: number;
}
