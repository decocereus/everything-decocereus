# AGENTS.md

# A note from Amartya

I like ambitious ideas, simple systems, and software that feels obvious. Do not preserve complexity just because it already exists. Do not introduce machinery because it looks architecturally impressive. Understand the real constraint, then fight for the smallest model that makes the correct behavior unsurprising.

Channel both "measure twice, cut once" and "yagni". Fight scope creep. Try to honor the dev's intent in both a minimal and realistic fashion.

The rest of this document is meant to help you navigate the codebase and make changes effectively. Think of these instructions less as "hard rules", more as "good defaults". The developer's preferences should be able to override anything here.

This is a pnpm and Turborepo monorepo. Each site lives in `apps/<name>` and has its own `AGENTS.md`; read it before working in that app. Add a shared package under `packages/` only once two apps need the same code.

- Keep changes small and preserve unrelated work.
- Use the Next.js App Router and React Server Components by default. Add `"use client"` only when browser APIs or interactivity require it.
- Use shadcn source components backed by Base UI (`@base-ui/react`). Do not add Radix dependencies or imports.
- Do not redesign a site unless explicitly asked.
- Before design work, review the available Emil Kowalski skills: `emil-design-engineering`, `better-*`, `animate`, `animation-*`, `css-animations`, `find-animation-opportunities`, `improve-animations`, `motion-*`, `pick-ui-library`, and `review-animations`. Use every skill relevant to the task.
- Verify UI changes in the real app at desktop and mobile widths. Run a production build for framework or dependency changes.
- Run the relevant checks before handoff. From the root they run in every app; use `pnpm --filter <app> <task>` for one app:

```bash
pnpm typecheck
pnpm check
pnpm react:doctor
pnpm build
```
