# 0009: Hybrid Offline-First Cache and Synchronization

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

Campus network connections at UNN are notoriously volatile, with students frequently experiencing 2G/EDGE or complete data drops inside concrete lecture theatres and hostel basements. A network failure must never prevent a sick student from evaluating red flags, viewing cached facility routes, or presenting an intake pass.

## Decision Outcome

Chosen option: "Hybrid Offline-First Cache (Workbox + IndexedDB + Supabase Realtime)", caching PWA shells and facility directory snapshots locally, enabling client-side evaluation of the scoring engine offline, and syncing crowd telemetry upon network restoration.

## Consequences

- **Positive:** Guaranteed instant route lookups and pass generation during network blackouts; zero white-screen network errors.
- **Negative / Trade-offs:** Requires cache staleness indicators so students understand when inventory telemetry was last synchronized.

## Considered Options

- Hybrid Offline-First Cache (Workbox + IndexedDB + Supabase Realtime) (Chosen)
- Standard Cloud-First SWR with Retry (Rejected: Leaves sick students stranded with network spinner timeouts during carrier outages)
- Local-Only Single-File Bundle (Rejected: Difficult to maintain production database schemas and multi-device telemetry at scale)
