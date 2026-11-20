# 0008 Partner Dashboard and Counter Check In Telemetry

**Status**: Accepted
**Date**: 2026-11-20

## Summary

The Partner Dashboard provides an authenticated, streamlined portal for campus clinic administrators and accredited community pharmacy attendants to update essential medication inventory, adjust real time queue levels, and verify student check in tokens. This specification outlines the PIN authentication flow, inventory toggle controls, counter token redemption engine, and cross tab broadcast synchronization that powers dynamic care routing.

## Context

Inventory at campus health centres and retail pharmacies is dynamic. During semester examinations or malaria season surges, antimalarial packs sell out rapidly while queues fluctuate by time of day. Without a lightweight way for busy counter attendants to declare stockouts and queue congestion in under five seconds, care routers display stale estimates that mislead patients. MedWay provides a friction free attendant interface requiring zero complex account passwords, operable on basic Android mobile browsers at retail counters.

## Requirements

- User story: As a pharmacy attendant at Odim Gate Pharmacy, I want to quickly toggle our antimalarial stock to out of stock when our last packet sells out, so students are not routed to our counter under false expectations.
- User story: As a clinic nurse at UNN Medical Centre, I want to select our current queue load (low, moderate, high) with one tap so student routing algorithms account for clinic congestion.
- User story: As an attendant verifying an arriving student, I want to enter their 4-character pass code or counter token to confirm arrival and contribute to consensus crowd telemetry.
- AC-1: The partner portal must be accessible at the route /partner and require a facility selection plus a 4-digit numeric PIN for authentication.
- AC-2: The attendant dashboard must display toggle switches for all four canonical categories (Antimalarials, Analgesics, Typhoid Tests, ORS) that update inventory records in storage.
- AC-3: A queue level selector must provide three 48px touch target options (Low: under 15 mins, Moderate: 15 to 45 mins, High: over 45 mins).
- AC-4: An arrival token verification panel must validate student tokens (CT-UNN-XXX) and intake pass codes (MW-UNN-XXX), marking them verified and updating telemetry timestamps.
- AC-5: Inventory and queue updates must broadcast across browser tabs via a shared channel so active student care router sessions update immediately.

## Options considered

### Option 1: Lightweight PIN Authentication with BroadcastChannel Synchronization
- Pros: Friction free for busy dispensers; works offline on local WiFi or cellular; instantaneous cross tab synchronization without server polling overhead.
- Cons: PINs are facility level rather than individual user credentials.

### Option 2: Full Email and Password Firebase or OAuth Flow
- Pros: Individual audit logs per cashier.
- Cons: High sign in friction; easily locked out during connectivity drops; requires heavy cloud auth SDKs.

## Decision

Chosen option: Option 1 (Lightweight PIN Authentication with BroadcastChannel Synchronization). Dispensers at retail counters need speed and reliability above all else.

## Consequences

- Positive: Dispensers update stock in under two seconds; immediate synchronization with student routing views.
- Negative: Facility managers must share the 4-digit PIN among shift workers.
- Neutral: Audit logs record facility level updates rather than personal employee identities.
