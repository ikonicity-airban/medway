# 0007 Student Self Advocacy Intake Pass

**Status**: Accepted
**Date**: 2026-11-20

## Summary

The Student Self Advocacy Intake Pass provides a structured, high contrast digital slip that empowers university students to present their care category, TISHIP eligibility, and declared drug allergies clearly to clinic nurses or community pharmacists. This specification establishes the pass layout, allergy declaration flow, zero dependency SVG QR code rendering, one click plain text clipboard export, and offline IndexedDB persistence.

## Context

Nigerian tertiary students often experience intimidation and communication friction when presenting at university medical centres or busy commercial pharmacy counters. In stressful clinic environments, critical patient context such as severe penicillin allergies or previous adverse reactions is routinely forgotten or overlooked by hurried attendants. Furthermore, unreliable mobile data connectivity on campus prevents students from loading cloud based health portals. MedWay solves this by generating an offline persistent, high contrast intake pass (MW-UNN-XXX) stored locally in browser storage that students can show directly on their phone screen or copy as plain text into SMS or WhatsApp.

## Requirements

- User story: As a student arriving at the UNN Medical Centre or Odim Gate Pharmacy, I want to present a clear digital intake pass with my care category and drug allergies highlighted in bold contrast so the attendant dispenses safe medication without misunderstanding.
- User story: As a student without mobile internet, I want my pass saved in local offline storage so I can open it at the clinic counter even in airplane mode.
- AC-1: The intake pass must display the canonical pass code format (MW-UNN-XXX), target facility name, care category, timestamp, and TISHIP coverage badge.
- AC-2: The allergy declaration interface must provide one tap selection for common student drug allergies (No known allergies, Penicillin, Sulfa drugs, NSAIDs or Aspirin) plus a free text input field.
- AC-3: Passes with declared allergies must render an amber safety alert container with clear guidance instructing the attendant to confirm allergy history before administering care.
- AC-4: An interactive SVG QR code or scannable token matrix must render cleanly without requiring external network CDNs or third party tracking scripts.
- AC-5: A copy slip button with at least 48px touch height must copy a formatted plain text summary to the system clipboard and trigger a confirmation toast.
- AC-6: All generated intake passes must persist into local IndexedDB storage and remain retrievable through the direct route /pass/[code].

## Options considered

### Option 1: Native Vector SVG Matrix Rendering
- Pros: Zero external runtime dependencies; zero network latency; full offline compatibility; sharp rendering across all mobile screen densities.
- Cons: Requires custom matrix calculation or lightweight inline vector generator.

### Option 2: Heavy Client Side Canvas QR Library
- Pros: Automated binary encoding.
- Cons: Increases bundle size; prone to canvas taint and accessibility screen reader limitations.

## Decision

Chosen option: Option 1 (Native Vector SVG Matrix Rendering). It guarantees 100% offline functionality, crisp vector display on OLED mobile displays under bright tropical sunlight, and zero third party dependencies.

## Consequences

- Positive: Total student autonomy; zero PII leakage to cloud databases; complete offline resilience during campus network blackouts.
- Negative: Students must remember their device or keep their screen awake while waiting in queue.
- Neutral: Attendants use manual 4-character pass codes if their optical counter scanners are offline.
