---
name: clinical-slate-design-system
source: derived
character: "Crisp emergency clinical slate with signal amber warnings and emerald verified accents. Built for rapid scanning under acute physical distress and bright outdoor sunlight."
tokens: "real values live in _place-after-scaffold/tokens.css; read them there, never duplicated here"
contrast: "body 9.9:1 / 12.0:1; ink 17.1:1 / 17.1:1; on-accent 5.9:1 / 8.3:1; border 4.8:1 / 3.1:1"
---

## Build mandate

You are building a healthcare routing application used by university students under acute illness or high stress. Every screen must ship complete with genuine copy, clear hierarchy, distinct empty states, loading indicators, and error banners. You must never ship a lone form on an empty canvas. You must deliver complete pages that convey clinical authority and operational clarity.

## Character & direction

The design language balances high contrast visibility with low anxiety calmness. Deep slate surfaces frame critical actions. Emergency hospital alerts use crisp crimson cards that demand immediate attention without panic. Confirmed inventory uses emerald tags that signify verified reliability. Auto reroute notifications use amber callouts that explain why a facility has been reprioritized.

## Composition patterns

The layout centers on a mobile first single column shell with a maximum width of 640px for student flows and 1024px for partner telemetry views. The header stays fixed at 56px with a high contrast title and offline status indicator. The red flag checklist appears at the top of the student intake flow to ensure danger signs are evaluated before any logistics choices. Facility destination cards stack vertically with prominent queue and stock tags.

## Component & usage rules (do's and don'ts)

Use the accent sky blue only for primary forward actions such as generating passes or initiating emergency calls. Use emerald exclusively for verified in stock indicators and PCN badges. Use amber exclusively for crowd congestion notices and stockout reroute explanations. Never use animate-pulse or any pulsing animation on status badges. Never wrap section titles in rounded pills or badges. Maintain hairline borders on card containers rather than heavy drop shadows.

## Responsive & accessibility direction

All text elements meet or exceed WCAG AA contrast standards in both light and dark modes. Touch targets measure at least 48px by 48px to accommodate shaky or distracted hands. Every interactive control maintains a visible 2px focus ring. Form inputs provide explicit label elements and inline error descriptions. The interface runs cleanly on low resolution mobile displays down to 320px width.
