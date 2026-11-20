# 0002 Data Model and Persistence: Rationale

**Status**: Accepted
**Date**: 2026-11-20

## Context

Undergraduate students at Nigerian universities operate on unreliable mobile cellular networks with frequent data packet drops. When seeking urgent healthcare navigation, their phones must retain facility locations, queue estimates, and stock indicators locally. In addition, student drug allergies must be communicated to healthcare attendants without publishing sensitive student health records to public databases or exposing students to surveillance.

## Options considered

### Option 1: Relational PostgreSQL Schema with Local IndexedDB Mirroring
- Pros: Foreign key relationships prevent orphan records; Row Level Security isolates pharmacy management from public read queries; deterministic schema matches typed domain models; offline IndexedDB mirror ensures immediate client execution.
- Cons: Requires synchronization logic between browser storage and cloud database tables.

### Option 2: Document Store with Embedded Sub Documents (MongoDB / Firestore)
- Pros: Rapid schema changes without migrations.
- Cons: Prone to race conditions and duplicate stock entries; lacks transactional guarantees for counter token redemption; difficult to enforce strict relational foreign keys.

### Option 3: Local Only SQLite via WebAssembly
- Pros: Complete local relational query engine.
- Cons: Excessive initial bundle weight (exceeding 2MB); complex multi tab locking issues; slower cold load time on low tier mobile hardware.

## Rationale

Relational PostgreSQL via Supabase provides atomic token verification and Row Level Security, satisfying AC-4. Pairing it with a lightweight IndexedDB client storage layer guarantees sub second query responses offline while keeping the initial JavaScript bundle footprint minimal.
