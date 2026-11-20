# Start Here: MedWay

Campus Care Router and Pre-Triage System for UNN and Nigerian Tertiary Institutions.

## Project Status

MedWay is actively built and verified.
- Production Build: statically compiled and optimized with Next.js 15.1
- Development Server: `http://localhost:3000`
- All unit and integration tests passing: 66/66 Vitest tests passing across all 10 test suites
- TypeScript strict check: 0 errors
- ESLint quality check: 0 warnings, 0 errors

## Key Features Implemented

1. Emergency Pre-Triage: deterministic WHO checklist and 1-tap casualty dialer to UNN Medical Centre Emergency Unit and Bishop Shanahan Hospital.
2. TISHIP Zero-Cost Routing: routing engine that prioritizes campus medical centre for students with ₦0 cash budget.
3. Auto-Reroute and Partner Directory: accredited pharmacy routing with live queue and inventory badges.
4. Digital Intake Pass: scannable student self-advocacy pass (`MW-UNN-XXX`) with offline QR generation.
5. Partner Counter Dashboard: transactional check-in verification for community pharmacies.
6. Institutional Telemetry Feed: population health and morbidity trends for university health authorities and HMO syndicates.

## Engineering Standards

See [AGENTS.md](AGENTS.md) and [docs/context/project-overview.md](docs/context/project-overview.md).
