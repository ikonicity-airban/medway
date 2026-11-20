---
name: clinical-slate-design-system
source: derived
character: "Clinical slate and emergency amber interface engineered for high glare Nigerian campus environments. Authoritative slate neutrals guarantee maximum contrast under bright midday sunlight, crimson highlights demand immediate emergency action, and warm amber banners direct students through automatic stockout reroutes."
tokens: "real values live in _place-after-scaffold/tokens.css and src/app/globals.css"
contrast: "light body on canvas 9.98:1, light ink on canvas 17.2:1, light on-accent on accent 5.48:1; dark body on canvas 13.17:1, dark ink on canvas 18.69:1, dark on-accent on accent 5.7:1"
---

## Build mandate

You are a senior healthcare product designer. Every page must ship complete with authentic clinical triage copy, structured visual hierarchy, and complete operational states (empty, loading, and error). You must never deliver a lone form floating on an empty screen. Support every input with contextual triage help and clear, actionable next steps.

## Character & direction

MedWay uses a calm, authoritative, high contrast clinical tone calibrated for sick students at the University of Nigeria Nsukka (UNN). The color system uses clinical slate neutrals for maximum legibility in outdoor sunlight. Crimson `#B91C1C` is reserved exclusively for emergency danger signs and hospital escalation. Warm amber `#B45309` highlights auto reroute notices and moderate queue congestion. Emerald `#047857` indicates available stock and zero cost TISHIP coverage. Surfaces use clean hairline borders rather than heavy blur shadows.

## Composition patterns

The layout uses a mobile first column grid that adapts smoothly across mobile viewports and desktop terminals. On mobile screens, content stacks in a single column with a fixed, thumb friendly 64px bottom action area. Touch targets are generous (minimum 48px by 48px) to accommodate trembling hands or feverish students.

Triage screen layouts follow a consistent vertical rhythm:

1. Top status bar with campus location (UNN Nsukka), offline sync status indicator, and 24/7 emergency hotline button.
2. Emergency red flag banner: high contrast danger sign warning with instant hospital dialer.
3. Student care category selector: Antimalarials, Analgesics, Typhoid tests, ORS hydration.
4. Triage routing card stack: UNN Medical Centre (TISHIP locked) followed by accredited community pharmacies with real time stock and queue badges.

## Component & usage rules (do's and don'ts)

- Do use crimson accent strictly for true medical emergencies (WHO red flag danger signs, casualty escalation).
- Do use hairline 1px borders (`#E2E8F0` light, `#334155` dark) to separate facility cards and queue rows.
- Do present prices in Nigerian Naira with the symbol `₦` followed by comma grouped digits (example: ₦1,500).
- Do display facility distance in meters with walking time estimates (example: 400m, 6 min walk).
- Never use `animate-pulse` or pulsing placeholder skeletons anywhere in the app. Use solid neutral loading skeletons with subtle fade transitions instead.
- Never wrap section titles in pill badges or rounded chips. Keep titles as clean semantic headings.
- Never show medical diagnostic predictions or drug dosage instructions. MedWay is strictly a navigation and care routing guide.

## Responsive & accessibility direction

The interface strictly respects WCAG 2.2 AA accessibility standards. All interactive elements have an active focus ring of 2px with at least 3:1 contrast against surrounding surfaces. Touch targets on buttons and triage option items are at least 48px by 48px. Color is never the sole indicator of state; queue indicators pair color swatches with explicit text labels ("Low Queue: <15 min", "Moderate: 15-45 min", "High: >45 min"). Text scale uses a 16px base with 1.200 minor third ratio to keep clinical labels readable without horizontal scrolling.
