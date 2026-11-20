# Design Plan 0001: MedWay UI Architecture and Design Pattern Redesign

## Design Language
- Audited surface: MedWay Student Care Router, Emergency Pre Triage, Partner Portal, and Telemetry Feed
- Design sources: [design.md](file:///c:/Users/user-pc/CodeOven/AISEC/design.md), [AGENTS.md](file:///c:/Users/user-pc/CodeOven/AISEC/AGENTS.md), Coss UI specification, Typography Mastery, Smooth Transitions
- Documented decisions: Clinical slate neutrals, strict non diagnostic boundary, 48px touch floor, 2px visible focus ring, zero pulsing elements, no pill wrapped titles
- Governing owners and consumers: `src/components/ui/`, `src/features/router/`, `src/features/triage/`, `src/features/partner/`, `src/features/telemetry/`
- Explicit exceptions: None documented

## Findings

| # | Problem | Evidence | Proposed change | Scope | Confidence |
|---|---|---|---|---|---|
| 1 | AI Marker: Variant colored rainbow icons scattered arbitrarily across cards | Icons across `app-header.tsx`, `router-view.tsx`, `telemetry-view.tsx` use disparate colors (`text-error`, `text-warning`, `text-success`, `text-accent`, `text-emerald-600`, `text-amber-600`) | Standardize all icons to use uniform neutral tones (`text-muted` or `text-ink`) with functional color strictly restricted to status dots and primary emergency triggers | High | High |
| 2 | AI Marker: Translucent, washed out backgrounds (`/10`, `/40`, `backdrop-blur`) creating visual muddy artifacts | Backgrounds like `bg-error/10`, `bg-warning/10`, `bg-success/10`, `bg-surface/95` dilute text contrast and look like generic AI generated mockups | Replace with solid clinical slate surfaces (`bg-surface`, `bg-canvas`), crisp 1px solid hairline borders (`border-border`), and high contrast typography | High | High |
| 3 | Scattered layout with 8 disconnected floating card sections lacking cohesive design flow | `RouterView` renders category selector, budget gate, allergy declaration, reroute alert, TISHIP lock, and facility cards as separate isolated cards floating vertically | Consolidate triage inputs into a unified, multi segment **Triage Command Console** card with fluid typography, sliding segment tabs, and seamless contextual feedback | High | High |

## Improve First

Consolidate the scattered triage inputs into a unified, high typographic discipline Triage Command Console in `src/features/router/` while replacing all translucent colored backgrounds and variant colored icons with solid clinical slate tokens and monochromatic icon hierarchy.
