# Verify: Stack & architecture · spec 0001 · updated 2026-11-20

_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [ ] Load `/` in browser under offline network emulation → static shell renders within 3 seconds → AC-1
- [ ] Click through to `/emergency` while disconnected → 24/7 hospital emergency contacts and dialer render instantly → AC-1, AC-2

## Commands

- [ ] `npm run build` → Next.js compiles static routes with zero errors → AC-1, AC-2
- [ ] `npx tsc --noEmit` → TypeScript types compile strictly with zero any → AC-2

## Acceptance-criteria coverage

- AC-1 (Offline shell boot under 3s) covered by manual offline reload and `npm run build` static generation
- AC-2 (Local deterministic routing execution) covered by client rendering and static prerender check
- AC-3 (Realtime partner broadcast in <500ms) covered by Supabase WebSocket channel subscription
