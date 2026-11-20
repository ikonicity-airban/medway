# 0013: Clinical Slate and Emergency Amber Visual Tokens

**Status:** Accepted  
**Date:** 2026-11-20

## Context & Problem Statement

MedWay is a pre-triage tool used under high anxiety and physical distress. Low-contrast interfaces or playful pastel themes diminish clarity and readability in outdoor bright sunlight or poorly lit hostel rooms.

## Decision Outcome

Chosen option: "Clinical Slate & Emergency Amber", employing a crisp slate/navy canvas (`#0F172A`), high-contrast body text exceeding WCAG AA (7.5:1+), signal-amber (`#D97706`) for smart auto-reroute notices, emerald (`#059669`) for verified in-stock badges, and crimson (`#DC2626`) for emergency hospital escalation modals.

## Consequences

- **Positive:** High clarity and visual hierarchy under emergency conditions; conforms to strict WCAG 2.2 AA contrast standards.
- **Negative / Trade-offs:** Requires careful color budgeting to avoid visual noise between status badges.

## Considered Options

- Clinical Slate & Emergency Amber (Chosen)
- High-Tech Cyber-Dark (Rejected: Unsuitable for outdoor bright sunlight on campus walkways)
- Soft Editorial Pastel (Rejected: Insufficient contrast ratio for emergency warnings)
