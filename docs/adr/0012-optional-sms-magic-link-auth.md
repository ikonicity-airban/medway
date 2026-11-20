# 0012: Optional Phone/SMS Magic Link Authentication

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

While sick students need immediate zero-friction access to emergency screens and routing on Day 1 without mandatory sign-up, returning students with chronic conditions, known drug allergies, or frequent care visits lose their saved allergy profiles and historical intake passes when clearing browser caches or switching devices.

## Decision Outcome

Chosen option: "Optional Phone/SMS Magic Link", keeping the initial routing and pre-triage flow 100% accessible without credentials, but allowing returning students to optionally bind an encrypted profile via SMS OTP/magic-link to persist drug allergy warnings across devices.

## Consequences

- **Positive:** Preserves instant access for emergency care; enables persistent allergy safety across browser wipes; minimal onboarding friction.
- **Negative / Trade-offs:** Requires SMS gateway integration (e.g. Termii or Twilio Nigeria) and rate-limiting infrastructure against SMS toll fraud.

## Considered Options

- Optional Phone/SMS Magic Link (Chosen)
- 100% Ephemeral Local-First (Rejected: Loses allergy history when students clear cookies or switch phones)
- University Student Portal OAuth (Rejected: High login failure rate on campus portal; delays urgent care lookup)
