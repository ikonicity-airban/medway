# 0004: Transactional Proof and Counter Check-In for Telemetry Integrity

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

Crowdsourced queue reports on university campuses decay rapidly due to low voluntary student reporting, while commercial pharmacies possess an economic incentive to report false low wait times and full stock to lure student foot traffic. The platform required a fraud-resistant telemetry mechanism that prevents bait-and-switch stockouts without relying on hospital EMRs or complex point-of-sale integrations.

## Decision Outcome

Chosen option: "Transactional Proof & Counter Check-In", because anchoring queue and stock telemetry to student intake pass presentations and counter QR verification guarantees physical presence and verifies real inventory status. Crowd reports without verification tokens decay automatically on a 30-minute half-life.

## Consequences

- **Positive:** Eliminates fabricated pharmacy stock statuses; provides tamper-resistant crowd telemetry without requiring hospital API access.
- **Negative / Trade-offs:** Requires participating pharmacies to scan or acknowledge intake tokens; unverified facilities require conservative fallback ranking.

## Considered Options

- Transactional Proof & Counter Check-In (Chosen)
- Manual Attendant PIN Toggles with Penalty Slashing (Rejected: Reactive rather than preventative; fails during staff turnover)
- Zero-Telemetry Static Directory with Manual Schedules (Rejected: Destroys the core real-time rerouting value proposition)
