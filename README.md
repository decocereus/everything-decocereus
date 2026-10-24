# everything-decocereus

Amartya Singh's sites, in one pnpm and Turborepo monorepo.

```text
apps/portfolio/   decocereus.com, the personal portfolio
docs/             Canonical profile source material shared by the sites
output/           Generated résumé files
```

## Development

This repository uses pnpm 11 and requires Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev                          # every app
pnpm --filter portfolio dev       # one app
```

## Checks

```bash
pnpm typecheck
pnpm check
pnpm react:doctor
pnpm build
```

Each command runs the matching script in every app through Turborepo. Biome
and Ultracite are configured once in `biome.jsonc` at the root.

Read [AGENTS.md](./AGENTS.md) before making structural or design changes.
