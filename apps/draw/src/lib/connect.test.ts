import { describe, expect, it } from "vitest";
import { agentSetups, TOKEN_PLACEHOLDER } from "./connect.ts";

const URL = "https://draw.example.com/api/mcp";

describe("agentSetups", () => {
  it("puts the token and URL in every snippet", () => {
    for (const setup of agentSetups(URL, "secret123")) {
      expect(setup.code).toContain("secret123");
      expect(setup.code).toContain(URL);
    }
  });

  it("keeps the real token out of the placeholder version", () => {
    for (const setup of agentSetups(URL, TOKEN_PLACEHOLDER)) {
      expect(setup.code).not.toContain("secret123");
    }
  });

  it("produces valid JSON for the JSON configs", () => {
    const setups = agentSetups(URL, "secret123");
    for (const id of ["opencode", "cursor", "claude-desktop"]) {
      const code = setups.find((s) => s.id === id)?.code ?? "";
      expect(() => JSON.parse(code)).not.toThrow();
    }
  });
});
