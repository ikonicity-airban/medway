# Rationale: Partner Dashboard and Counter Check In Telemetry

## Why Four-Digit PIN Authentication

Counter staff in high volume Nigerian pharmacies handle continuous customer inquiries, cash calculations, and physical stock retrieval. Complex password resets, multi factor authentication SMS codes, or OAuth redirects cause attendants to abandon software tools entirely.

A simple four digit numeric PIN tied to the facility profile provides the optimal balance:
1. It prevents unauthorized walk in students from tampering with facility inventory.
2. It can be typed with one thumb on a mobile screen in less than two seconds.
3. It requires zero cloud identity infrastructure to function locally and offline.

## Consensus Crowd Telemetry Verification

MedWay calculates waiting times through a dual source verification loop:
1. Attendant declared queue levels (primary source of truth).
2. Student arrival tokens (CT-UNN-XXX) scanned or redeemed at the counter.

When an attendant verifies a student's check in code upon arrival, that token is upgraded to verified status, carrying double weight in the consensus queue calculation (`calculateAggregatedQueue`). This prevents bad actors from falsely reporting congestion while ensuring real arrival bursts are reflected in routing scores.
