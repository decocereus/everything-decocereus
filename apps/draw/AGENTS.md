# AGENTS.md

A private Excalidraw whiteboard at draw.decocereus.com that Amartya and his agents both draw on. Follow the root `AGENTS.md` too.

- The editor is the `@excalidraw/excalidraw` npm package, not a fork. Upgrade it with the package manager; don't copy its source in.
- Boards and images live in the R2 bucket `draw-decocereus` (`boards/<id>.json`, `files/<fileId>`, `index.json`). Without R2 env vars, local dev stores them in `.data/`.
- Agents use the MCP server at `/api/mcp` (bearer `DRAW_MCP_TOKEN`). The same tools reach in-browser agents through WebMCP; the page adds a few of its own in `src/components/webmcp.ts`.
- The browser and agents write concurrently. Every board write is read-modify-write with `If-Match`, and elements merge by `version`/`versionNonce`. Keep that when touching `src/lib/boards.ts`.
- R2 quirks the code depends on: read objects with `accept-encoding: identity` (gzip gives weak ETags that `If-Match` rejects), send PUT bodies as bytes (R2 requires `Content-Length`), and poll with HEAD (R2 omits CORS headers on 304s).
- Text sizes computed on the server are estimates; the browser re-measures on load.
- Env vars: `DRAW_PASSWORD`, `DRAW_SESSION_SECRET`, `DRAW_MCP_TOKEN`, `APP_URL`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, optional `WEBMCP_ORIGIN_TRIAL_TOKEN` and `CHROMIUM_PACK_URL`. Production values live in the Vercel project `draw`.
- Run `pnpm --filter draw test` after changing `src/lib`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
