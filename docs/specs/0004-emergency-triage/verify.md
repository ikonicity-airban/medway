# Verify: Emergency red flag triage · spec 0004 · updated 2026-11-20

_Steps derived from spec 0004 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## Automated tests

- [ ] `npm test -- src/features/triage/emergency-triage.test.ts` → Validates that checking any danger sign sets red flag status, hides retail pharmacy routes, and activates casualty dialer links → AC-1, AC-2, AC-3
- [ ] `npm test -- src/lib/routing-engine.test.ts` → Confirms that `rankFacilities` with `hasRedFlags: true` returns an empty array for retail commercial pharmacies → AC-1

## Commands

- [ ] `npm run typecheck` → TypeScript compiles triage components and state hooks with zero errors → AC-1, AC-2, AC-4
- [ ] `npm run lint` → ESLint verifies zero accessibility warnings and clean component imports → AC-2, AC-3
- [ ] `npm run build` → Next.js compiles static production bundle for emergency routes → AC-2, AC-3

## Acceptance criteria coverage

- AC-1 (Deterministic red flag lockout) covered by `src/lib/routing-engine.ts` and `emergency-triage.test.ts`
- AC-2 (Emergency modal and phone dialers for UNN and Bishop Shanahan) covered by `src/features/triage/emergency-modal.tsx`
- AC-3 (Campus casualty location guidance) covered by `src/features/triage/emergency-view.tsx`
- AC-4 (Danger sign state persistence) covered by `src/features/triage/use-emergency-triage.ts`
- AC-5 (Zero diagnostic predictions) audited via string and component review
