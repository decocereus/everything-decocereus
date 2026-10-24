import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGithubContributions } from "../src/lib/github-contributions.ts";

const calendar = `<h2 id="js-contribution-activity-description">1,234 contributions in the last year</h2>
<table><tr><td id="later" data-date="2026-09-12" data-level="0"></td>
<td data-level="4" id="earlier" data-date="2026-09-11"></td></tr></table>
<tool-tip for="earlier">1,234 contributions on September 11th.</tool-tip>
<tool-tip for="later">No contributions on September 12th.</tool-tip>`;

test("joins labels to cells and sorts GitHub row-major days chronologically", () => {
  assert.deepEqual(parseGithubContributions(calendar), {
    days: [
      { count: 1234, date: "2026-09-11", level: 4 },
      { count: 0, date: "2026-09-12", level: 0 },
    ],
    totalContributions: 1234,
  });
});

test("rejects an error page instead of manufacturing an empty graph", () => {
  assert.throws(() =>
    parseGithubContributions("<h1>Temporarily unavailable</h1>")
  );
});

test("rejects missing counts, invalid levels, and duplicate dates", () => {
  for (const broken of [
    calendar.replace("No contributions", "Unknown contributions"),
    calendar.replace('data-level="4"', 'data-level="9"'),
    calendar.replace("2026-09-11", "2026-09-12"),
  ]) {
    assert.throws(() => parseGithubContributions(broken));
  }
});
