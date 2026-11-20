# UI Registry: MedWay

Update this registry whenever you add or modify a shared component.

| Component | Path | Variants | Status | Notes |
|---|---|---|---|---|
| `AppHeader` | `src/components/ui/app-header.tsx` | default, emergency-active | implemented | Persistent 64px top bar with connectivity tag and emergency dialer |
| `OfflineBanner` | `src/components/ui/offline-banner.tsx` | default | implemented | Persistent notice indicating that cached data is being presented |
| `Button` | `src/components/ui/button.tsx` | primary, secondary, emergency, warning, ghost | implemented | Accessible 48px touch target button primitive with 2px focus ring |
| `Badge` | `src/components/ui/badge.tsx` | neutral, tiship, in-stock, out-of-stock, queue-*, emergency, pcn | implemented | Semantic status badge pairing icon with text |
| `Card` | `src/components/ui/card.tsx` | default | implemented | Hairline border surface card with CardHeader, CardTitle, CardContent, CardFooter |
| `FacilityCard` | `src/components/ui/facility-card.tsx` | default, recommended | implemented | Destination card displaying distance, queue status, price, and stock |
| `DangerSignChecklist` | `src/components/ui/danger-sign-checklist.tsx` | default, emergency-active | implemented | Deterministic WHO danger sign screening with emergency dialer |
| `IntakePassCard` | `src/components/ui/intake-pass-card.tsx` | default | implemented | High contrast student self-advocacy slip with MW-UNN-XXX pass code |
| `EmergencyModal` | `src/features/triage/emergency-modal.tsx` | default | planned | High contrast crimson modal with 1-tap phone dialer for casualty bays |
| `CategorySelector` | `src/features/router/category-selector.tsx` | default | planned | Chip grid selector for the 4 canonical care categories |
| `BudgetGate` | `src/features/router/budget-gate.tsx` | tiship, fast | planned | Radio toggle enforcing TISHIP Hard Lock for ₦0 budget students |
| `AutoRerouteBanner` | `src/features/router/auto-reroute-banner.tsx` | default | planned | Amber banner explaining why a private pharmacy was prioritized over clinic |
| `CounterScanner` | `src/features/partner/counter-scanner.tsx` | default | planned | Partner camera barcode/QR scanner for redeeming check in tokens |
| `StockToggleControl` | `src/features/partner/stock-toggle-control.tsx` | default | planned | 1-tap switch for toggling category stock in partner portal |
