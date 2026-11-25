import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { isAuthorized } from "@/lib/auth";
import { registerTools, WEBMCP_TOOLS } from "@/lib/mcp-tools";
import { appOrigin } from "@/lib/origin";

export const maxDuration = 60;

const handler = createMcpHandler((server) => registerTools(server, appOrigin()), {
  serverInfo: { name: "draw", version: "1.0.0" },
  instructions:
    "Tools for the user's self-hosted Excalidraw boards. Start with list_boards or create_board, read a board before editing it, and call get_board_image to check how your drawing looks.",
  // In-page agents get the same tools through WebMCP, authenticated by the session cookie.
  experimental_webMcp: { tools: WEBMCP_TOOLS, credentials: "same-origin", cacheControl: "no-store" },
});

// Agents authenticate with the bearer token; the WebMCP bridge in the browser
// authenticates with the session cookie.
const authed = withMcpAuth(
  handler,
  async (req) => ((await isAuthorized(req)) ? { token: "draw", clientId: "draw", scopes: [] } : undefined),
  { required: true },
);

async function route(req: Request) {
  // The bridge script itself is public; the tool calls it makes are not.
  if (new URL(req.url).searchParams.has("webmcp-script")) return handler(req);
  return authed(req);
}

export { route as GET, route as POST, route as DELETE };
