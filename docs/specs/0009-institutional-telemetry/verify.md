# Verification Plan for 0009 Institutional Population Health Telemetry Feed

## Automated Tests

1. Unit tests in `src/features/telemetry/telemetry.test.tsx`:
   - Calculate category search distribution from synthetic search events.
   - Verify facility stockout incident counting.
   - Verify calculation of queue distribution percentages.
   - Verify zero PII enforcement: assert exported payload contains zero user IDs, IP addresses, student names, or individual search timestamps.
   - Verify SVG chart accessibility: check aria labels, roles, and accessible text alternatives.
2. Integration tests:
   - Mount `TelemetryView` and confirm rendering of metric cards, category breakdown bar chart, facility comparison table, and export button.
   - Verify JSON download trigger initiates clean file generation.

## Manual Acceptance Criteria

1. Navigate to `/telemetry` in browser.
2. Confirm header contains navigation link to Population Telemetry.
3. Verify metric cards: Total Logistics Queries, Active Facilities Tracked, Stockout Incidents, Average Clinic Wait.
4. Verify SVG bar chart visually reflects relative category demand percentages.
5. Verify facility comparative table lists all four partner facilities with current queue status and stock status.
6. Click Export Telemetry Summary and verify exported JSON contains aggregated counters with zero student PII.
