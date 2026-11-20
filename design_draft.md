# Chowlin AI

*   **Author:** ikonicity-airban
*   **Status:** Draft
*   **Date:** 2026-11-20

--------------------------------------------------------------------------------

## Overview

Chowlin AI is a student nutrition and micro-budgeting platform designed for tertiary institutions in Nigeria, starting with the University of Nigeria, Nsukka (UNN). It addresses the intersection of severe food inflation (~35-40%+) and student health by calculating nutritional deficits from whatever staples a student currently has in their hostel room, determining the exact minimum top-up in Nigerian Naira (₦) required to close the gap, and scheduling meals to prevent peptic ulcers.

The system incorporates multimodal vision for scanning lodge staples and bank transfer debit alerts, a deterministic nutritional deficit calculator mapped against local market prices (such as Ogige Market and campus kiosks), crowdsourced price tracking, and hostel co-op bulk buying. The project is aligned with UN Sustainable Development Goals (SDG 1: No Poverty, SDG 2: Zero Hunger, SDG 3: Good Health and Well-being, and SDG 12: Responsible Consumption and Production) and designed for deployment through student-led organizations such as AIESEC.

## The Problem

Nigerian university students face escalating living costs and food prices, leading to widespread practice of the "0-1-0" or "0-0-1" meal formula (skipping one or two meals daily). At UNN, students frequently endure long academic schedules (8:00 AM to 4:00 PM) with empty stomachs, resulting in chronic fatigue, diminished academic performance, and an increasing incidence of gastric ulcers.

Existing nutrition and budgeting applications fail in this environment because:
1. They assume access to formal supermarkets with printed itemized receipts and barcodes, whereas UNN students shop in open markets (such as Ogige Market) or roadside kiosks using cash and mobile transfers (Opay, PalmPay).
2. They prescribe aspirational, unaffordable diets (e.g., fresh salmon, Greek yogurt, avocado) rather than working with local staples (garri, brown beans, eggs, Titus fish, indomie, ugwu).
3. They function solely as passive expenditure loggers or generic calorie counters without connecting financial balance directly to metabolic requirements or offering collective buying mechanisms.

## Goals

*   **Goal 1: Algorithmic Diet Top-Up Optimization**: Calculate the exact macronutrient (protein, calorie) and micronutrient (iron) deficits based on available hostel pantry items and determine the lowest-cost local food purchase in Naira (₦) to reach 100% daily nutritional sufficiency.
*   **Goal 2: Ulcer Defense and Meal Cadence Scheduling**: Generate actionable eating schedules that prevent extended fasting intervals (>6 hours) during lecture blocks, recommending low-cost, energy-dense snacks (e.g., groundnuts, boiled eggs, bananas).
*   **Goal 3: Localized Multimodal Input**: Enable pantry intake via smartphone camera photos of unbranded food items, screenshots of bank transfer debit alerts (Opay, PalmPay, Kuda), and quick-tap selectors using Nigerian trade units (derica, paint rubber, cup, crate).
*   **Goal 4: Community Price Transparency (Nsukka Market Watch)**: Provide a crowd-sourced pricing feed for campus gates and Ogige Market to empower students with verified current market rates.
*   **Goal 5: Hostel Bulk-Buying Coordination**: Support micro-pooling contracts enabling hostel roommates (e.g., Franco, Hilltop, Alvan) to jointly purchase bulk quantities (crates of eggs, bags of beans) and reduce unit food costs by 30-40%.

## Non-Goals

*   **Non-Goal 1: Direct In-App Payment Settlement or Custodial Escrow**: Chowlin AI will not hold money, process bank transfers directly, or act as a payment gateway in the MVP. Students settle payments peer-to-peer via existing banking apps (Opay, Moniepoint) or cash; the app handles only coordination and ledger tracking.
*   **Non-Goal 2: Clinical Medical Diagnosis**: The app does not diagnose active peptic ulcer disease, malaria, or typhoid. It provides preventive lifestyle scheduling and nutritional risk alerts only.
*   **Non-Goal 3: Real-Time Commercial Logistics / Food Delivery**: Chowlin AI is not a restaurant delivery platform (like Chowdeck or Glovo). It directs students to cook or purchase raw staples from physical campus stores and local markets.
*   **Non-Goal 4: Native Mobile App Store Binaries**: Native iOS and Android builds (App Store/Play Store) are out of scope for the hackathon MVP; execution is strictly a mobile-responsive Progressive Web App (PWA).

## Open Questions

*   **Question 1**: How frequently should crowdsourced market prices decay if no student verifies an Ogige Market item within a 48-hour window during high-inflation weeks?
*   **Question 2**: For students with severe lactose intolerance or specific allergies, how should fallback protein substitutes be prioritized when eggs or groundnuts are unavailable?

## Critical User Journeys (CUJs)

### CUJ 1: The Broke Student ₦400 Top-Up Rescue
*   **Given**: A student at Franco Hostel has 2 cups of white garri and 1 sachet of noodles in their room, an Opay balance of ₦500, and an ulcer risk flag enabled.
*   **When**: The student snaps a photo of their table staples and inputs their remaining ₦500 balance into Chowlin AI.
*   **Then**: The app identifies a 32g protein deficit, calculates that buying 1 boiled egg (₦200) and ₦150 roasted groundnuts at the hostel gate closes 90% of the protein gap for ₦350 (leaving ₦150 buffer), and sets a reminder to consume half the portion before a 2:00 PM lecture to prevent stomach acid build-up.

### CUJ 2: Hostel Roommate Bulk Pool
*   **Given**: Four students residing in Hilltop Lodge want to reduce food expenditure on eggs.
*   **When**: One student initiates an "Egg Crate Pool" on Chowlin AI with a target of ₦4,800 (₦1,200 each for 7.5 eggs per person, vs ₦200 per egg individually).
*   **Then**: The app generates a share link; as roommates mark their commitment, the status updates to 100%, generates a consolidated shopping list for Ogige Market, and records an estimated savings of ₦800 per student.


--------------------------------------------------------------------------------

## Technical Plan (Architecture)

Chowlin AI employs a decoupled, edge-optimized architecture designed for high availability over mobile data networks in Nigerian university campuses. The architecture separates visual ingestion and AI recipe generation from mathematical nutritional deficit calculation.

```text
+------------------------------------------------------------------------------------+
|                                 CLIENT TIER (PWA)                                  |
|  - Next.js 15 (App Router) + Tailwind CSS + Lucide React                           |
|  - Service Worker Cache (Workbox) + IndexedDB Demo Fixtures                        |
|  - Multi-input View: Camera Snapshot / Opay Screenshot / Quick-Tap Chips / Audio   |
+------------------------------------------+-----------------------------------------+
                                           | HTTPS / JSON
                                           v
+------------------------------------------------------------------------------------+
|                               SERVERLESS API TIER                                  |
|                                                                                    |
|  +-----------------------+   +------------------------+   +----------------------+ |
|  |   /api/pantry/scan    |   |  /api/diet/top-up      |   |  /api/meals/generate | |
|  |  (Vercel AI SDK Vision|   | (Deterministic Solver) |   |  (Structured Zod LLM | |
|  |    + Gemini Flash)    |   |                        |   |     + Pidgin Mode)   | |
|  +-----------+-----------+   +-----------+------------+   +----------+-----------+ |
+--------------|---------------------------|---------------------------|-------------+
               |                           |                           |
               v                           v                           v
+------------------------------------------------------------------------------------+
|                                 DATA & PERSISTENCE                                 |
|                                                                                    |
|  +-------------------------------------+   +------------------------------------+  |
|  |       Supabase PostgreSQL           |   |       Supabase Storage             |  |
|  | - staples (Nutritional & Price Ref) |   | - pantry-uploads (Private bucket)  |  |
|  | - market_prices (Crowd votes)       |   | - receipt-screenshots              |  |
|  | - bulk_pools (Hostel pooling)       |   +------------------------------------+  |
|  +-------------------------------------+                                           |
+------------------------------------------------------------------------------------+
```

### 1. Client Layer (PWA & Offline Resilience)
*   **Framework**: Next.js 15 App Router running React 19.
*   **PWA Configuration**: Manifest and service worker registered via `@ducanh2912/next-pwa`. Caches shell assets and core UI bundles for instant loading.
*   **Offline / Low-Bandwidth Mode**: Includes pre-seeded local JSON fixtures representing three verified student scenarios (Franco Hostel Sunday, Hilltop Exam Week, Ogige ₦5,000 Market Haul). If network requests to Vercel/Supabase fail or exceed a 4-second timeout, the client falls back to client-side deterministic evaluation with a visual toast indicating offline mode.

### 2. Ingestion & Multimodal Vision Pipeline
*   **Endpoint**: `POST /api/pantry/scan`
*   **Mechanism**: Accepts `multipart/form-data` containing an image blob (from camera or screenshot) and an optional mode flag (`pantry` or `bank_alert`).
*   **Execution**:
    *   Images are processed using Google Gemini Flash via the Vercel AI SDK (`generateObject` with Zod schema).
    *   For `pantry` mode, the model extracts visible unbranded staples and estimates quantities mapped against standardized Nigerian units (e.g., `garri: 2 cups`, `eggs: 1 piece`, `indomie: 1 sachet`).
    *   For `bank_alert` mode, OCR extracts the available balance figure and date timestamp to prevent using outdated screenshots.

### 3. Deterministic Macro Deficit & Price Solver Engine
*   **Location**: `lib/nutrition-engine.ts` (Edge-compatible TypeScript module).
*   **Design Decision**: LLMs are strictly forbidden from performing arithmetic deficit calculations or pricing lookups to eliminate numerical hallucinations.
*   **Algorithm**:
    1.  *Target Determination*: Reads user profile targets: Daily Calories ($C_{req}$), Daily Protein ($P_{req}$ in grams), and Ulcer Flag.
    2.  *Current Inventory Value*: Sums nutrient values of scanned pantry items from the `staples` master table:
        $$P_{current} = \sum (Q_i \times \text{protein}_i), \quad C_{current} = \sum (Q_i \times \text{calories}_i)$$
    3.  *Deficit Calculation*:
        $$\Delta P = \max(0, P_{req} - P_{current}), \quad \Delta C = \max(0, C_{req} - C_{current})$$
    4.  *Minimum Top-Up Knapsack Optimizer*: Evaluates available staples in the local market table (`market_prices` filtered by campus location, e.g., Ogige Market or Hilltop). Finds the minimal subset of purchase items $S$ satisfying:
        $$\min \sum_{j \in S} \text{Price}_j \quad \text{subject to} \quad \sum_{j \in S} \text{Protein}_j \ge \Delta P \quad \text{and} \quad \sum_{j \in S} \text{Price}_j \le \text{UserBudget}$$
    5.  *Output Payload*: Returns exact deficit metrics, target staple additions, required extra expenditure ($\Delta ₦$), and remaining financial buffer.

### 4. Recipe Generation & Ulcer Cadence Coach
*   **Endpoint**: `POST /api/meals/generate`
*   **Mechanism**: Consumes the output of the deterministic solver (combined existing pantry + recommended top-up items). Calls Gemini Flash with a structured output schema to return:
    *   Step-by-step cooking preparation adapted to hostel cooking equipment (single-burner gas stove or electric hotplate).
    *   Language toggle support: Formal English or authentic Nigerian Pidgin.
    *   Meal Timing Schedule: Recommends specific consumption times (e.g., 8:00 AM breakfast snack, 1:30 PM lunch fuel, 7:30 PM dinner) with explicit warnings against fasting intervals exceeding 5 hours for students flagged as ulcer-prone.

### 5. Nsukka Market Watch & Community Consensus
*   **Endpoints**: `GET /api/market/prices`, `POST /api/market/report-price`
*   **Mechanism**: Students report prevailing prices for staples at specific locations (Ogige Market, Franco Gate, Hilltop, Odenigwe). Each report requires selecting staple, location, price in Naira, and local unit. Other students upvote or downvote accuracy. Prices display an active confidence score based on vote count and report recency (linear decay over 7 days).

### 6. Data Architecture (Supabase PostgreSQL)
*   **Tables**:
    *   `staples`: Master nutritional index (calories, protein, iron, ulcer safety).
    *   `market_prices`: Crowdsourced pricing records with location tags and vote counters.
    *   `student_diet_profiles`: Student settings, budget constraints, ulcer indicators.
    *   `bulk_pools`: Active pooling initiatives across campus hostels.
*   **Storage**: Supabase Storage bucket `pantry-uploads` configured with public read disabled and 24-hour automatic lifecycle deletion for raw camera images to protect student privacy.
