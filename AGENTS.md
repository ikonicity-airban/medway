# MedWay

## Stack
- Language & runtime: TypeScript 5.7, Node.js 22 LTS
- Framework: Next.js 15.1 (App Router, React 19)
- Key dependencies: @supabase/supabase-js 2.47, tailwindcss 4.0, lucide-react 0.469, workbox-window 7.3
- Package manager: npm 10.9

## Build approach
Tracer Bullet: vertical slices, each built end to end through every layer, real and narrow.

## Commands
- install: `npm install`
- dev: `npm run dev`
- build: `npm run build`
- test: `npm test`

## Specs
Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`.

## Rules
- Strict TypeScript with zero any and exhaustive pattern matches.
- Colocate components, hooks, and tests by feature slice in `src/features/`.
- Domain routing logic in `src/lib/routingEngine.ts` must remain pure with zero UI or network dependencies.
- Catch all errors at boundaries and return structured user friendly toasts.
- Validate all incoming API and storage payloads with Zod schemas.
- Update `docs/context/ui-registry.md` when you add or change a shared component.
- Standing design bans: never use `animate-pulse` or pulsing elements; never wrap titles in pills or cards.
- Accessibility floor: WCAG AA contrast, 48px touch targets, visible 2px focus rings.

## Tooling
- Lint & format: ESLint 9 + Prettier 3
- Pre-commit: lint, format, typecheck on staged files
- Testing gate: Vitest unit tests on routing engine + React Testing Library on views
- CI: GitHub Actions checking lint, typecheck, and test on push

## Git
- integration: on
- branch prefix: feat/
- commit: per-milestone

## Context files
- [design.md](design.md) (Art direction, clinical slate tokens, contrast ratios, and visual rules)
- [docs/context/project-overview.md](docs/context/project-overview.md) (Product vision, user personas, routes, and success metrics)
- [docs/context/code-standards.md](docs/context/code-standards.md) (TypeScript conventions, error handling, and testing guidelines)
- [docs/context/architecture.md](docs/context/architecture.md) (System topology, request flows, and environment variables map)
- [docs/context/library-docs.md](docs/context/library-docs.md) (Pinned dependencies, minimal SDK usage examples, and gotchas)
- [docs/context/ui-rules.md](docs/context/ui-rules.md) (Layout constants, component patterns, and state conventions)
- [docs/context/ui-registry.md](docs/context/ui-registry.md) (Catalog of shared UI components, paths, and status)

_Drafted by the project context generator from your answers, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
