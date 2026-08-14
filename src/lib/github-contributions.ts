import { PORTFOLIO_GITHUB } from "@/lib/constants.ts";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  count: number;
  date: string;
  level: ContributionLevel;
}

export interface GitHubContributions {
  days: ContributionDay[];
  isSnapshot: boolean;
  totalContributions: number;
}

const SNAPSHOT_START_DATE = "2025-08-10";
const SNAPSHOT_LEVELS =
  "1112001011111001110000100200000000000111000111120011210001112200211100001111111101100001010011221101122110333321011111012131213222210130111120110111111211101100131112322243121024111011211100201110010000004121200111120010111000001100123310011121112130410131121013321000031100212320021441001132100111210112123001111100102110211142002321211114113432312001112200244440023132";
const SNAPSHOT_COUNTS = [
  1, 8, 3, 11, 0, 0, 2, 0, 4, 8, 4, 8, 4, 0, 0, 1, 5, 4, 0, 0, 0, 0, 2, 0, 0, 9,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 7, 0, 0, 0, 4, 3, 6, 8, 13, 0, 0, 8, 3,
  9, 1, 0, 0, 0, 3, 3, 7, 11, 12, 0, 0, 12, 2, 4, 1, 0, 0, 0, 0, 5, 6, 3, 6, 2,
  1, 1, 1, 0, 3, 3, 0, 0, 0, 0, 4, 0, 4, 0, 0, 5, 5, 10, 11, 8, 1, 0, 4, 4, 12,
  13, 4, 1, 0, 21, 17, 17, 22, 15, 2, 0, 5, 3, 5, 6, 3, 0, 1, 10, 3, 17, 8, 9,
  8, 19, 12, 13, 10, 14, 3, 0, 7, 22, 0, 3, 6, 2, 7, 15, 0, 5, 5, 0, 3, 4, 2, 8,
  1, 8, 16, 6, 2, 2, 0, 3, 1, 0, 0, 6, 22, 6, 3, 5, 15, 22, 13, 10, 10, 25, 19,
  8, 11, 5, 0, 9, 32, 8, 2, 8, 0, 4, 4, 12, 6, 3, 1, 0, 0, 10, 0, 3, 1, 2, 0, 0,
  2, 0, 0, 0, 0, 0, 0, 28, 8, 14, 7, 15, 0, 0, 2, 2, 1, 3, 10, 0, 0, 2, 0, 4, 3,
  5, 0, 0, 0, 0, 0, 4, 1, 0, 0, 8, 13, 17, 18, 1, 0, 0, 7, 2, 4, 9, 5, 6, 6, 14,
  7, 24, 0, 29, 4, 0, 7, 24, 1, 4, 9, 5, 0, 1, 18, 19, 12, 4, 0, 0, 0, 0, 23, 5,
  5, 0, 0, 9, 8, 12, 23, 12, 0, 0, 15, 6, 36, 27, 7, 0, 0, 6, 8, 24, 15, 3, 0,
  0, 6, 1, 2, 9, 2, 0, 1, 2, 9, 2, 15, 19, 0, 0, 2, 2, 2, 1, 1, 0, 0, 3, 0, 10,
  3, 1, 0, 9, 8, 6, 6, 29, 15, 0, 0, 13, 19, 10, 8, 13, 1, 5, 5, 6, 36, 3, 6,
  18, 32, 19, 12, 17, 3, 9, 0, 0, 8, 7, 8, 9, 12, 0, 0, 15, 33, 50, 31, 39, 0,
  0, 14, 17, 7, 17, 10,
] as const;

const LEVEL_BY_NAME = {
  FIRST_QUARTILE: 1,
  FOURTH_QUARTILE: 4,
  NONE: 0,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
} as const;

interface GraphQlResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              contributionCount: number;
              contributionLevel: keyof typeof LEVEL_BY_NAME;
              date: string;
            }[];
          }[];
        };
      };
    };
  };
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function snapshotContributions(): GitHubContributions {
  const start = new Date(`${SNAPSHOT_START_DATE}T00:00:00.000Z`);
  const days = SNAPSHOT_COUNTS.map((count, index) => ({
    count,
    date: addUtcDays(start, index).toISOString().slice(0, 10),
    level: Number(SNAPSHOT_LEVELS[index]) as ContributionLevel,
  }));

  return {
    days,
    isSnapshot: true,
    totalContributions: 2283,
  };
}

export async function getGithubContributions(): Promise<GitHubContributions> {
  const token = process.env.GITHUB_CONTRIBUTIONS_TOKEN;
  if (!token) {
    return snapshotContributions();
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      body: JSON.stringify({
        query: `
          query PortfolioContributions($login: String!) {
            user(login: $login) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      contributionLevel
                      date
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { login: PORTFOLIO_GITHUB.login },
      }),
      cache: "force-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return snapshotContributions();
    }

    const payload = (await response.json()) as GraphQlResponse;
    const calendar =
      payload.data?.user?.contributionsCollection.contributionCalendar;
    if (!calendar) {
      return snapshotContributions();
    }

    return {
      days: calendar.weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({
          count: day.contributionCount,
          date: day.date,
          level: LEVEL_BY_NAME[day.contributionLevel],
        }))
      ),
      isSnapshot: false,
      totalContributions: calendar.totalContributions,
    };
  } catch {
    return snapshotContributions();
  }
}
