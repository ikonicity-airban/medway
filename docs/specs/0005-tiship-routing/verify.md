# Verify: TISHIP routing & zero cost lock · spec 0005 · updated 2026-11-20

_Steps derived from spec 0005 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## Automated tests

- [ ] `npm test -- src/features/router/tiship-routing.test.tsx` → Validates budget gate toggling between ₦0 TISHIP and fast retail, category selection across the 4 canonical categories, and dynamic facility list reordering → AC-1, AC-3, AC-4
- [ ] `npm test -- src/lib/routing-engine.test.ts` → Confirms that selecting ₦0 budget locks UNN Medical Centre to the first rank position (+1000 score boost) even when queue level is high → AC-2, AC-3

## Commands

- [ ] `npm run typecheck` → TypeScript compiles router components with strict types and zero any → AC-1, AC-2, AC-4
- [ ] `npm run lint` → ESLint verifies zero accessibility warnings and clean component imports → AC-1, AC-3
- [ ] `npm run build` → Next.js compiles static production bundle for the care router view → AC-1, AC-4

## Acceptance criteria coverage

- AC-1 (Budget gate toggle for ₦0 vs retail) covered by `src/features/router/budget-gate.tsx`
- AC-2 (TISHIP Hard Lock score boost +1000) verified by `src/lib/routing-engine.ts`
- AC-3 (High queue never causes commercial pharmacy to outrank clinic on ₦0 budget) verified by unit tests in `routing-engine.test.ts`
- AC-4 (Restricted to 4 canonical care categories) covered by `src/features/router/category-selector.tsx`
- AC-5 (Zero diagnostic guidance) verified via component content review
