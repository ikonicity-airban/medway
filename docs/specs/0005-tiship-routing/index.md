# 0005 TISHIP Routing and Zero Cost Lock

**Status**: Accepted
**Date**: 2026-11-20

## Summary

MedWay enforces a non negotiable TISHIP Hard Lock for Nigerian university students with zero disposable budget. Enrolled students at the University of Nigeria Nsukka pay mandatory healthcare capitation and are entitled to zero cost consultation and essential medications at the UNN Medical Centre. This specification details the mathematical scoring logic, budget gate interface, and routing invariants that prevent economically vulnerable students from being redirected to private commercial pharmacies.

## Context

Federal university undergraduates in Nigeria routinely experience extreme financial precarity. Commercial pharmacies charge between ₦1,500 and ₦3,500 for artemisinin combination therapy (ACT) or lab tests. When automated care routers prioritize commercial facilities based purely on short queue times, cash strapped students face unexpected out of pocket bills or abandon treatment altogether. MedWay must guarantee that students with zero budget are routed to the on campus clinic whenever essential stock is available.

## Requirements

- User story: As an indigent student with zero Naira in my account, I want the router to keep UNN Medical Centre at the top of my list regardless of queue congestion so I never walk to a pharmacy I cannot afford.
- User story: As a student with disposable funds who values speed, I want the option to toggle to fast retail routing so I can purchase medication near my hostel gate without waiting in long clinic lines.
- AC-1: The budget gate interface must offer two explicit choices: "₦0 TISHIP Coverage (On Campus)" and "Fast Retail Care (Off Campus, ₦1,000 - ₦3,500)".
- AC-2: When budget is set to ₦0, the mathematical routing score for UNN Medical Centre must receive a hard lock weight of +1000 whenever the requested category is in stock.
- AC-3: High queue congestion at the campus clinic must never cause a private commercial pharmacy to outrank UNN Medical Centre when the student selects ₦0 budget.
- AC-4: The care category selector must restrict choices strictly to the four canonical categories: Antimalarials (ACT), Analgesics & Fever, Typhoid / Lab Test, and ORS & Hydration.
- AC-5: Zero diagnostic predictions or dosage instructions are permitted in the care router views.

## Options considered

### Option 1: Mathematical Hard Lock Priority Boost (+1000 weight)
- Pros: Simple, pure functional calculation; deterministic testability; effortlessly overrides queue penalties while retaining facility sorting.
- Cons: Requires an explicit stock check to avoid locking students to a clinic with zero medication stock.

### Option 2: Hard Database Query Filter Excluding Commercial Facilities
- Pros: Eliminates non clinic facilities entirely from the SQL result set.
- Cons: Prevents the student from seeing alternative options as backup references if the campus clinic is out of stock.

## Decision

Chosen option: Option 1 (Mathematical Hard Lock Priority Boost with Stock Verification). It keeps the campus clinic pinned at rank 1 while allowing downstream partner pharmacies to remain visible as backup options.

## Consequences

- Positive: Total economic protection for low income students; strict adherence to institutional TISHIP mandates.
- Negative: Students with ₦0 budget may experience longer wait times during peak Monday morning clinic rushes.
- Neutral: Requires students to declare their budget preference before final facility selection.
