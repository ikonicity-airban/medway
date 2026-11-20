# Verify: Design system & UI foundation · spec 0003 · updated 2026-11-20

_Steps derived from spec 0003 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## Automated tests

- [ ] `npm test -- src/components/ui/ui-primitives.test.tsx` → Validates 48px minimum touch target on buttons, accessible visible focus rings, status badges, semantic CardTitle headings, facility card interactions, danger sign checklist escalation, and intake pass card rendering → AC-2, AC-3, AC-4

## Commands

- [ ] `npm run typecheck` → TypeScript compiles all UI components with strict types and zero any → AC-1, AC-3, AC-4
- [ ] `npm run lint` → ESLint verifies zero accessibility warnings and clean component imports → AC-3, AC-4
- [ ] `npm run build` → Next.js compiles static production bundle with Tailwind v4 theme tokens → AC-1, AC-2

## Acceptance criteria coverage

- AC-1 (Validated color scales in Tailwind v4) covered by `src/app/globals.css` `@theme` block and `_place-after-scaffold/tokens.css`
- AC-2 (4.5:1 contrast ratios in light and dark modes) verified by color tokens and automated UI primitive tests
- AC-3 (48px touch target floor and 2px focus ring) enforced in `src/components/ui/button.tsx` and validated in `ui-primitives.test.tsx`
- AC-4 (Facility cards, danger sign checklist, intake pass card primitives) implemented in `src/components/ui/` and verified in `ui-primitives.test.tsx`
