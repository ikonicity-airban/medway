# Code Standards: MedWay

This document establishes the technical conventions, typing standards, and architectural rules for MedWay.

## Architecture style
MedWay follows clean architecture boundaries. Pure business logic (such as deterministic routing scores, danger sign checks, and token expiration math) resides in `src/lib/` and has zero dependencies on React, Next.js, or browser APIs. UI components in `src/components/` and `src/app/` act purely as presentation and interaction adapters.

## Type strictness
- TypeScript is configured in strict mode.
- Never use the `any` keyword. If a type is unknown at a boundary, use `unknown` and parse it with a Zod schema.
- Enforce exhaustive pattern matching on all enum unions (such as `QueueLevel` and `CareCategory`).

## Naming conventions
- PascalCase for React components and TypeScript types (`StudentRouterView`, `FacilityCard`).
- camelCase for functions, variables, and hooks (`calculateFacilityScore`, `useOfflineSync`).
- kebab-case for filenames, directory paths, and route slugs (`routing-engine.ts`, `intake-pass.tsx`).
- UPPER_SNAKE_CASE for constant values and environment variable names (`MAX_QUEUE_WAIT_MINUTES`).

## Folder structure
Code is organized by feature slices under `src/`:
- `src/app/`: Next.js App Router pages and layout shells.
- `src/features/`: Co-located feature modules (components, hooks, tests) for `router`, `triage`, `intake-pass`, `partner`, and `telemetry`.
- `src/lib/`: Pure domain logic, scoring math, and utility functions.
- `src/types/`: Shared TypeScript data contracts and Zod validation schemas.
- `src/components/ui/`: Reusable, accessible UI primitives (buttons, inputs, cards, badges).

## Error handling pattern
All boundary operations (such as IndexedDB reads, network requests, and camera barcode scans) must catch errors and return structured result objects rather than throwing unhandled exceptions.

```typescript
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export async function fetchFacilityDirectory(): Promise<Result<Facility[]>> {
  try {
    const records = await db.facilities.toArray();
    return { success: true, data: records };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown storage failure');
    console.error('Failed to read facility directory:', error);
    return { success: false, error };
  }
}
```

## Validation at boundaries
Never trust input from the network, local storage, or user text fields. Validate all data payloads at system boundaries using Zod schemas before passing them into domain functions.

```typescript
import { z } from 'zod';

export const IntakePassInputSchema = z.object({
  category: z.enum([
    'Antimalarials (ACT)',
    'Analgesics & Fever',
    'Typhoid / Lab Test',
    'ORS & Hydration'
  ]),
  allergies: z.string().max(256).default('None'),
  budgetPreference: z.enum(['tiship', 'fast'])
});
```

## Environment validation
Validate all required environment variables at application startup. If a required environment variable is missing, throw a descriptive initialization error before the server accepts traffic.

## Import rules
- Use TypeScript path aliases (`@/components/...`, `@/lib/...`, `@/types/...`).
- Group imports: built-in libraries first, third-party packages second, internal project imports third.
- Named exports are required for all modules; default exports are permitted only for Next.js App Router page components.

## Testing conventions
- Unit test all pure domain functions in `src/lib/` using Vitest with 100% branch coverage.
- Test user interactions, danger sign check lockouts, and clipboard copy buttons using React Testing Library.
- Mock network and storage calls cleanly; never hit live production Supabase instances in automated test suites.

## Commit format
Use conventional commit prefixes:
- `feat:` new user facing capability.
- `fix:` bug resolution.
- `test:` test suite addition or adjustment.
- `refactor:` code reorganization without behavior change.
- `docs:` documentation updates.

## Accessibility baseline
- Conform strictly to WCAG 2.2 AA.
- All interactive controls must measure at least 48px by 48px.
- Visible focus rings with 2px stroke and 2px offset are mandatory on all interactive elements.
- Color must never be the sole conveyor of status; all status tags must combine explicit text labels with color badges.
