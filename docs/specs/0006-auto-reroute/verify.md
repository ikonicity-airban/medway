# Verification: Auto Reroute Engine and Partner Directory

## Automated Verification Steps

1. **Stockout Penalty Invariant:**
   - In `src/lib/routing-engine.ts`, verify that when `facility.isCampusClinic` has `stock[category] = false`, its score drops by at least 120 points and receives no TISHIP Hard Lock boost.
   - Run Vitest suite: `npm.cmd test`.

2. **Auto Reroute Trigger & Flagging:**
   - Verify that when the campus clinic has zero stock for the requested category, `rankFacilities` sets `isAutoRerouted: true` and defines `rerouteReason` on the top alternate recommendation.
   - Confirm that Odim Gate Community Pharmacy outranks UNN Medical Centre when the clinic is out of stock.

3. **Auto Reroute Banner Presentation:**
   - Render `AutoRerouteBanner` component in isolation and verify that it displays the target category, clinic stockout warning, and recommended partner facility.
   - Test accessibility: verify 48px touch targets, contrast ratios, and clear copy without em dashes or hyphenated prose.

4. **Partner Directory Exploration:**
   - Verify `PartnerDirectory` component lists all accredited partner pharmacies with gate tags, current queue badges, and price indicators.
   - Verify filtering by care category and search term.

5. **Typecheck and Static Build:**
   - Run `npm.cmd run typecheck` to confirm zero TypeScript errors.
   - Run `npm.cmd run lint` to confirm zero ESLint warnings.
   - Run `npm.cmd run build` to confirm production static compilation.
