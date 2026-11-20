# Start Here: Chowlin AI

Welcome to the engineering context suite for Chowlin AI. All context documents have been generated according to your project decisions.

## File ownership and workflow roles

- `AGENTS.md`: Root configuration read by all coding tools. Maintained by `/audit` and `/sync`.
- `CLAUDE.md`: Pointer file linking AI agents directly to `AGENTS.md`.
- `design.md`: Art direction, contrast ratios, and layout mandates. Owned by `/develop`.
- `docs/scope/scope.md`: Living product scope and feature completion tracker. Owned by `/scope` and `/develop`.
- `docs/specs/*`: Technical specifications for stack, data model, and design system. Owned by `/architect`.
- `docs/context/*`: Baseline documentation for architecture, coding standards, library docs, and UI rules. These files are not modified automatically by skills, so update them manually when major requirements evolve.
- `_place-after-scaffold/tokens.css`: Design tokens ready to merge into your global stylesheet after scaffolding.

## Assumptions

1. You will provide valid Supabase and Google Gemini API keys when booting the scaffolded application.
2. Students settle hostel bulk pool payments peer to peer via cash or mobile banking apps outside the platform.
3. Market seed data reflects estimated local prices that students refine through upvotes on Nsukka Market Watch.

## Unverified items

- Exact real time market stall prices for Nsukka and Enugu staples fluctuate weekly with inflation; confirm before deployment.

## Next steps in order

1. Inspect the generated files in this repository. All context files are already laid out at the root.
2. Run `/develop stack & architecture` to scaffold the Next.js 15 App Router project.
3. Merge `_place-after-scaffold/tokens.css` into the scaffolded theme file (`src/app/globals.css`).
4. Run `/audit` to gap fill `AGENTS.md` against the generated codebase without overwriting curated settings.
5. Run `/develop tooling` to install ESLint, Prettier, and Vitest.
6. Run `/architect data model` to finalize the Supabase SQL migration script.
7. Delete this `_START_HERE.md` file once you complete the steps above.
