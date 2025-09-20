# Repository Guidelines

## Build, Test, and Development Commands

- Install deps: `pnpm install`
- Type-check: `pnpm exec tsc --noEmit`
- Lint: `pnpm lint`
- Format: `pnpm format`
- Build: `pnpm build`
- Start dev server: `pnpm dev` (agents: do not auto-start; provide instructions instead)
- Start production server: `pnpm start`

## Project Structure & Module Organization

- Next.js (App Router) with TypeScript and Tailwind.
- Source lives in `src/`:
  - `src/app/` — routes, layouts, pages, and `globals.css`.
  - `src/components/ui/` — reusable UI (Shadcn-style components).
  - `src/hooks/` — React hooks (`use-*.ts(x)`).
  - `src/lib/` — utilities (e.g., `src/lib/utils.ts`).
- Static assets in `public/`. Config in root (`next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`).
- Path aliases: `@/*` → `src/*` via `tsconfig.json`; shadcn aliases set in `components.json`.

## Code style

- TypeScript strict mode; avoid `any`. Export public types explicitly.
- Prefer absolute imports with `@/`.
- React Server Components by default in `src/app`; add `"use client"` only when needed.
- Fonts via `next/font/*` (see `src/app/layout.tsx`); apply variables on `<body>`.
- Use `export const metadata` in page/layout files for SEO.
- Images via `next/image`; reference assets from `public/`.
- Early-return error handling; avoid deep nesting and unhandled catches.
- Accessibility: proper roles/elements; preserve focus-visible styles.
- Keep components small/reusable; avoid duplicating `ui/*` primitives.

### shadcn/ui

- Use `class-variance-authority` (`cva`) for `variant` and `size` props.
- Merge classes with `cn` from `src/lib/utils.ts` (Tailwind-aware).
- For polymorphic components expose `asChild` with `@radix-ui/react-slot`.
- Keep named exports (e.g., `export { Button, buttonVariants }`).

### Tailwind CSS

- Utility-first; rely on design tokens (`bg-background`, `text-foreground`, `ring`, `border`).
- Merge conditional classes with `cn(...)` to avoid conflicts.
- Preserve focus styles (`focus-visible:*`) on interactive elements.
- Prefer responsive scale utilities; use arbitrary values sparingly.
- Favor light/dark-friendly patterns (e.g., `hover:bg-accent`).

## Testing instructions

- No test runner is configured yet. If adding tests, prefer Vitest + Testing Library.
- Place tests next to sources as `*.test.ts(x)` (e.g., `src/components/ui/button.test.tsx`).
- Ensure types and lints pass before merging: `pnpm exec tsc --noEmit` and `pnpm lint`.

## PR instructions

- Use clear, imperative commit messages. Conventional Commits encouraged:
  - `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, etc. (e.g., `feat(ui): add Carousel autoplay`).
- Include purpose + summary, linked issues, and screenshots for UI changes.
- Ensure `pnpm lint` and `pnpm format` pass; avoid unrelated diffs.

## Automation & safety

- Do not auto-start dev servers; provide run instructions instead.
- Prefer `pnpm` over npm/yarn; pass non-interactive flags for CI/automation.
- Read-only first: inspect files and type-check (`pnpm exec tsc --noEmit`) before edits.
- Respect ESLint flat config at `eslint.config.mjs`; fix lints in edited files.
- Use absolute imports with `@/`; if alias maps change, update both `tsconfig.json` and `components.json`.
- Place static assets in `public/` and use `next/image` when possible.

## Security & configuration tips

- Store secrets in `.env.local` (never commit). Client-exposed keys must start with `NEXT_PUBLIC_`.
- Keep dependencies via `pnpm@10+`. Use Node 20+.
- Avoid broad refactors in feature PRs; keep changes scoped and incremental.
