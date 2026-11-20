# Architecture Map

This document provides a topology map of the MedWay system, detailing directory organization, request lifecycles, and environment variable requirements. For detailed technical decisions, refer to [0001 Stack and Architecture](docs/specs/0001-stack-architecture.md) and [0002 Data Model and Persistence](docs/specs/0002-data-model.md).

## Directory layout

```text
.
├── src/
│   ├── app/                      # Next.js App Router root layout and top level route pages
│   │   ├── emergency/            # Dedicated emergency hospital escalation view
│   │   ├── partner/              # Partner pharmacy portal and counter check in scanner
│   │   └── analytics/            # Aggregated population health intelligence dashboard
│   ├── features/                 # Co-located feature modules with components, hooks, and tests
│   │   ├── router/               # Care category selector, budget gate, and route cards
│   │   ├── triage/               # Red flag danger sign checklist and emergency modal
│   │   ├── intake-pass/          # Slip generator, QR token renderer, and clipboard copy
│   │   └── telemetry/            # Crowd report ingest, time decay calculator, and partner toggles
│   ├── components/
│   │   └── ui/                   # Reusable accessible UI primitives built with Tailwind v4
│   ├── lib/                      # Pure domain routing algorithms and mathematical scoring helpers
│   ├── types/                    # Shared TypeScript interfaces, enum contracts, and Zod schemas
│   └── workers/                  # Workbox service worker scripts for offline shell caching
├── supabase/
│   └── migrations/               # PostgreSQL schema migrations and Row Level Security policies
├── docs/
│   ├── scope/                    # Living scope and feature phase trackers
│   ├── specs/                    # Architectural decision and feature design specifications
│   ├── context/                  # Developer reference guides and operational standards
│   └── adr/                      # Accepted architectural decision records
└── _place-after-scaffold/        # Precomputed Tailwind v4 tokens to merge into theme
```

## Request and data flows

### Student care routing flow

```text
[Sick Student Mobile Client]
           │
           ▼
[Check Red Flag Danger Signs] ──(Flag Selected)──► [Immediate Emergency Ward Modal]
           │
     (Zero Flags)
           ▼
[Select Category & Budget]
           │
           ▼
[Local Routing Engine (src/lib/routing-engine.ts)]
     ▲                 ▲
     │                 │ (Offline Cached Directory)
     │                 ▼
     │      [Browser IndexedDB Cache]
     │                 ▲
     │                 │ (Background Realtime Sync)
     │                 ▼
     └────── [Supabase PostgreSQL Facility Directory]
           │
           ▼
[Ranked Facility Cards Displayed]
           │
           ▼
[Generate Digital Intake Pass (MW-UNN-XXX)]
```

### Partner inventory toggle and counter check in flow

```text
[Partner Pharmacy Attendant]
           │
     (Enter Admin PIN)
           ▼
[Partner Dashboard (/partner)]
           │
           ├──► [Toggle Category Stock: In / Out of Stock]
           │                  │
           │                  ▼
           │      [Supabase Realtime Broadcast] ──► [Connected Student Clients]
           │
           └──► [Scan Student Intake Pass QR Code]
                              │
                              ▼
                  [Validate Check-In Token]
                              │
                              ▼
                  [Reset Facility Queue Score to Low / Moderate]
```

## Environment variable names

| Name | Server or client | Purpose | Used in |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Endpoint URL for the Supabase backend project | Supabase client initialization |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Public anonymous API key with RLS enforcement | Browser database reads and subscriptions |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Privileged administrative key for telemetry pipelines | Serverless edge API routes |
| `PARTNER_PORTAL_ADMIN_SECRET` | Server | Master cryptographic secret for validating partner PIN tokens | `/api/partner/auth` route |
| `NEXT_PUBLIC_APP_URL` | Client | Canonical URL used for generating QR intake share links | Pass generator component |
