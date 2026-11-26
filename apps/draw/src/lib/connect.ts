// biome-ignore-all assist/source/useSortedKeys: snippet keys follow the order each tool documents its config in
export const TOKEN_PLACEHOLDER = "<token>";

export interface Setup {
  code: string;
  id: string;
  name: string;
  note?: string;
  /** Where the snippet goes, shown above it. */
  where: string;
}

/**
 * Setup snippets for each agent, with `token` substituted in. The page renders
 * them once with the placeholder and once with the real token.
 */
export function agentSetups(mcpUrl: string, token: string): Setup[] {
  const bridge = JSON.stringify(
    {
      draw: {
        command: "npx",
        args: [
          "-y",
          "mcp-remote",
          mcpUrl,
          "--header",
          // mcp-remote expands ${DRAW_AUTH} from env, which avoids quoting the space.
          // biome-ignore lint/suspicious/noTemplateCurlyInString: literal placeholder for mcp-remote
          "Authorization:${DRAW_AUTH}",
        ],
        env: { DRAW_AUTH: `Bearer ${token}` },
      },
    },
    null,
    2
  );
  return [
    {
      code: `claude mcp add --transport http --scope user draw ${mcpUrl} \\\n  --header "Authorization: Bearer ${token}"`,
      id: "claude-code",
      name: "Claude Code",
      where: "Run once in a terminal",
    },
    {
      code: `[mcp_servers.draw]\nurl = "${mcpUrl}"\nhttp_headers = { Authorization = "Bearer ${token}" }`,
      id: "codex",
      name: "Codex",
      where: "Add to ~/.codex/config.toml",
    },
    {
      code: JSON.stringify(
        {
          draw: {
            type: "remote",
            url: mcpUrl,
            headers: { Authorization: `Bearer ${token}` },
            enabled: true,
          },
        },
        null,
        2
      ),
      id: "opencode",
      name: "OpenCode",
      where: 'Add inside "mcp" in ~/.config/opencode/opencode.json',
    },
    {
      code: bridge,
      id: "cursor",
      name: "Cursor",
      note: "Cursor's CLI drops custom headers on remote servers, so this goes through mcp-remote, a small local bridge that adds the header.",
      where: 'Add inside "mcpServers" in ~/.cursor/mcp.json',
    },
    {
      code: bridge,
      id: "claude-desktop",
      name: "Claude Desktop",
      note: "Claude Desktop's config file only starts local programs, so it uses the same mcp-remote bridge.",
      where:
        'Add inside "mcpServers" in ~/Library/Application Support/Claude/claude_desktop_config.json, then restart the app',
    },
    {
      code: `URL     ${mcpUrl}\nHeader  Authorization: Bearer ${token}`,
      id: "other",
      name: "Any other MCP client",
      note: "Clients that only run local (stdio) servers can use the mcp-remote setup above.",
      where: "Streamable HTTP server",
    },
  ];
}
