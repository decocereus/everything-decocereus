# Decocereus

The source for [decocereus.com](https://www.decocereus.com), Amartya Singh's
personal portfolio.

![Decocereus portfolio preview](./public/opengraph-image.png)

The site is a compact, responsive profile with interactive link previews, a
music player, a GitHub contribution graph, a privacy-safe view of Codex
activity, and a downloadable résumé.

## Stack

- Next.js 16 App Router and React 19
- TypeScript 7
- Tailwind CSS 4
- Base UI-backed shadcn components
- Ultracite, Biome, and React Doctor for code quality

The factual source behind the portfolio is maintained in
[docs/about-amartya.md](./docs/about-amartya.md).

## Development

This repository uses pnpm 11 and requires Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The site works without environment variables. To load the latest GitHub
contribution data instead of the committed fallback snapshot, add a GitHub
token with permission to read public profile data:

```bash
GITHUB_CONTRIBUTIONS_TOKEN=github_pat_...
```

## Content and data

Portfolio copy and links live in [`src/lib/constants.ts`](./src/lib/constants.ts).
The factual source behind that copy is maintained in
[`docs/about-amartya.md`](./docs/about-amartya.md); do not strengthen claims
when adapting it.

GitHub contributions are refreshed daily when a token is available and fall
back to a bundled snapshot if the API cannot be reached. Codex activity is
loaded hourly from a public aggregate and similarly falls back to
[`src/lib/codex-usage-snapshot.json`](./src/lib/codex-usage-snapshot.json).
The aggregate contains counts and token totals only—never prompts, titles, or
file paths.

The local exporter can be checked independently with:

```bash
python3 scripts/export-codex-usage.py --self-test
```

## Checks

```bash
pnpm typecheck
pnpm check
pnpm react:doctor
pnpm build
```

`pnpm check` runs Ultracite with its type-aware Biome, React, and Next.js
presets. Use `pnpm fix` for safe autofixes and `pnpm ultracite:doctor` to verify
the tooling setup. `pnpm react:doctor` runs React Doctor without telemetry or
supply-chain scanning.

## Structure

```text
src/app/          App Router pages, metadata, and global styles
src/components/   Portfolio sections and interactions
src/lib/          Content, types, and shared utilities
public/           Static images and assets
docs/             Canonical profile and portfolio source material
scripts/          Privacy-safe Codex activity export and publishing tools
ops/              Local scheduling configuration
```

Read [AGENTS.md](./AGENTS.md) before making structural or design changes.
