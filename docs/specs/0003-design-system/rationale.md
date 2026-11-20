# 0003 Design System and UI Foundation: Rationale

**Status**: Accepted
**Date**: 2026-11-20

## Context

Undergraduate students at Nigerian university campuses use mobile devices in intense midday sunlight while walking between hostels and lecture halls. When feeling ill, cognitive processing is impaired and attention is fragmented. The design system must provide instant visual distinction between routine pharmacy navigation and urgent medical casualty escalation without causing visual confusion.

## Options considered

### Option 1: Clinical Slate and Emergency Amber Theme with Tailwind v4
- Pros: Validated contrast ratios exceeding 5:1 across all semantic pairs; authoritative clinical feel; distinct color semantics (crimson for hospital escalation, emerald for in stock, amber for reroutes); zero runtime CSS overhead with Tailwind v4.
- Cons: Requires strict restraint to prevent visual clutter across stacked status tags.

### Option 2: Soft Pastel Healthcare Palette
- Pros: Reduces visual alarmism and anxiety for nervous students.
- Cons: Fails WCAG AA outdoor sunlight readability; lacks urgent contrast for hospital escalation modals.

### Option 3: Heavy Shadows and Complex Skeuomorphism
- Pros: High visual depth and tactile button appearance.
- Cons: Slower GPU paint times on entry level mobile devices; poor visibility in direct sunlight where shadows wash out.

## Rationale

Clinical Slate neutrals with hairline borders ensure maximum contrast and instant comprehension under direct sunlight. Enforcing a 48px touch target floor prevents accidental taps from students with trembling hands or high fever, satisfying AC-3.
