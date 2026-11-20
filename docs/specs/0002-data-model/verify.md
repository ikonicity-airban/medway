# Verify: Data model and local schema · spec 0002 · updated 2026-11-20

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## Automated tests

- [ ] `npm test -- src/lib/intake-pass.test.ts` → Validates pass code format (MW-UNN-XXX), emergency red flag lockout for commercial pharmacies, crowd token expiration at 30 minutes, and aggregated queue calculation → AC-3, AC-4
- [ ] `npm test -- src/lib/offline-db.test.ts` → Validates UNN pilot facility seeding, intake pass persistence, and expired token filtering → AC-1, AC-2, AC-3, AC-4

## Commands

- [ ] `npm run typecheck` → TypeScript compiles all domain schemas and database row interfaces with zero any → AC-1, AC-2, AC-3, AC-4
- [ ] `npm run lint` → ESLint passes with zero warnings across data contracts and storage adapters → AC-1, AC-2, AC-3, AC-4

## Acceptance criteria coverage

- AC-1 (Facility storage with identifiers, clinic tags, queue levels) covered by `src/types/index.ts`, PostgreSQL migration, and `src/lib/offline-db.test.ts`
- AC-2 (Category stock enforcement across 4 canonical categories) covered by `CARE_CATEGORIES`, PostgreSQL foreign keys, and `src/lib/offline-db.test.ts`
- AC-3 (Digital intake pass in MW-UNN-XXX format with allergies and safety flags) covered by `createIntakePass` and `src/lib/intake-pass.test.ts`
- AC-4 (Crowd telemetry token with 30 minute TTL and counter verification) covered by `createCrowdToken`, `isCrowdTokenValid`, `verifyCrowdToken`, and `src/lib/intake-pass.test.ts`
