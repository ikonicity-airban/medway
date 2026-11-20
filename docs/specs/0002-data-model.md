# 0002 Data Model and Persistence

**Status**: Proposed
**Date**: 2026-11-20

## Summary
MedWay requires a relational data model capable of tracking medical facilities, real time inventory categories, student intake passes, and crowd telemetry tokens. The schema must synchronize between local browser IndexedDB storage and Supabase PostgreSQL. This specification defines the core entities, integrity constraints, and value sourcing rules.

## Context
Students need immediate access to facility locations, queue statuses, and stock levels even when offline. Partner pharmacies must update stock statuses and redeem student counter check in tokens to keep telemetry trustworthy. The data architecture must separate public facility directory records from sensitive student allergy notes while storing zero diagnostic medical records.

## Requirements
- User story: As a student, I want my declared drug allergies and non diagnostic care categories safely captured on my local intake pass without being exposed on public feeds.
- User story: As a pharmacy attendant, I want to update our facility stock status for antimalarials and analgesics with instant database persistence.
- AC-1: The facility entity must store unique identifiers, geolocations, campus clinic status, PCN verification tags, and baseline queue levels.
- AC-2: The category stock entity must enforce boolean availability across the four canonical care categories with update timestamps.
- AC-3: The digital intake pass entity must serialize the pass identifier in the format MW-UNN-XXX, storing timestamps, declared allergies, and red flag clearance status.
- AC-4: The crowd telemetry token entity must link to a valid pass identifier, expiring automatically after 30 minutes unless marked redeemed by a partner counter.

## Options considered

### Option 1: Relational PostgreSQL Schema with Local IndexedDB Mirroring
- Pros: Strict foreign key relationships between facilities, stock records, and tokens; native Row Level Security policies; simple offline replication via JSON fixtures.
- Cons: Requires synchronization logic between browser storage and cloud database tables.

### Option 2: Document Store with Embedded Sub-Documents (MongoDB / Firestore)
- Pros: Schema free flexibility during early rapid prototyping.
- Cons: High risk of orphan inventory records and inconsistent queue ratings across concurrent student updates.

## Decision
Chosen option: Option 1 (Relational PostgreSQL Schema with Local IndexedDB Mirroring). Strict relational integrity prevents corrupt facility stock references and enforces hard safety invariants at the database level.

## Rationale
Relational schemas provide transactional guarantees when redeeming counter check in tokens, satisfying AC-4. Row Level Security policies allow public read access for facility directories while restricting pharmacy inventory toggles to verified PIN holders.

## Feature design

### Data model sketch

```sql
CREATE TYPE queue_level AS ENUM ('low', 'moderate', 'high');

CREATE TYPE care_category AS ENUM (
  'Antimalarials (ACT)',
  'Analgesics & Fever',
  'Typhoid / Lab Test',
  'ORS & Hydration'
);

CREATE TABLE facilities (
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

CREATE TABLE facility_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  category care_category NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(facility_id, category)
);

CREATE TABLE intake_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_code VARCHAR(32) UNIQUE NOT NULL, -- MW-UNN-XXX
  facility_id UUID NOT NULL REFERENCES facilities(id),
  category care_category NOT NULL,
  allergies_declared TEXT NOT NULL DEFAULT 'None',
  tiship_applied BOOLEAN NOT NULL DEFAULT FALSE,
  red_flags_cleared BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crowd_telemetry_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_code VARCHAR(64) UNIQUE NOT NULL,
  pass_id UUID REFERENCES intake_passes(id) ON DELETE SET NULL,
  facility_id UUID NOT NULL REFERENCES facilities(id),
  reported_queue queue_level NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### State transitions

- Telemetry token lifecycle: `Created` (valid for 30 minutes) -> `Redeemed` (verified by counter scan) OR `Expired` (discarded from scoring weight).
- Facility stock lifecycle: `In Stock` <-> `Out of Stock` (toggled by authenticated partner or triggered by quorum stockout reports).

### Value sourcing table

| Action | Value | Source |
|---|---|---|
| Rank care routes | Facility queue score | facilities.current_queue weighted by recency decay |
| Filter out of stock facilities | Category availability | facility_stock.in_stock joined by selected care_category |
| Enforce TISHIP Hard Lock | ₦0 student routing override | Student budget selector joined with facilities.tiship_covered |
| Generate intake pass | Pass code identifier | Random alphanumeric suffix appended to MW-UNN- prefix |
| Verify counter check in | Telemetry verification tag | crowd_telemetry_tokens.is_verified set to true on partner scan |

### Key invariants
- If a student triggers any red flag indicator, intake_passes.red_flags_cleared must be false and retail pharmacy facilities must never be associated with the pass.
- When a student selects budget ₦0, the routing engine must never return a private commercial pharmacy as the primary route.
- A crowd telemetry token must expire exactly 30 minutes after creation unless validated by a partner counter token scan.

### Security model
- `facilities` and `facility_stock` tables allow public read access for all clients.
- `facility_stock` updates require authenticated partner roles matching the facility ID.
- `intake_passes` rows are write only by unauthenticated students and readable only by the issuing client session or via direct token lookup at the counter.
- Zero clinical diagnoses or doctor consultation notes are stored anywhere in the schema.

### Configuration required
- `NEXT_PUBLIC_SUPABASE_URL`: client accessible URL for the Supabase instance.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: client accessible public API key with Row Level Security enforcement.
- `SUPABASE_SERVICE_ROLE_KEY`: server only administrative key used for background telemetry aggregations.

## Build plan
1. Create PostgreSQL migration script with enum types, tables, and foreign keys (satisfies AC-1, AC-2, AC-3, AC-4).
2. Define TypeScript types and Zod parsing schemas matching schema contracts (satisfies AC-1, AC-2, AC-3).
3. Implement IndexedDB offline persistence layer and local seed fixtures (satisfies AC-1, AC-2).
4. Implement intake pass generation and token expiration logic (satisfies AC-3, AC-4).

## Critical test scenarios
- Test Scenario 1: Verify that a facility stock update for antimalarials propagates to the client within 500 milliseconds (cites AC-2).
- Test Scenario 2: Verify that an intake pass cannot be generated with invalid or malformed pass codes (cites AC-3).
- Test Scenario 3: Verify that an unverified crowd telemetry token older than 30 minutes is excluded from queue scoring calculations (cites AC-4).
- Test Scenario 4: Verify that a facility cannot have duplicate stock entries for the same category (cites AC-1, AC-2).

## Consequences
- Positive: Predictable relational schema with full offline parity and zero diagnostic liability.
- Negative: Requires database migrations whenever new care categories are introduced.
- Neutral: Requires periodic background cleanup of expired crowd telemetry tokens.
