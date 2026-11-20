# Verification: Partner Dashboard and Counter Check In Telemetry

## Automated Verification Steps

1. **Attendant PIN Authentication:**
   - Verify that invalid PIN entries are rejected with structured error feedback.
   - Verify that valid facility PIN entries unlock the attendant dashboard and store the active session.

2. **One Tap Inventory Toggles:**
   - Verify that toggling any care category (e.g. Antimalarials (ACT)) updates the facility stock record in IndexedDB.
   - Verify that toggling stock to false emits a synchronization event.

3. **Queue Level Updates:**
   - Verify that switching queue from "low" to "high" updates `facility.currentQueue` and updates `lastQueueUpdate` timestamp.

4. **Counter Token Verification:**
   - Generate a student crowd token via `createCrowdToken`.
   - Submit the token code into the attendant verification scanner.
   - Verify that the token is marked `isVerified: true` and that redemption success feedback is displayed.

5. **Static Compilation & Linting Gates:**
   - Run `npm.cmd test` for Vitest suite verification.
   - Run `npm.cmd run typecheck` for 0 TypeScript errors.
   - Run `npm.cmd run lint` for 0 ESLint warnings.
   - Run `npm.cmd run build` for production static compilation.
