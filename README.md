# Decocereus

The source for [decocereus.com](https://decocereus.com), built with Next.js 16,
React 19, TypeScript, and Tailwind CSS 4.

The factual source behind the portfolio is maintained in
[docs/about-amartya.md](./docs/about-amartya.md).

## Development

This repository uses pnpm 11 and requires Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

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
```

Read [AGENTS.md](./AGENTS.md) before making structural or design changes.
