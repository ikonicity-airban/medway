# 0001 Stack and Architecture: Rationale

**Status**: In Progress
**Date**: 2026-11-20

## Context

Nigerian campus networks at the University of Nigeria Nsukka suffer from high packet loss and sudden data drops. Undergraduates seeking medical guidance cannot wait for sluggish server side round trips when evaluating urgent health questions. The architecture must run deterministic routing algorithms locally in under 5 milliseconds while supporting real time telemetry broadcasts across partner counters.

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

## Rationale

Next.js 15 App Router provides static asset export and service worker caching through Workbox, satisfying the low bandwidth requirement in Context. TypeScript guarantees that critical medical safety invariants and non diagnostic boundaries are enforced at compile time. Supabase provides managed PostgreSQL with real time WebSockets for live telemetry synchronization.
