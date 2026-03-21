-- fuel-eu maritime schema

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY,
  route_id TEXT UNIQUE NOT NULL,
  vessel_type TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  year INT NOT NULL,
  ghg_intensity NUMERIC NOT NULL,
  fuel_consumption NUMERIC NOT NULL,
  distance NUMERIC NOT NULL,
  total_emissions NUMERIC NOT NULL,
  is_baseline BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ship_compliance (
  id UUID PRIMARY KEY,
  route_id TEXT NOT NULL REFERENCES routes(route_id),
  year INT NOT NULL,
  cb_gco2eq NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank_entries (
  id UUID PRIMARY KEY,
  route_id TEXT NOT NULL REFERENCES routes(route_id),
  year INT NOT NULL,
  cb_before NUMERIC NOT NULL,
  cb_after NUMERIC NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('bank', 'apply')),
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pools (
  id UUID PRIMARY KEY,
  year INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pool_members (
  pool_id UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  route_id TEXT NOT NULL REFERENCES routes(route_id),
  cb_before NUMERIC NOT NULL,
  cb_after NUMERIC NOT NULL,
  PRIMARY KEY (pool_id, route_id)
);
