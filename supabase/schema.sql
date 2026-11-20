-- MedWay Production PostgreSQL Schema
-- Matches ADR-002, ADR-003, and Spec 0002: Data Model and Persistence

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enum Types
DO $$ BEGIN
  CREATE TYPE queue_level AS ENUM ('low', 'moderate', 'high');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE care_category AS ENUM (
    'Antimalarials (ACT)',
    'Analgesics & Fever',
    'Typhoid / Lab Test',
    'ORS & Hydration'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  facility_type VARCHAR(64) NOT NULL,
  is_campus_clinic BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  distance_meters INTEGER NOT NULL,
  current_queue queue_level NOT NULL DEFAULT 'moderate',
  price_label VARCHAR(64) NOT NULL,
  tiship_covered BOOLEAN NOT NULL DEFAULT FALSE,
  last_queue_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Category Stock Table
CREATE TABLE IF NOT EXISTS facility_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  category care_category NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(facility_id, category)
);

-- 4. Digital Intake Passes
CREATE TABLE IF NOT EXISTS intake_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_code VARCHAR(32) UNIQUE NOT NULL, -- Format: MW-UNN-XXX
  facility_id UUID NOT NULL REFERENCES facilities(id),
  category care_category NOT NULL,
  allergies_declared TEXT NOT NULL DEFAULT 'None',
  tiship_applied BOOLEAN NOT NULL DEFAULT FALSE,
  red_flags_cleared BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Crowd Telemetry Tokens / Reports
CREATE TABLE IF NOT EXISTS crowd_telemetry_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_code VARCHAR(64) UNIQUE NOT NULL,
  pass_id UUID REFERENCES intake_passes(id) ON DELETE SET NULL,
  facility_id UUID NOT NULL REFERENCES facilities(id),
  reported_queue queue_level NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes for High-Traffic Queries
CREATE INDEX IF NOT EXISTS idx_facilities_slug ON facilities(slug);
CREATE INDEX IF NOT EXISTS idx_facility_stock_lookup ON facility_stock(facility_id, category);
CREATE INDEX IF NOT EXISTS idx_intake_passes_code ON intake_passes(pass_code);
CREATE INDEX IF NOT EXISTS idx_crowd_tokens_active ON crowd_telemetry_tokens(expires_at, is_verified);

-- 7. Row-Level Security (RLS)
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_telemetry_tokens ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public facilities are viewable by everyone"
  ON facilities FOR SELECT USING (true);

CREATE POLICY "Public facility stock is viewable by everyone"
  ON facility_stock FOR SELECT USING (true);

-- Student pass insert policy
CREATE POLICY "Students can generate digital intake passes"
  ON intake_passes FOR INSERT WITH CHECK (true);

CREATE POLICY "Intake passes are readable by pass code lookup"
  ON intake_passes FOR SELECT USING (true);

-- Crowd token policies
CREATE POLICY "Verified crowd tokens are readable"
  ON crowd_telemetry_tokens FOR SELECT USING (true);

CREATE POLICY "Tokens can be submitted"
  ON crowd_telemetry_tokens FOR INSERT WITH CHECK (true);

-- Realtime publication enablement
ALTER PUBLICATION supabase_realtime ADD TABLE facilities;
ALTER PUBLICATION supabase_realtime ADD TABLE facility_stock;
ALTER PUBLICATION supabase_realtime ADD TABLE crowd_telemetry_tokens;

-- 8. Seed Data: UNN Nsukka Pilot Network
INSERT INTO facilities (id, slug, name, facility_type, is_campus_clinic, is_verified, distance_meters, current_queue, price_label, tiship_covered)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'unn-medical-centre', 'UNN Medical Centre', 'Campus Clinic', TRUE, TRUE, 400, 'low', '₦0 (TISHIP Covered)', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'odim-gate-pharmacy', 'Odim Gate Community Pharmacy', 'Community Pharmacy', FALSE, TRUE, 650, 'low', '₦1,500 - ₦3,500', FALSE),
  ('00000000-0000-0000-0000-000000000003', 'hilltop-care-pharmacy', 'Hilltop Care Pharmacy', 'Community Pharmacy', FALSE, TRUE, 950, 'moderate', '₦1,200 - ₦3,000', FALSE),
  ('00000000-0000-0000-0000-000000000004', 'ogige-central-pharmacy', 'Ogige Central Pharmacy', 'Community Pharmacy', FALSE, TRUE, 1800, 'low', '₦1,000 - ₦2,800', FALSE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO facility_stock (facility_id, category, in_stock)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Antimalarials (ACT)', TRUE),
  ('00000000-0000-0000-0000-000000000001', 'Analgesics & Fever', TRUE),
  ('00000000-0000-0000-0000-000000000001', 'Typhoid / Lab Test', TRUE),
  ('00000000-0000-0000-0000-000000000001', 'ORS & Hydration', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'Antimalarials (ACT)', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'Analgesics & Fever', TRUE),
  ('00000000-0000-0000-0000-000000000002', 'Typhoid / Lab Test', FALSE),
  ('00000000-0000-0000-0000-000000000002', 'ORS & Hydration', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Antimalarials (ACT)', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Analgesics & Fever', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Typhoid / Lab Test', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'ORS & Hydration', FALSE),
  ('00000000-0000-0000-0000-000000000004', 'Antimalarials (ACT)', FALSE),
  ('00000000-0000-0000-0000-000000000004', 'Analgesics & Fever', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'Typhoid / Lab Test', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'ORS & Hydration', TRUE)
ON CONFLICT (facility_id, category) DO NOTHING;
