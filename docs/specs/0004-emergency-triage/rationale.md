# 0004 Emergency Red Flag Triage: Rationale

**Status**: In Progress
**Date**: 2026-11-20

## Context

In university dormitories and student hostels around Nsukka, students suffering from severe medical complications often attempt to self medicate due to fear of clinic wait times or financial worries. In conditions like cerebral malaria or sepsis, a delay of two hours can result in permanent neurological damage or mortality. An automated safety barrier must prevent self navigation to retail shops when acute danger signs exist.

## Options considered

### Option 1: Deterministic Binary Checklist with Hard Pharmacy Lockout
- Pros: Immediate visual feedback; deterministic testability; zero risk of AI diagnostic drift; works 100% offline.
- Cons: Conservative routing may direct borderline cases to the hospital casualty ward.

### Option 2: Multi Tier Risk Scoring Model
- Pros: Calculates graded probability scores (low, medium, high).
- Cons: Ambiguous middle tier ("medium risk") creates student decision paralysis under acute panic; introduces dangerous liability if a borderline septic case is labeled low risk.

## Rationale

Under emergency medical protocols, safety requires binary clarity: either the patient exhibits zero danger signs and can proceed to non emergency care navigation, or they exhibit at least one danger sign and must be directed to hospital casualty immediately. Binary checklist evaluation satisfies AC-1 and AC-2 without cognitive hesitation.
