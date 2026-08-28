import snapshot from "./codex-usage-snapshot.json" with { type: "json" };

export interface CodexUsageTotals {
  cachedInputTokens: number;
  directRuns: number;
  outputTokens: number;
  processedTokens: number;
  runs: number;
  subagentProcessedTokens: number;
  subagentRuns: number;
}

export interface CodexUsageDay {
  date: string;
  directRuns: number;
  directTokens: number;
  subagentRuns: number;
  subagentTokens: number;
}

export interface CodexUsageInsights {
  activeDays: number;
  currentStreakDays: number;
  longestStreakDays: number;
  peakDailyDate: string | null;
  peakDailyTokens: number;
}

export interface CodexUsage {
  daily: CodexUsageDay[];
  generatedAt: string;
  insights: CodexUsageInsights;
  last30Days: CodexUsageTotals;
  since: string;
  timezone: string;
  totals: CodexUsageTotals;
  version: 2;
}

const USAGE_URL =
  "https://siluodok1dgxw4vk.public.blob.vercel-storage.com/codex-usage.json";

function hasExactKeys(value: Record<string, unknown>, keys: string[]) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function isTotals(value: unknown): value is CodexUsageTotals {
  if (!value || typeof value !== "object") {
    return false;
  }
  const totals = value as Record<string, unknown>;
  const keys = [
    "cachedInputTokens",
    "directRuns",
    "outputTokens",
    "processedTokens",
    "runs",
    "subagentProcessedTokens",
    "subagentRuns",
  ];
  return (
    hasExactKeys(totals, keys) &&
    keys.every((key) => typeof totals[key] === "number")
  );
}

function isInsights(value: unknown): value is CodexUsageInsights {
  if (!value || typeof value !== "object") {
    return false;
  }
  const insights = value as Record<string, unknown>;
  const keys = [
    "activeDays",
    "currentStreakDays",
    "longestStreakDays",
    "peakDailyDate",
    "peakDailyTokens",
  ];
  return (
    hasExactKeys(insights, keys) &&
    typeof insights.activeDays === "number" &&
    typeof insights.currentStreakDays === "number" &&
    typeof insights.longestStreakDays === "number" &&
    (typeof insights.peakDailyDate === "string" ||
      insights.peakDailyDate === null) &&
    typeof insights.peakDailyTokens === "number"
  );
}

function isCodexUsage(value: unknown): value is CodexUsage {
  if (!value || typeof value !== "object") {
    return false;
  }
  const usage = value as Record<string, unknown>;
  const dayKeys = [
    "date",
    "directRuns",
    "directTokens",
    "subagentRuns",
    "subagentTokens",
  ];
  return (
    hasExactKeys(usage, [
      "daily",
      "generatedAt",
      "insights",
      "last30Days",
      "since",
      "timezone",
      "totals",
      "version",
    ]) &&
    usage.version === 2 &&
    typeof usage.generatedAt === "string" &&
    typeof usage.since === "string" &&
    typeof usage.timezone === "string" &&
    isTotals(usage.totals) &&
    isTotals(usage.last30Days) &&
    isInsights(usage.insights) &&
    Array.isArray(usage.daily) &&
    usage.daily.length > 0 &&
    usage.daily.length <= 1000 &&
    usage.daily.every((day) => {
      if (!day || typeof day !== "object") {
        return false;
      }
      const record = day as Record<string, unknown>;
      return (
        hasExactKeys(record, dayKeys) &&
        typeof record.date === "string" &&
        typeof record.directRuns === "number" &&
        typeof record.directTokens === "number" &&
        typeof record.subagentRuns === "number" &&
        typeof record.subagentTokens === "number"
      );
    })
  );
}

export async function getCodexUsage(): Promise<CodexUsage> {
  try {
    const response = await fetch(USAGE_URL, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const payload: unknown = await response.json();
      if (isCodexUsage(payload)) {
        return payload;
      }
    }
  } catch {
    // The committed aggregate keeps the portfolio available if Blob is unreachable.
  }
  return snapshot as CodexUsage;
}
