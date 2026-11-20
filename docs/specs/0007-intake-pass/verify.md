# Verification: Student Self Advocacy Intake Pass

## Automated Verification Steps

1. **Intake Pass Generation & Allergy Invariants:**
   - Verify `createIntakePass` generates valid `MW-UNN-XXX` codes and preserves allergy declarations.
   - Verify that when allergies are set to "Penicillin", the resulting pass structure accurately reflects the declared allergy.
   - Verify that passes reject routing to commercial pharmacies if red flags are active.

2. **Plain Text Clipboard Formatting:**
   - Verify that `formatPassText` produces clean, line break separated summaries containing the pass code, target facility, care category, allergies, and safety disclaimer.
   - Verify that clipboard write APIs succeed or degrade gracefully.

3. **SVG QR Code Matrix Rendering:**
   - Verify `PassQrCode` renders an accessible vector SVG with descriptive labels, distinct dark and light modules, and correct dimensions without throwing runtime exceptions.

4. **Offline IndexedDB Persistence & Retrieval:**
   - Save an intake pass to local IndexedDB via `saveIntakePass`.
   - Retrieve the pass by pass code via `getIntakePassByCode` and verify all fields match exactly.

5. **Direct Route Verification:**
   - Verify `/pass/[code]` route renders the stored pass from local storage or shows an accessible not found state when an invalid code is supplied.

6. **Static Build & Tooling Gates:**
   - Execute `npm.cmd test` for Vitest suite verification.
   - Execute `npm.cmd run typecheck` for 0 TypeScript errors.
   - Execute `npm.cmd run lint` for 0 ESLint warnings.
   - Execute `npm.cmd run build` for production static compilation.
