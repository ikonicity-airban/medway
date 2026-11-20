# 0001 Stack and Architecture

**Status**: In Progress
**Date**: 2026-11-20

## Summary
MedWay requires a modern full stack web architecture capable of running offline on student mobile devices across Nigerian university campuses. The platform combines a reactive client shell, deterministic edge routing logic, and real time database synchronization. This specification establishes the core technology stack and architecture topology.

## Context
Nigerian campus networks at the University of Nigeria Nsukka suffer from high packet loss and sudden data drops. Undergraduates seeking medical guidance cannot wait for sluggish server side round trips when evaluating urgent health questions. The architecture must run deterministic routing algorithms locally in under 5 milliseconds while supporting real time telemetry broadcasts across partner counters.

## Requirements
- User story: As a sick student, I want to evaluate emergency danger signs and view facility routes instantly even when my mobile data connection drops.
- User story: As a partner pharmacy attendant, I want my inventory and queue updates to sync reliably across the campus network without manual refresh.
- AC-1: The application shell and routing engine must boot and execute in offline mode within 3 seconds using cached service worker assets.
- AC-2: All domain routing logic must execute locally in the client browser with zero network latency.
- AC-3: Database updates from partner counters must broadcast to connected clients in under 500 milliseconds via real time subscriptions.

## Options considered

### Option 1: Next.js 15 App Router with TypeScript, Tailwind CSS v4, and Supabase
- Pros: Server rendered shells for instant first paint; unified TypeScript codebase; edge API routes for secure operations; built in real time PostgreSQL subscriptions via Supabase.
- Cons: Larger client bundle than a minimal static HTML file; requires managing hydration boundaries between offline service workers and server components.

### Option 2: Single Page Application with Vite, React 19, and Firebase
- Pros: Minimal tooling overhead; rapid hot module replacement during development.
- Cons: No native edge API layer; vendor lock in to proprietary Firebase NoSQL document stores; slower initial cold loads over 2G networks without server prerendering.

### Option 3: Monolithic Node.js with Express, EJS Templates, and SQLite
- Pros: Simple deployment on a single virtual private server; zero cloud vendor dependencies.
- Cons: Lacks client side reactivity; requires full page reloads on slow mobile networks; cannot run offline in browser service workers.

## Decision
Chosen option: Option 1 (Next.js 15 App Router with TypeScript, Tailwind CSS v4, and Supabase). It delivers the optimal balance of offline client execution, strong typing across domain models, and managed real time database infrastructure.

## Rationale
Next.js 15 App Router provides static asset export and service worker caching through Workbox, satisfying the low bandwidth requirement in Context. TypeScript guarantees that critical medical safety invariants and non diagnostic boundaries are enforced at compile time. Supabase provides managed PostgreSQL with real time WebSockets for live telemetry synchronization.

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Language and runtime | TypeScript 5.7 on Node.js 22 LTS | Exhaustive static typing prevents runtime null pointer errors in routing logic |
| Framework | Next.js 15.1 App Router | Prerendered shells with fast edge route execution |
| Styling and design tokens | Tailwind CSS 4.0 | Zero runtime utility classes with native CSS variable theme tokens |
| State and persistence | Supabase PostgreSQL 15 | Relational data integrity with instant real time WebSocket broadcasts |
| Offline and caching | Workbox Window 7.3 | Robust service worker lifecycle caching for offline resilience |
| Component primitives | Radix UI and Lucide React 0.469 | Accessible unstyled primitives with high contrast medical icons |
| Test framework | Vitest 2.1 and React Testing Library | Fast unit test execution for deterministic routing math |

## Consequences
- Positive: Guaranteed offline route calculation; zero clinical hallucination risk; unified TypeScript contracts from database to UI.
- Negative: Requires careful orchestration of service worker caches to prevent serving stale inventory data past the 30 minute validity window.
- Neutral: Development workflow requires running both local Next.js servers and Supabase client configurations.
