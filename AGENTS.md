# AGENTS.md

# A note from Amartya

I like ambitious ideas, simple systems, and software that feels obvious. Do not preserve complexity just because it already exists. Do not introduce machinery because it looks architecturally impressive. Understand the real constraint, then fight for the smallest model that makes the correct behavior unsurprising.

Channel both "measure twice, cut once" and "yagni". Fight scope creep. Try to honor the dev's intent in both a minimal and realistic fashion.

The rest of this document is meant to help you navigate the codebase and make changes effectively. Think of these instructions less as "hard rules", more as "good defaults". The developer's preferences should be able to override anything here.

- Keep changes small and preserve unrelated work.
- Use the Next.js App Router and React Server Components by default. Add `"use client"` only when browser APIs or interactivity require it.
- Keep portfolio content in `src/lib/constants.ts`.
- Use shadcn source components backed by Base UI (`@base-ui/react`). Do not add Radix dependencies or imports.
- Reuse the theme tokens in `src/app/globals.css`.
- Do not invent or rewrite portfolio claims, and do not redesign the site unless explicitly asked.
- Before design work, review the available Emil Kowalski skills: `emil-design-engineering`, `better-*`, `animate`, `animation-*`, `css-animations`, `find-animation-opportunities`, `improve-animations`, `motion-*`, `pick-ui-library`, and `review-animations`. Use every skill relevant to the task.
- Verify UI changes in the real app at desktop and mobile widths. Run a production build for framework or dependency changes.
- Run the relevant checks before handoff:

```bash
pnpm typecheck
pnpm check
pnpm react:doctor
pnpm build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
