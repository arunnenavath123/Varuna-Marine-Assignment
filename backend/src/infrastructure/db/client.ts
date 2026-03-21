import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/fuel_eu';

export const dbPool = new Pool({ connectionString });
