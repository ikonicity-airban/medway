# 0010: Physical Verification and Credential Onboarding for Pharmacies

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

Unregulated patent medicine dealers frequently operate around Nigerian university campus gates. Allowing unverified entities into the routing engine introduces health risks for students seeking authentic antimalarials and antibiotics.

## Decision Outcome

Chosen option: "Physical Verification & Admin PIN Provisioning", requiring MedWay founders to physically inspect Odim, Hilltop, and Ogige pharmacy premises, verify current Pharmacy Council of Nigeria (PCN) registration certificates, and issue secure one-time activation PINs for portal access.

## Consequences

- **Positive:** High trust barrier; 100% genuine PCN accreditation; protects student health and shields platform from regulatory liability.
- **Negative / Trade-offs:** Geographic scaling bottleneck requiring physical inspection per new campus cluster.

## Considered Options

- Physical Verification & Admin PIN Provisioning (Chosen)
- Self-Service Portal with PCN Document Upload (Rejected: High risk of forged certificates and automated fraud)
- Community-Vetted Registry (Rejected: Students cannot legally assess PCN pharmacist licensure standards)
