# 0006 Auto Reroute Engine and Partner Directory

**Status**: Accepted
**Date**: 2026-11-20

## Summary

When essential medication stockouts occur at the UNN Medical Centre, MedWay automatically reroutes students to accredited community pharmacies while clearly explaining the reason with high visibility amber banners. This specification details the auto reroute detection engine, the partner pharmacy directory view, and the stockout referral flow that guides students to verified facilities near campus gates.

## Context

Stockouts of artemisinin combination therapy (ACT), typhoid test reagents, and oral rehydration salts are common occurrences at university clinics during peak malaria transmission seasons. When a cash strapped student treks to the clinic only to discover empty dispensary shelves after waiting for hours, care is delayed and frustration spikes. MedWay bridges this logistics gap by detecting clinic stockouts before departure and rerouting students to nearby PCN accredited private pharmacies such as Odim Gate Pharmacy or Hilltop Pharmacy.

## Requirements

- User story: As a student seeking malaria treatment when the clinic is out of ACT, I want MedWay to inform me upfront and reroute me to the nearest accredited pharmacy with verified stock so I do not waste time trekking across campus.
- User story: As a student browsing off campus care options, I want to view a partner directory that shows distance from campus gates, current queue times, and retail price ranges.
- AC-1: When UNN Medical Centre stock for the chosen category is false, the router must display an amber auto reroute banner explaining that clinic stock is exhausted and recommending the top accredited off campus partner.
- AC-2: Under clinic stockout conditions, the ranking score for the clinic must be penalized (-120 stock penalty plus removal of hard lock boost) so that accredited partner pharmacies with active stock rank first.
- AC-3: Odim Gate Community Pharmacy must be ranked as the primary recommendation when UNN Medical Centre is out of stock and Odim Gate has confirmed stock and low queue.
- AC-4: The auto reroute banner must feature high contrast amber styling meeting WCAG AA requirements with an explicit warning icon and 48px touch targets for direct route selection.
- AC-5: A dedicated Partner Directory tab or view must allow students to explore all accredited pharmacies with filtration by distance, gate proximity (Odim, Hilltop, Ogige), and verified stock status.

## Options considered

### Option 1: Dynamic In-Stream Auto Reroute with Contextual Amber Banner
- Pros: Keeps the student inside their active routing flow; immediately surfaces the reason why an off campus paid option is now prioritized; avoids jarring route redirects.
- Cons: Requires real time synchronization with pharmacy stock records.

### Option 2: Hard Popup Interstitial Modal Blocking Clinic Selection
- Pros: Forces the user to acknowledge the stockout before seeing any facility.
- Cons: Disruptive user experience; adds unnecessary taps for students who already know about the shortage.

## Decision

Chosen option: Option 1 (Dynamic In-Stream Auto Reroute with Contextual Amber Banner). It cleanly integrates into the facility list, highlighting the top partner facility with an amber notice explaining the stockout.

## Consequences

- Positive: Prevents wasted trips to empty dispensaries; builds student trust through honest real time availability data.
- Negative: Low income students with ₦0 budget may need to source funds for retail purchases if clinic stock is depleted.
- Neutral: Requires partner pharmacies to maintain timely stock updates.
