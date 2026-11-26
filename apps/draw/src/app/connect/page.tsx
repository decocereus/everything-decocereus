import type { Metadata } from "next";
import Link from "next/link";
import { SetupSnippets } from "@/components/setup-snippets.tsx";
import { mcpToken } from "@/lib/auth.ts";
import { agentSetups, TOKEN_PLACEHOLDER } from "@/lib/connect.ts";
import { appOrigin } from "@/lib/origin.ts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Connect an agent · Draw" };

const TOOLS = [
  "list_boards",
  "create_board",
  "read_board",
  "add_elements",
  "add_diagram",
  "update_elements",
  "delete_elements",
  "get_board_image",
  "rename_board",
  "delete_board",
];

export default function ConnectPage() {
  const mcpUrl = `${appOrigin()}/api/mcp`;
  const token = mcpToken() ?? "";
  return (
    <main className="page connect">
      <p className="back">
        <Link className="quiet-link" href="/">
          All boards
        </Link>
      </p>
      <h1>Connect an agent</h1>
      <p>
        Agents connect over MCP and work on the same boards you see. What they
        draw shows up in your open tab within a couple of seconds, and they can
        read what you draw.
      </p>
      <dl className="facts">
        <dt>Server</dt>
        <dd>
          <code>{mcpUrl}</code>
        </dd>
        <dt>Auth</dt>
        <dd>
          <code>Authorization: Bearer {TOKEN_PLACEHOLDER}</code>
        </dd>
        <dt>Tools</dt>
        <dd className="tools">
          {TOOLS.map((t) => (
            <code key={t}>{t}</code>
          ))}
        </dd>
      </dl>

      <SetupSnippets
        masked={agentSetups(mcpUrl, TOKEN_PLACEHOLDER)}
        real={agentSetups(mcpUrl, token)}
      />

      <section className="setup" id="browser">
        <h2>Agents in the browser (WebMCP)</h2>
        <p>
          Open a board in Chrome with WebMCP turned on, either "WebMCP for
          testing" in <code>chrome://flags</code> or by launching Chrome with{" "}
          <code>--enable-features=WebMCP</code>. The page registers the same
          tools for in-browser agents, plus <code>get_current_board</code>,{" "}
          <code>get_selection</code>, <code>add_mermaid</code> and{" "}
          <code>focus_elements</code>. They use your login, so they need no
          token. The browser's own agent has to support WebMCP to use them.
        </p>
      </section>
    </main>
  );
}
