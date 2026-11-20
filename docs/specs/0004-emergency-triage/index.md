# 0004 Emergency Red Flag Triage and Hospital Escalation

**Status**: Accepted
**Date**: 2026-11-20

## Summary

MedWay implements a deterministic emergency safety barrier derived from World Health Organization and Red Cross Community Based Surveillance guidelines. Students experiencing acute danger signs (inability to keep oral fluids down, seizures, respiratory distress, meningism, or severe bleeding) are immediately redirected to 24/7 hospital emergency wards. All retail pharmacy routes and over the counter self medication options are strictly locked out.

## Context

University students frequently underestimate acute complications of cerebral malaria, severe typhoid perforation, or acute bacterial meningitis, attempting to self treat with retail analgesics or teas. MedWay operates under a strict non diagnostic medical safety mandate. The application must identify physiological danger signs deterministically within the first 30 seconds of student interaction and mandate immediate hospital casualty evaluation.

## Requirements

- User story: As a student experiencing sudden high fever, vomiting, and stiff neck, I want the system to warn me immediately that this is an emergency so I do not waste precious time trying to walk to off campus retail drug stores.
- User story: As a campus medical director, I want all students presenting WHO danger signs routed exclusively to the UNN Casualty Bay with a direct phone dialer and physical location instructions.
- AC-1: Toggling any single danger sign from the checklist must immediately set `hasRedFlags: true` and block all retail pharmacy routing.
- AC-2: Selecting a danger sign must trigger the high contrast crimson `EmergencyModal` with 1-tap phone dialers for UNN Medical Centre Emergency Unit (`+2348037704288`) and Bishop Shanahan Specialist Hospital (`+2348035489721`).
- AC-3: The emergency triage screen must provide unambiguous walking and tricycle directions to UNN Casualty Bay (adjacent to Franco Refectory and Nnamdi Azikiwe Library roundabout).
- AC-4: Emergency danger sign state must persist across local navigation until the user explicitly clears the checklist or confirms clinical arrival.
- AC-5: Zero diagnostic predictions, drug recommendations, or dosage instructions may be displayed on the emergency screen.

## Options considered

### Option 1: Deterministic Binary Checklist with Hard Pharmacy Lockout
- Pros: Complete clinical safety; zero hallucination risk; zero clinical liability; immediate sub 5 millisecond state transition.
- Cons: Students with mild symptoms might mistakenly check a severe sign, requiring a clear, simple deselect option.

### Option 2: AI Conversational Symptom Assessment
- Pros: Natural conversational interface.
- Cons: Dangerous latency over slow 2G campus networks; high risk of generative hallucination or misclassifying acute surgical abdomens; prohibited by MedWay safety mandate (ADR-0001, ADR-0005).

## Decision

Chosen option: Option 1 (Deterministic Binary Checklist with Hard Pharmacy Lockout). Deterministic logic guarantees instant safety enforcement with zero network latency.

## Consequences

- Positive: Uncompromising student safety; instant response under zero connectivity; total compliance with medical regulatory guidelines.
- Negative: Restricts students with red flags from viewing pharmacy directories until flags are cleared.
- Neutral: Requires maintaining verified UNN campus emergency telephone numbers.
