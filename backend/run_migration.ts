import 'dotenv/config';
import { dbPool } from './src/infrastructure/db/client';
import fs from 'fs';
import path from 'path';

async function migrate() {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'src/infrastructure/db/migrations/001_create_schema.sql'), 'utf8');
  const seedSql = fs.readFileSync(path.join(__dirname, 'src/infrastructure/db/migrations/002_seed_routes.sql'), 'utf8');
  try {
    await dbPool.query(schemaSql);
    await dbPool.query(seedSql);
    console.log('Migration and seeding successful');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await dbPool.end();
  }
}
migrate();
