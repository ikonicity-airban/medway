# UI Registry: MedWay

Update this registry whenever you add or modify a shared component.

| Component | Path | Variants | Status | Notes |
|---|---|---|---|---|
| `AppHeader` | `src/components/ui/app-header.tsx` | default, emergency-active | implemented | Persistent 64px top bar with navigation, connectivity tag, and casualty dialer |
| `OfflineBanner` | `src/components/ui/offline-banner.tsx` | default | implemented | Persistent notice indicating that cached data is being presented |
| `Button` | `src/components/ui/button.tsx` | primary, secondary, emergency, warning, ghost | implemented | Accessible 48px touch target button primitive with 2px focus ring |
| `Badge` | `src/components/ui/badge.tsx` | neutral, tiship, in-stock, out-of-stock, queue-*, emergency, pcn | implemented | Semantic status badge pairing icon with text |
| `Card` | `src/components/ui/card.tsx` | default | implemented | Hairline border surface card with CardHeader, CardTitle, CardContent, CardFooter |
| `FacilityCard` | `src/components/ui/facility-card.tsx` | default, recommended | implemented | Destination card displaying distance, queue status, price, and stock |
| `DangerSignChecklist` | `src/components/ui/danger-sign-checklist.tsx` | default, emergency-active | implemented | Deterministic WHO danger sign screening with emergency dialer |
| `IntakePassCard` | `src/components/ui/intake-pass-card.tsx` | default | implemented | High contrast student self advocacy slip with MW-UNN-XXX pass code |
| `EmergencyModal` | `src/features/triage/emergency-modal.tsx` | default | implemented | High contrast crimson modal with one tap phone dialer for casualty bays |
| `CategorySelector` | `src/features/router/category-selector.tsx` | default | implemented | Chip grid selector for the 4 canonical care categories |
| `BudgetGate` | `src/features/router/budget-gate.tsx` | tiship, fast | implemented | Radio toggle enforcing TISHIP Hard Lock for ₦0 budget students |
| `AutoRerouteBanner` | `src/features/router/auto-reroute-banner.tsx` | default | implemented | Amber banner explaining why a private pharmacy was prioritized over clinic |
| `PartnerDirectory` | `src/features/router/partner-directory.tsx` | default | implemented | Directory of accredited retail pharmacies with PCN status and walking times |
| `InventoryToggles` | `src/features/partner/inventory-toggles.tsx` | default | implemented | One tap toggle switches for the 4 canonical medication categories |
| `QueueSelector` | `src/features/partner/queue-selector.tsx` | default | implemented | Accessible 48px touch targets for low, moderate, and high queue congestion |
| `TokenScanner` | `src/features/partner/token-scanner.tsx` | default | implemented | Verification console for student pass codes and crowd check in tokens |
| `CategoryDemandBarChart` | `src/features/telemetry/telemetry-charts.tsx` | default | implemented | Accessible pure vector SVG horizontal bar chart for category search demand |
| `QueueCongestionMeter` | `src/features/telemetry/telemetry-charts.tsx` | default | implemented | Segmented queue load meter displaying low, moderate, and high distribution |
| `FacilityStatusMatrix` | `src/features/telemetry/telemetry-charts.tsx` | default | implemented | High contrast operational matrix tracking stockouts and queue loads |
| `TelemetryView` | `src/features/telemetry/telemetry-view.tsx` | default | implemented | Institutional population health logistics dashboard with JSON export |
