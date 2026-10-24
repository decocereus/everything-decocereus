# AGENTS.md

The portfolio at [decocereus.com](https://www.decocereus.com). Follow the root `AGENTS.md` too.

- Keep portfolio content in `src/lib/constants.ts`.
- Keep the application tracker at `/applications` current. After every confirmed submission or explicit hiring outcome, update `src/lib/job-applications.ts` in the same task. Use first-party confirmation or recent email evidence, and never infer rejection from silence.
- Reuse the theme tokens in `src/app/globals.css`.
- Do not invent or rewrite portfolio claims. The factual source is `docs/about-amartya.md` at the repository root.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
