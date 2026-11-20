# Project Overview

## Overview
MedWay is a campus healthcare logistics router and pre-triage web platform built for tertiary institutions in Nigeria, piloted at the University of Nigeria Nsukka (UNN). It connects sick students to appropriate care destinations within 30 seconds while eliminating avoidable clinic queue delays.

## Core value
MedWay resolves the blind multi-hour clinic queue bottleneck on university campuses. By providing deterministic emergency danger sign screening, real time stock availability across essential care categories, and a student self-advocacy intake pass, it empowers students to access care safely without falling victim to unverified self-medication.

## Pages and routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Student care router, danger sign checklist, and intake pass generator | Public |
| `/emergency` | Urgent hospital escalation view with 24/7 facility contacts and 1-tap dialer | Public |
| `/partner` | Partner pharmacy and clinic attendant portal for inventory and queue toggles | PIN Authenticated |
| `/analytics` | Aggregated institutional population health telemetry and stockout trends | Enterprise Authenticated |

## Navigation
The student flow operates within a focused single-column mobile view with a persistent top app bar (56px) displaying the platform title, connectivity indicator, and emergency hotline quick dial button. The partner portal features a responsive tab bar switching between Facility Controls, Counter Scanner, and Demand Feed.

## Core user flows

### Flow 1: Emergency danger sign escalation
1. A sick student opens MedWay on their mobile phone.
2. The student reviews the emergency checklist and selects a danger sign (for example, difficulty breathing or severe acute pain).
3. The interface immediately hides pharmacy options and renders the emergency hospital escalation view with direct contact numbers for UNN Emergency Bay and Bishop Shanahan Specialist Hospital.

### Flow 2: TISHIP routing and intake pass generation
1. A student with mild fever checks zero danger signs, enters known drug allergies, and selects budget ₦0 (Free via TISHIP).
2. The routing engine confirms UNN Medical Centre has antimalarials in stock and ranks it first.
3. The student taps Generate Digital Intake Pass to produce pass code MW-UNN-XXX with a QR token and clipboard copy summary.

### Flow 3: Real time clinic stockout reroute
1. A student searches for antimalarials with TISHIP preference selected.
2. The campus clinic stock is marked out of stock by clinic attendants or verified student check-in reports.
3. The routing engine renders an amber auto reroute notice explaining the stockout and ranks the nearest accredited off-campus pharmacy first.

### Flow 4: Partner inventory toggle and token redemption
1. A partner pharmacy attendant opens `/partner` and enters their secure PIN.
2. The attendant toggles antimalarials or analgesics to out of stock when inventory depletes.
3. When a student arrives, the attendant scans the intake pass token to verify attendance and validate real time queue telemetry.

## In scope (MVP)
- Deterministic emergency danger sign checklist (5 key criteria).
- Real time facility scoring engine with TISHIP Hard Lock for ₦0 budget students.
- Digital pre-visit intake pass generator with SVG QR code and plain text export.
- Partner inventory and queue status toggle portal.
- Offline service worker shell with local IndexedDB caching.

## Out of scope
- Automated clinical medical diagnosis or prescription recommendations.
- In-app payment processing or bank transfer gateways.
- Integration with institutional hospital paper folder registries.
- Mandatory student identity verification or KYC sign-up gates.

## Data ownership rules
- Student allergy notes and generated pass codes are stored locally in the browser and transmitted only when presenting a token.
- Public directory records for facilities and stock categories are managed exclusively by accredited administrators and verified partner attendants.
- Aggregated telemetry records contain strictly anonymized search counts and zero student personal identifiers.

## Analytics events

| Event name | Trigger | Key properties |
|---|---|---|
| `danger_sign_triggered` | Student checks one or more red flag boxes | `symptom_category`, `timestamp` |
| `route_calculated` | Facility ranking engine returns sorted destinations | `care_category`, `budget_selected`, `top_facility_id` |
| `auto_reroute_displayed` | Clinic stockout prompts reroute to off-campus partner | `care_category`, `reason`, `alternate_facility_id` |
| `intake_pass_generated` | Student clicks generate pass button | `pass_code`, `facility_id`, `has_allergies` |
| `counter_token_redeemed` | Partner attendant scans student check-in token | `token_code`, `facility_id`, `queue_reported` |

## Success criteria
- Less than 5 seconds from opening the application to receiving an emergency escalation or care destination route.
- 100% deterministic lockout of retail pharmacies whenever an emergency danger sign is present.
- Zero students with ₦0 budget misdirected to fee paying commercial pharmacies during campus clinic congestion.
