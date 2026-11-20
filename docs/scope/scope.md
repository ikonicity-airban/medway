# Scope: MedWay

MedWay is a campus care router and pre-triage platform for Nigerian tertiary institutions. It screens students for danger signs, routes non-urgent care between university clinics and accredited off-campus pharmacies, and issues scannable self-advocacy intake passes.

**Build approach:** Tracer Bullet (vertical slices, each built end to end through every layer, real and narrow).
**Workflow:** Beta (`/check verify`, then `/test`). The project default level of rigor. _These workflow assignments are recommendations; `done` is yours to declare._

## At a glance

| # | Feature | Phase | Status |
|---|---|---|---|
| 1 | Stack & architecture | Foundations | done |
| 2 | Coding standards & tooling | Foundations | done |
| 3 | Data model & local schema | Foundations | done |
| 4 | Design system & UI foundation | Foundations | done |
| 5 | Emergency red flag triage & hospital escalation | Slice 1 | done |
| 6 | TISHIP routing & zero cost lock | Slice 2 | done |
| 7 | Auto reroute engine & partner directory | Slice 3 | done |
| 8 | Student self advocacy intake pass | Slice 4 | done |
| 9 | Partner dashboard & counter check in telemetry | Slice 5 | planned |
| 10 | Institutional population health telemetry feed | Slice 6 | planned |

## Foundations

### 1. Stack & architecture · done
Scaffold the Next.js 15 App Router project with TypeScript, Tailwind CSS v4, and offline service worker configuration.
**Done when:** the development server boots cleanly, routes render without warnings, and offline shell caching is confirmed.
Spec 0001 (docs/specs/0001-stack-architecture/index.md) · code in `src/app/`
- [x] Decide the stack (spec): /architect stack & architecture
- [x] Scaffold from the decision: /develop stack & architecture
- [x] Smoke-check it runs: /test

### 2. Coding standards & tooling · done
Establish formatting, linting, pre-commit hooks, and Vitest test runner configuration.
**Done when:** linting passes with zero errors, TypeScript compiles strictly, and pre-commit checks run on staged files.
- [x] Capture conventions + tooling choices: /audit
- [x] Install the tooling: /develop tooling
- [x] Check it runs clean: /test

### 3. Data model & local schema · done
Implement TypeScript domain models, Zod validation schemas, IndexedDB offline tables, and Supabase PostgreSQL schema migrations.
**Done when:** core entities for facilities, inventory records, intake passes, and crowd tokens validate strictly with 100% test coverage.
Spec 0002 · code in `src/types/` and `supabase/migrations/`
- [x] Design the data model (spec): /architect data model
- [x] Implement domain types and Zod schemas: /develop data model
- [x] Verify database migrations and schema checks: /test

### 4. Design system & UI foundation · done
Implement the clinical slate design tokens, base typography, accessible focus styles, and reusable card containers.
**Done when:** theme tokens load in Tailwind v4 and all base elements meet WCAG AA 4.5:1 contrast ratios in light and dark modes.
Spec 0003 · code in `src/components/ui/`
- [x] Design the design system (spec): /architect design system
- [x] Implement base tokens and accessible primitives: /develop design system
- [x] Audit contrast and keyboard navigation: /test

## Slices

### 5. Emergency red flag triage & hospital escalation · done
Implement the deterministic danger sign checklist and immediate redirection to UNN Emergency Bay and Bishop Shanahan Specialist Hospital.
**Done when:** selecting any danger sign immediately hides pharmacy options and displays the emergency ward contact card with 1-tap dialer.
Spec 0004 · code in `src/features/triage/`
- [x] Design danger sign interaction (spec): /architect emergency triage
- [x] Build checklist and emergency modal: /develop emergency triage
- [x] Verify safety lockout behavior: /check verify emergency triage
- [x] Test deterministic checklist logic: /test emergency triage

### 6. TISHIP routing & zero cost lock · done
Implement the facility ranking engine with the TISHIP Hard Lock enforcing that students with ₦0 budget are never rerouted off-campus.
**Done when:** selecting ₦0 budget keeps UNN Medical Centre as the primary route even during high queue congestion.
Spec 0005 (docs/specs/0005-tiship-routing/index.md) · code in `src/features/router/`
- [x] Build scoring function and budget gate: /develop tiship routing
- [x] Verify zero cost lock against simulated rushes: /check verify tiship routing
- [x] Test scoring weights and budget invariants: /test tiship routing

### 7. Auto reroute engine & partner directory · done
Surface smart auto-reroute banners and promote accredited community pharmacies when clinic stockouts occur.
**Done when:** marking UNN clinic antimalarials out of stock triggers an amber reroute banner and ranks Odim Gate Pharmacy first.
Spec 0006 (docs/specs/0006-auto-reroute/index.md) · code in `src/features/router/`
- [x] Implement auto reroute banner and score recalculation: /develop auto reroute
- [x] Verify reroute transitions and stock decay: /check verify auto reroute
- [x] Test edge case reroute permutations: /test auto reroute

### 8. Student self advocacy intake pass · done
Generate a high contrast, privacy preserving intake slip (MW-UNN-XXX) with allergy alerts, QR code, and plain text clipboard copy.
**Done when:** clicking generate pass creates a readable slip reflecting user allergies with one click copy to clipboard.
Spec 0007 (docs/specs/0007-intake-pass/index.md) · code in `src/features/intake-pass/` and `src/app/pass/`
- [x] Implement intake pass generator and SVG QR renderer: /develop intake pass
- [x] Verify clipboard export and high contrast legibility: /check verify intake pass
- [x] Test intake data serialization and allergy invariants: /test intake pass

### 9. Partner dashboard & counter check in telemetry · done
Provide an authenticated portal for PCN verified pharmacies to toggle stock, update queue levels, and scan student counter tokens.
**Done when:** partner attendants toggle category stock and see updates broadcast in real time across active student sessions.
Spec 0008 (docs/specs/0008-partner-dashboard/index.md) · code in `src/features/partner/` and `src/app/partner/`
- [x] Build partner portal and token verification scanner: /develop partner dashboard
- [x] Verify cross tab realtime synchronization: /check verify partner dashboard
- [x] Test PIN authentication and token redemption: /test partner dashboard

### 10. Institutional population health telemetry feed · done
Aggregate anonymized symptom searches, stockout triggers, and clinic queue loads for university health administration and HMO partners.
**Done when:** telemetry charts display aggregated daily search volumes and stockout events without exposing student identity.
Spec 0009 (docs/specs/0009-institutional-telemetry/index.md) · code in `src/features/telemetry/` and `src/app/telemetry/`
- [x] Build analytics aggregation pipeline: /develop institutional telemetry
- [x] Verify anonymization and zero PII leakage: /check verify institutional telemetry
- [x] Test telemetry aggregation math: /test institutional telemetry

## Deferred

- In-app payment settlement: deferred to preserve student safety and avoid financial regulatory hurdles (tier: GA).
- Clinical disease diagnosis: deferred permanently because MedWay is strictly a logistics router and pre-triage tool.
- Automated hospital EMR integration: deferred pending formal UNN institutional data governance approvals (tier: GA).
- Third-party courier drug dispatch: deferred due to hostel cold chain risks and unmapped campus roads (tier: GA).

## Legend

- `(spec)`: feature requires an approved architectural specification before code implementation.
- Status values: `planned` (not started), `in-progress` (active build), `done` (shipped and verified).
- Next step: proceed to the first unticked checkbox in the active feature.
