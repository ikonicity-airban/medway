# 0005: Zero-Cost Gate (TISHIP Hard Lock) for Student Liquidity

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement
Nigerian university students at UNN operate under extreme personal budget constraints. While UNN Medical Centre provides consultations and essential medicines at ₦0 under TISHIP, off-campus community pharmacies require out-of-pocket payment (₦1,500 to ₦4,000+ for ACTs). When the campus clinic is congested, automated rerouting to private pharmacies risks abandoning students who have no cash to pay commercial prices.

## Decision Outcome
Chosen option: "Explicit Zero-Cost Gate (TISHIP Hard Lock)", because students specifying a ₦0 cash budget must never be automatically rerouted to commercial fee-paying pharmacies for non-emergency care, regardless of wait time duration at the campus medical center.

## Consequences
- **Positive:** Protects vulnerable, broke students from being misdirected to commercial retail counters where they cannot afford care; aligns strictly with TISHIP mandate.
- **Negative / Trade-offs:** Students with ₦0 budget must endure long clinic queues when the campus clinic is congested, with MedWay focusing on optimal arrival timing rather than off-campus rerouting.

## Considered Options
- Explicit Zero-Cost Gate (TISHIP Hard Lock) (Chosen)
- Transparent Cost Warning with Distance/Price Matrix (Rejected: Puts cognitive burden on sick students who may still travel off-campus assuming credit is extended)
- Auto-Reroute to Lowest-Cost Subsidized Partner (Rejected: UNN student union voucher subsidies do not exist at scale)
