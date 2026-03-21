# FuelEU Maritime

FuelEU Maritime is implemented with a hexagonal architecture split into `backend/` and `frontend/`.

## Architecture

- backend/
  - src/core/domain: entities and pure business logic
  - src/core/application: use cases
  - src/core/ports: interfaces for adapters
  - src/adapters/inbound/http: Express handlers
  - src/adapters/outbound/postgres: PG repository implementations
  - src/infrastructure/db: migration/seed SQL and DB client
  - src/infrastructure/server: composition root + Express app
- frontend/
  - src/core/domain: DTO interfaces
  - src/core/application: use-case functions
  - src/core/ports: service interfaces
  - src/adapters/ui: React components
  - src/adapters/infrastructure: Axios API client

## Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set your Neon Postgres URL:
   - `DATABASE_URL="postgresql://username:password@your-neon-host:5432/fuel_eu"`
   - `PORT=4000`
4. Run migrations manually (execute `src/infrastructure/db/migrations/*.sql` in your database)
5. `npm run build`
6. `npm run dev`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API Examples

- GET /routes
- POST /routes/:id/baseline
- GET /routes/comparison
- POST /compliance/:routeId/:year/compute
- GET /banking/:routeId/:year/balance
- POST /banking/:routeId/:year/bank `{ "amount": 50 }`
- POST /banking/:routeId/:year/apply `{ "amount": 20 }`
- POST /pools `{ "year": 2025, "members": [{ "routeId": "R001", "cbBefore": 100 }, ...] }`

## Running tests

- Backend: `cd backend && npm test`
