# 0002: Hybrid Telemetry (Crowdsource + Partner Verification)

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

UNN Medical Centre operates with paper records and lacks an Electronic Medical Record (EMR) API. MedWay cannot block deployment on months-long institutional hospital IT integration cycles.

## Decision Outcome

Chosen option: "Hybrid Telemetry Model", combining voluntary student crowd reports (with 30-minute time-decay) and a web-based Partner Portal for off-campus pharmacies.

## Consequences

- **Positive:** Zero institutional software dependencies on day one; immediate field deployability.
- **Negative / Trade-offs:** Requires physical bootstrapping of local pharmacy attendants and anti-gaming safeguards.

## Considered Options

- Hybrid Telemetry Model (Chosen)
- Hospital EMR API Integration (Rejected: UNN Medical Centre operates on paper folders; institutional approvals take 6–12 months)
