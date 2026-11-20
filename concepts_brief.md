# MedWay: Campus Care Router & Pre-Triage System

* **Author:** ikonicity-airban (Aniagu Chiemela Camilius & Co-Founder)
* **Date:** 2026-11-20

## Overview

MedWay is an offline-resilient care routing and pre-triage system engineered for Nigerian tertiary institutions, piloted at the University of Nigeria, Nsukka (UNN). The system screens students for emergency danger signs using a deterministic WHO/Red Cross checklist, routes non-urgent students between the campus medical centre (TISHIP-covered at ₦0) and verified community pharmacies (Odim, Hilltop, Ogige), and generates a scannable Digital Pre-Visit Intake Pass. Telemetry combines transactional counter proof with a 100% free pharmacy network, monetized strictly through institutional population health analytics sold to TISHIP HMO syndicates and university health administrators.

## Analysis

### 1. Inherent System Contradictions & Resolved Trade-Offs

* **Crowd Reporting Incentive vs. Telemetry Freshness:**
  * *Contradiction:* Voluntary crowd reports decay rapidly due to low student participation, while commercial pharmacies risk falsely reporting stock to lure foot traffic.
  * *Resolution (ADR-0004):* Replaced unverified crowd polling with transactional counter check-in tokens. Telemetry updates automatically when student passes are presented at participating counters; unverified crowd reports decay on a 30-minute half-life.
* **Clinic Congestion Rerouting vs. Extreme Student Cash Constraints:**
  * *Contradiction:* When UNN Medical Centre experiences a 2-hour queue rush, routing students off-campus to commercial pharmacies requires ₦1,500 to ₦4,000+ for medications, stranding students with zero cash.
  * *Resolution (ADR-0005):* Implemented the TISHIP Hard Lock. Students specifying a ₦0 cash budget are never rerouted away from the campus clinic for non-emergencies, ensuring zero-cash students are protected.
* **Narrow Triage Safety vs. False Clinical Reassurance:**
  * *Contradiction:* A 4-item checklist leaves severe acute conditions unflagged (severe abdominal pain, acute bleeding, or trauma), creating false reassurance if labeled "cleared".
  * *Resolution (ADR-0006):* Expanded emergency screening to include "Severe Acute Pain or Uncontrolled Bleeding" and added prominent disclaimers establishing that routing is purely logistical, not a clinical clearance.
* **Paper Clinic Triage vs. Digital Intake Passes:**
  * *Contradiction:* Overburdened clinic nurses operating on paper registries will not adopt tablets or QR scanners.
  * *Resolution (ADR-0007):* Formatted the intake pass as a high-contrast student self-advocacy checklist. The student presents or reads their allergy and symptom summary to the nurse directly, requiring zero staff technology adoption.
* **Monetization Ethics vs. Impartial Routing:**
  * *Contradiction:* Charging pharmacies for priority placement distorts fair routing and exploits sick students.
  * *Resolution (ADR-0003, ADR-0011):* Established a 100% free pharmacy network with physical PCN vetting. Monetization comes exclusively from aggregated, anonymized population health intelligence sold to HMOs and university authorities.

## Goals vs. Non-Goals

### In-Scope Goals
* **Deterministic Emergency Escalation (G1):** 100% deterministic redirection to 24/7 emergency facilities (UNN Emergency Bay and Bishop Shanahan Hospital) whenever any emergency indicator is selected.
* **TISHIP-Preserving Logistics Routing (G2):** Facility ranking factoring in confirmed inventory, queue congestion, and the TISHIP Hard Lock for students with ₦0 budget.
* **Zero-Hospital-IT Telemetry (G3):** Functional operation using student counter tokens and partner status toggles without electronic medical record dependencies.
* **Student Self-Advocacy Intake Pass (G4):** Generation of a high-contrast, offline-accessible summary slip (`MW-UNN-XXX`) detailing declared allergies, duration, and care category.
* **Offline PWA Resilience (G5):** Complete client-side functionality with Workbox service worker caching, IndexedDB persistence, and Supabase Realtime synchronization.

### Out-of-Scope Non-Goals
* **Clinical Medical Diagnosis (NG1):** No automated disease naming, LLM diagnosis, or drug prescription.
* **Direct Hospital EMR Integration (NG2):** No real-time reads or writes to hospital folder archives.
* **In-App Payments and Drug Courier Logistics (NG3):** No wallet escrow, bank payment processing, or dispatch delivery.
* **Mandatory Student KYC Gate (NG4):** No mandatory login required to access emergency triage or routing.

## Alternatives Weighed

* **Generative AI Chatbot Triage:** Rejected due to clinical hallucination risk, malpractice liability, and network failure modes during campus outages (ADR-0001).
* **Direct Hospital EMR Integration on Day 1:** Rejected due to reliance on paper folder archives and 6 to 12 month institutional approval delays (ADR-0002).
* **Pharmacy SaaS Priority Placement Fees:** Rejected because sponsored placement distorts fair routing and introduces ethical conflicts of interest (ADR-0003, ADR-0011).
* **100% Ephemeral Local Storage Without Optional Sync:** Rejected because returning students with severe drug allergies lose critical safety records when switching devices or clearing browser caches (ADR-0012).
* **Single Campus Clinic Emergency Routing:** Rejected to avoid single-point-of-failure risks during campus labor strikes or power outages, adding Bishop Shanahan Hospital as an off-campus 24/7 backup (ADR-0014).

## Key Decisions & Staging for Next Steps

* **Settled Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Supabase + Workbox PWA (ADR-0008).
* **Settled Visuals:** Clinical Slate & Emergency Amber design tokens with WCAG AA compliance (ADR-0013).
* **Next Step:** Generate the full engineering workflow context suite (`AGENTS.md`, `CLAUDE.md`, `design.md`, `docs/scope/scope.md`, `docs/specs/`, `docs/context/`) to enable `/develop` and `/check` execution.
