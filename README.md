# FuelEU Maritime Compliance Platform

![Application Demo](demo.webp)

FuelEU Maritime is implemented with a hexagonal architecture split into `backend/` and `frontend/`.

## Architecture

- **backend/**
  - `src/core/domain`: entities and pure business logic (Compliance calculation, Pooling rules)
  - `src/core/application`: use cases (GetAdjustedCB, CreatePool, BankSurplus)
  - `src/core/ports`: interfaces for outbound adapters
  - `src/adapters/inbound/http`: Express handlers routing standard HTTP interactions to domains
  - `src/adapters/outbound/postgres`: PG repository implementations
  - `src/infrastructure/db`: migration/seed SQL and DB client
  - `src/infrastructure/server`: composition root + Express app dependency injection
- **frontend/**
  - `src/core/domain`: DTO interfaces (`ComparisonResult`, `ShipCompliance`)
  - `src/core/application`: React-agnostic application use cases connecting services
  - `src/core/ports`: definitions for frontend services
  - `src/adapters/ui`: React components using modern Tailwind styling (Routes, Compare, Banking, Pooling Tabs)
  - `src/adapters/infrastructure`: Axios API client implementing Ports.

## Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set your Neon Postgres URL:
   - `DATABASE_URL="postgresql://username:password@your-neon-host:5432/fuel_eu"`
   - `PORT=4000`
4. Run migrations manually (execute `src/infrastructure/db/migrations/001_create_schema.sql` in your database)
5. `npm run build`
6. `npm run dev`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. Ensure the backend is running on `http://localhost:4000` (which is standard Vite env).
4. `npm run dev` to start dev server.
5. `npm run build` generates a production build.

## API Examples

- GET `/routes` -> list of shipping routes
- POST `/routes/:id/baseline` -> update baseline reference parameter
- GET `/routes/comparison` -> comparison stats
- GET `/compliance/cb?year=2024` -> compute or fetch Compliance Balances
- GET `/compliance/adjusted-cb?year=2024` -> calculate Adjusted Balance
- POST `/banking/bank` -> bank CB surpluses
- POST `/banking/apply` -> apply bank to cover deficit
- POST `/pools` -> Create multi-ship pools if overall sum >= 0 

## Running tests

- Backend: `cd backend && npm test`
- Frontend typing checks: `cd frontend && npm run lint`
