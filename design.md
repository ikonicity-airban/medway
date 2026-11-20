---
name: fresh-vitality-design-system
source: derived
character: "Fresh, energetic, and culturally grounded interface built for Nigerian university life. Crisp emerald accents signal nourishment, slate neutrals keep text readable in harsh lighting, and warm amber banners highlight urgent ulcer prevention intervals."
tokens: "real values live in _place-after-scaffold/tokens.css; read them there, never duplicated here"
contrast: "light body on canvas 9.98:1, light ink on canvas 17.2:1, light on-accent on accent 5.48:1; dark body on canvas 13.17:1, dark ink on canvas 18.69:1, dark on-accent on accent 5.7:1"
---

## Build mandate

You are a senior product designer. Every page must ship complete with authentic product copy, structured hierarchy, and every operational state (empty, loading, and error). You must never deliver a lone form floating on an empty screen. Support every input with contextual help and clear next steps.

## Character & direction

Chowlin AI uses a direct, practical tone calibrated for students at UNN and UNEC. The color system uses deep emerald `#047857` as the singular primary action color. Warm amber `#D97706` marks timing alerts to prevent gastric acid spikes. Surfaces use subtle border lines rather than heavy box shadows. Typography uses Plus Jakarta Sans for confident headings and Inter for high density tabular numbers and recipe text.

## Composition patterns

The layout uses a responsive full width grid that adapts smoothly across screen sizes. On mobile viewports under 640px, content stacks in a single column with a fixed 64px bottom navigation bar for one thumb reach. On desktop screens, the canvas expands into a two column layout with a sticky summary sidebar displaying real time protein and Naira metrics.

Main page layouts follow a consistent vertical rhythm:

1. Header bar with campus switcher (UNN Nsukka or UNEC Enugu) and current daily budget badge.
2. Hero action zone: camera upload area or current hunger alert.
3. Metric breakdown card: protein target bar, calorie balance, and Naira deficit.
4. Actionable recommendations list: recipes, ingredient top up checklist, or market stalls.

## Component & usage rules (do's and don'ts)

- Do use emerald accent strictly for primary triggers such as Calculate Top Up or Join Pool.
- Do use hairline 1px borders (`#E2E8F0` light, `#1E2C24` dark) to separate cards and list rows.
- Do present prices in Nigerian Naira with the symbol `₦` followed by comma grouped digits (example: ₦1,250).
- Do show local measurement units clearly: derica, paint rubber, cup, crate, or piece.
- Never use `animate-pulse` or pulsing placeholder skeletons anywhere in the app. Use solid neutral loading skeletons with subtle fade transitions instead.
- Never wrap section titles in pill badges or rounded chips. Keep titles as clean semantic headings.
- Never use raw unformatted numbers for nutrients. Always pair values with standard units like grams or kilocalories.

## Responsive & accessibility direction

The interface strictly respects WCAG AA accessibility standards. All interactive elements have an active focus ring with at least 3:1 contrast against surrounding surfaces. Touch targets on buttons and navigation items are at least 44px by 44px. Color is never the sole indicator of state; ulcer danger alerts combine amber tinting with a caution icon and plain text warnings. Text scale uses a 16px base with 1.200 minor third ratio to keep labels legible without horizontal scrolling.
