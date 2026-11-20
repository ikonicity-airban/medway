# UI Rules

This guide specifies how engineers and coding agents build user interfaces for MedWay. Always read [design.md](design.md) first for overall art direction and color philosophy.

## Core styling principles
- Never hardcode hex color codes, raw pixel values, or arbitrary box shadow values in component classes.
- Always reference theme tokens defined in `_place-after-scaffold/tokens.css` via Tailwind v4 semantic utility classes (for example `bg-canvas`, `text-ink`, `border-border`, `text-muted`).
- When writing components, maintain a 4px base grid with an 8px rhythm.

## Layout constants table

| Constant | Value | Purpose |
|---|---|---|
| Max content width (Student) | `640px` (`max-w-xl`) | Single column mobile layout for focused navigation |
| Max content width (Partner) | `1024px` (`max-w-5xl`) | Two column desktop view for counter attendants |
| Page gutters | `16px` (`px-4`) | Edge padding on mobile devices |
| Header height | `56px` (`h-14`) | Fixed top navigation bar |
| Card padding | `16px` to `20px` (`p-4` to `p-5`) | Interior spacing for facility and pass cards |
| Section spacing | `24px` (`gap-6` or `space-y-6`) | Vertical separation between major functional blocks |

## Component conventions

### Buttons
- Primary variant: `bg-accent text-on-accent hover:opacity-90 active:scale-[0.98]`.
- Secondary variant: `bg-surface text-ink border border-border hover:bg-canvas`.
- Emergency variant: `bg-error text-on-error hover:opacity-90 active:scale-[0.98]`.
- Touch target size: all buttons must measure at least 48px in height (`h-12`).

### Inputs and form fields
- Inputs use `bg-surface border border-border text-ink rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent`.
- Every input requires an associated semantic `<label>` tag. Never rely solely on placeholder attributes.

### Cards and containers
- Cards use `bg-surface border border-border rounded-lg p-4`.
- Hairline borders are preferred over heavy drop shadows to preserve readability under bright outdoor glare.

### Badges and status tags
- In stock: `bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`.
- Reroute warning: `bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300`.
- Urgent emergency: `bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300`.
- Every badge must pair an icon with descriptive text; color must never be the sole conveyor of state.

### States: loading, empty, and error
- Loading state: use a clean skeleton container with subtle neutral shimmer.
- Empty state: display a centered illustration or icon with explicit explanatory text and a recovery action button.
- Error state: render a high contrast error banner with an explicit retry button.

## Standing design bans
- Never use `animate-pulse` or pulsing CSS animations on status badges.
- Never wrap section titles in rounded pills or badges, especially in hero sections.
- Never render a lone form on an empty canvas without context, brand identity, or supporting guidelines.

## Motion and interactions
- Keep transitions snappy and tactile: 80ms for hover states, 160ms for sheet expansions, 240ms for modal entrances.
- Respect user motion preferences: disable smooth transforms if `prefers-reduced-motion: reduce` is active.

## Accessibility floor
- Maintain WCAG 2.2 AA compliance across all components.
- Visible focus rings with 2px stroke and 2px offset are mandatory on all interactive elements.
- Form controls must feature descriptive error messages tied with `aria-describedby`.
