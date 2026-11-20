# Start Here

Welcome to MedWay. This project context suite was generated from your specification and interactive grilling decisions, tailored specifically for the engineering workflow skills installed on your system.

## File guide and ownership

| File | Purpose | Skill ownership |
|---|---|---|
| `AGENTS.md` | Primary instruction file for coding agents (<= 60 lines) | Maintained by `/audit` and `/sync` |
| `CLAUDE.md` | Single line pointer to AGENTS.md | Static reference |
| `design.md` | Art direction, theme character, and verified contrast ratios | Read by `/develop`, updated during UI refactors |
| `docs/scope/scope.md` | Living scope tracking foundations and feature slices | Read and advanced by `/scope`, `/develop`, `/sync` |
| `docs/specs/*` | Technical design and decision specifications | Created and owned by `/architect` |
| `docs/context/*` | Project overview, code standards, architecture map, UI rules | Reference files, edited manually by engineers |
| `docs/adr/*` | Architecture Decision Records capturing settled forks | Created during design reviews, permanent records |
| `GLOSSARY.md` | Ubiquitous domain vocabulary | Maintained by domain modeling and `/architect` |
| `_place-after-scaffold/tokens.css` | Precomputed Tailwind v4 tokens | Merge into `src/app/globals.css` post-scaffold |

## Assumptions made

1. Campus pilot location is restricted to the University of Nigeria Nsukka (UNN) campus perimeter and surrounding commercial hubs (Odim Gate, Hilltop, and Ogige Market).
2. UNN Medical Centre operates with zero Electronic Medical Record (EMR) APIs on Day 1, relying entirely on student self-advocacy presentation and manual folder lookup.
3. Students using the platform have access to an SMS capable mobile phone if choosing to persist drug allergy notes across multiple devices.
4. Off-campus partner pharmacies are willing to adopt a free web portal for stock toggles and counter token redemption without subscription fees.

## Unverified items

1. Exact API endpoint specifications for Nigerian SMS gateway providers (e.g. Termii vs Twilio Nigeria) for phone magic link authentication (confirm before production deployment).
2. Formal written accreditation agreement with Bishop Shanahan Specialist Hospital for ambulance dispatch routing (recommended before live marketing).

## Next steps in order

1. If this repository is not yet a git repository, run `git init` to enable version control.
2. Run `/develop stack & architecture` to scaffold the Next.js 15 App Router project.
3. Copy contents of `_place-after-scaffold/tokens.css` into your scaffolded `src/app/globals.css` theme configuration.
4. Run `/audit` to verify dependencies and reconcile `AGENTS.md`.
5. Run `/develop tooling` to install ESLint, Prettier, and Vitest.
6. Begin the first feature slice by running `/develop emergency triage`.
