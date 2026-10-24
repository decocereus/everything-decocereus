import { load } from "cheerio/slim";
import { PORTFOLIO_GITHUB } from "./constants.ts";

const COUNT_PATTERN = /^(No|[\d,]+) contributions? on /;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TOTAL_PATTERN = /^\s*([\d,]+)\s+contributions?\b/;

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  count: number;
  date: string;
  level: ContributionLevel;
}

export interface GitHubContributions {
  days: ContributionDay[];
  totalContributions: number;
}

export function parseGithubContributions(html: string): GitHubContributions {
  const $ = load(html);
  const labels = new Map(
    $("tool-tip[for]")
      .toArray()
      .map((element) => [$(element).attr("for"), $(element).text().trim()])
  );
  const days = $("td[data-date]")
    .toArray()
    .map((element): ContributionDay => {
      const cell = $(element);
      const date = cell.attr("data-date");
      const level = Number(cell.attr("data-level"));
      const label = labels.get(cell.attr("id")) ?? "";
      const countText = COUNT_PATTERN.exec(label)?.[1];
      const count =
        countText === "No" ? 0 : Number(countText?.replaceAll(",", ""));
      if (
        !(date && DATE_PATTERN.test(date) && Number.isSafeInteger(count)) ||
        count < 0 ||
        !(
          level === 0 ||
          level === 1 ||
          level === 2 ||
          level === 3 ||
          level === 4
        )
      ) {
        throw new Error("Invalid GitHub contribution day");
      }
      return { count, date, level };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  const totalText = $("#js-contribution-activity-description").text();
  const total = TOTAL_PATTERN.exec(totalText)?.[1];
  const totalContributions = Number(total?.replaceAll(",", ""));
  if (
    days.length === 0 ||
    new Set(days.map((day) => day.date)).size !== days.length ||
    !Number.isSafeInteger(totalContributions) ||
    totalContributions < 0
  ) {
    throw new Error("Invalid GitHub contribution calendar");
  }
  return { days, totalContributions };
}

export async function getGithubContributions(): Promise<GitHubContributions | null> {
  try {
    const response = await fetch(
      `https://github.com/users/${PORTFOLIO_GITHUB.login}/contributions`,
      {
        headers: { "Accept-Language": "en-US" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(10_000),
      }
    );
    if (!response.ok) {
      return null;
    }
    return parseGithubContributions(await response.text());
  } catch {
    return null;
  }
}
