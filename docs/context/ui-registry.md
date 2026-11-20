# UI Registry

Update this registry whenever you add or modify a shared component.

| Component | Path | Variants | Status | Notes |
|---|---|---|---|---|
| `AppHeader` | `src/components/ui/app-header.tsx` | default, emergency-active | planned | Persistent 56px top bar with connectivity tag and emergency dialer |
| `DangerSignChecklist` | `src/features/triage/danger-sign-checklist.tsx` | default, locked | planned | Deterministic WHO danger sign screening checkboxes |
| `EmergencyModal` | `src/features/triage/emergency-modal.tsx` | default | planned | High contrast crimson modal with 1-tap phone dialer for casualty bays |
| `CategorySelector` | `src/features/router/category-selector.tsx` | default | planned | Chip grid selector for the 4 canonical care categories |
| `BudgetGate` | `src/features/router/budget-gate.tsx` | tiship, fast | planned | Radio toggle enforcing TISHIP Hard Lock for ₦0 budget students |
| `FacilityCard` | `src/features/router/facility-card.tsx` | campus-clinic, partner-pharmacy | planned | Destination card displaying distance, queue status, and stock badges |
| `AutoRerouteBanner` | `src/features/router/auto-reroute-banner.tsx` | default | planned | Amber banner explaining why a private pharmacy was prioritized over clinic |
| `IntakePassCard` | `src/features/intake-pass/intake-pass-card.tsx` | default, expanded | planned | High contrast student self-advocacy slip with SVG QR code |
| `CounterScanner` | `src/features/partner/counter-scanner.tsx` | default | planned | Partner camera barcode/QR scanner for redeeming check in tokens |
| `StockToggleControl` | `src/features/partner/stock-toggle-control.tsx` | default | planned | 1-tap switch for toggling category stock in partner portal |
| `OfflineBanner` | `src/components/ui/offline-banner.tsx` | default | planned | Persistent notice indicating that cached data is being presented |
| `Button` | `src/components/ui/button.tsx` | primary, secondary, emergency | planned | Accessible 48px touch target button primitive |
| `Badge` | `src/components/ui/badge.tsx` | in-stock, out-of-stock, reroute, emergency | planned | Semantic status badge pairing icon with text |
