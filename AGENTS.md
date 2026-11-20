# MedWay

## Stack

- Language and runtime: TypeScript 5.7 on Node.js 22 LTS
- Framework: Next.js 15.1 (App Router, React 19)
- Key dependencies: @supabase/supabase-js 2.47, tailwindcss 4.0, lucide-react 0.469, workbox-window 7.3, zod 3.24
- Package manager: npm

## Build approach

Tracer Bullet: vertical slices, each built end to end through every layer, real and narrow.

## Commands

- install: npm install
- dev: npm run dev
- build: npm run build
- test: npm test

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`.

## Rules

- Strict types only. Never use `any`. Write exhaustive discriminated unions.
- Keep deterministic routing scores and triage logic in pure functions inside `src/lib/routing-engine.ts`.
- Colocate feature code in `src/features/{router,triage,intake-pass,partner,telemetry}`.
- Catch all errors at boundaries and return structured user friendly toasts.
- Validate all incoming API and storage payloads with Zod schemas.
- Update `docs/context/ui-registry.md` when you add or change a shared component.
- Standing design bans: never use `animate-pulse` or pulsing elements; never wrap titles in pills or cards.
- Accessibility floor: WCAG AA contrast, 48px touch targets, visible 2px focus rings.

## Tooling

- Lint and format: ESLint 9 + Prettier 3
- Pre-commit: lint, format, typecheck on staged files
- Testing gate: Vitest with React Testing Library
- CI: GitHub Actions checking lint, typecheck, and test on push

## Git

- integration: on
- branch prefix: feat/
- commit: per-milestone

## Context files

- [design.md](design.md) (Art direction, clinical slate tokens, contrast ratios, and visual rules)
- [docs/context/project-overview.md](docs/context/project-overview.md) (Product vision, user personas, routes, and success metrics)
- [docs/context/code-standards.md](docs/context/code-standards.md) (TypeScript conventions, error handling, and type rules)
- [docs/context/architecture.md](docs/context/architecture.md) (Annotated folder map and request flows)
- [docs/context/library-docs.md](docs/context/library-docs.md) (SDK guides and verified API snippets)
- [docs/context/ui-rules.md](docs/context/ui-rules.md) (Component layout constants and UI behavior)
- [docs/context/ui-registry.md](docs/context/ui-registry.md) (Shared component tracking inventory)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
