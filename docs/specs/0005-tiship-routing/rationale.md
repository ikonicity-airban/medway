# 0005 TISHIP Routing and Zero Cost Lock: Rationale

**Status**: In Progress
**Date**: 2026-11-20

## Context

At the University of Nigeria Nsukka, students pay health insurance fees as part of mandatory institutional registration. Despite this, students regularly abandon the clinic because of long queues and travel off campus to Odim Gate or Ogige Market pharmacies. For indigent students who cannot pay commercial pharmacy charges, automated algorithms that optimize solely for wait times create severe financial traps.

## Options considered

### Option 1: Mathematical Hard Lock Priority Boost (+1000 weight)
- Pros: Pure functional computation inside `src/lib/routing-engine.ts`; runs offline in under 1 millisecond; robust against concurrent state mutations.
- Cons: Requires downstream UI to indicate clearly why the clinic is pinned at the top.

### Option 2: Separate Mode Switch Completely Hiding Retail Facilities
- Pros: Complete separation of clinic and commercial directory modes.
- Cons: Decreases student autonomy; if the student arrives at the clinic and finds an unannounced stockout, they cannot see nearby accredited pharmacies without resetting their session.

## Rationale

A mathematical score boost (+1000) guarantees that UNN Medical Centre outranks commercial pharmacies under every queue condition as long as the medication is in stock. It respects student agency by clearly marking the clinic as "Optimal Route (₦0 TISHIP Enrolled)" while preserving alternative pharmacies below for situational awareness.
