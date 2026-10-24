#!/usr/bin/env python3
"""Export privacy-safe aggregate Codex usage from local telemetry."""

from __future__ import annotations

import argparse
import collections
import datetime as dt
import json
import os
import sqlite3
import tempfile
from pathlib import Path
from zoneinfo import ZoneInfo


TIMEZONE = ZoneInfo("Asia/Kolkata")
PUBLIC_KEYS = (
    "cachedInputTokens",
    "directRuns",
    "outputTokens",
    "processedTokens",
    "runs",
    "subagentProcessedTokens",
    "subagentRuns",
)


def thread_kind(row: sqlite3.Row, child_ids: set[str]) -> str | None:
    if row["id"] in child_ids or row["thread_source"] == "subagent":
        return "subagent"
    if row["thread_source"] == "user" or (
        row["thread_source"] is None and row["source"] == "vscode"
    ):
        return "direct"
    return None


def final_token_usage(path: str) -> dict[str, int] | None:
    if not os.path.isfile(path):
        return None

    final: dict[str, int] | None = None
    with open(path, encoding="utf-8", errors="replace") as rollout:
        for line in rollout:
            if '"token_count"' not in line:
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue
            payload = item.get("payload") or {}
            if item.get("type") == "event_msg" and payload.get("type") == "token_count":
                usage = (payload.get("info") or {}).get("total_token_usage")
                if usage:
                    final = usage
    return final


def empty_totals() -> collections.Counter[str]:
    return collections.Counter({key: 0 for key in PUBLIC_KEYS})


def activity_insights(
    daily: dict[dt.date, collections.Counter[str]],
) -> dict[str, int | str | None]:
    active = [record["runs"] > 0 for record in daily.values()]
    longest = 0
    running = 0
    for is_active in active:
        running = running + 1 if is_active else 0
        longest = max(longest, running)

    current = 0
    index = len(active) - 1
    if index >= 0 and not active[index] and index > 0 and active[index - 1]:
        index -= 1
    while index >= 0 and active[index]:
        current += 1
        index -= 1

    peak_day, peak = max(
        daily.items(), key=lambda item: item[1]["processedTokens"], default=(None, None)
    )
    return {
        "activeDays": sum(active),
        "currentStreakDays": current,
        "longestStreakDays": longest,
        "peakDailyDate": peak_day.isoformat() if peak_day else None,
        "peakDailyTokens": peak["processedTokens"] if peak else 0,
    }


def aggregate(db_path: Path, now: dt.datetime | None = None) -> dict[str, object]:
    generated = (now or dt.datetime.now(dt.timezone.utc)).astimezone(TIMEZONE)
    last_day = generated.date()
    first_30_day = last_day - dt.timedelta(days=29)
    observed_daily: collections.defaultdict[
        dt.date, collections.Counter[str]
    ] = collections.defaultdict(empty_totals)
    totals = empty_totals()

    connection = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    try:
        child_ids = {
            row[0]
            for row in connection.execute("SELECT child_thread_id FROM thread_spawn_edges")
        }
        rows = connection.execute(
            "SELECT id, rollout_path, created_at, source, thread_source "
            "FROM threads ORDER BY created_at"
        )

        since: dt.date | None = None
        for row in rows:
            kind = thread_kind(row, child_ids)
            if kind is None:
                continue
            usage = final_token_usage(row["rollout_path"])
            if usage is None:
                continue

            day = dt.datetime.fromtimestamp(row["created_at"], TIMEZONE).date()
            if day > last_day:
                continue
            since = day if since is None else min(since, day)
            record = empty_totals()
            record.update(
                {
                    "cachedInputTokens": int(usage.get("cached_input_tokens") or 0),
                    "directRuns": int(kind == "direct"),
                    "outputTokens": int(usage.get("output_tokens") or 0),
                    "processedTokens": int(usage.get("total_tokens") or 0),
                    "runs": 1,
                    "subagentProcessedTokens": (
                        int(usage.get("total_tokens") or 0) if kind == "subagent" else 0
                    ),
                    "subagentRuns": int(kind == "subagent"),
                }
            )
            totals.update(record)
            observed_daily[day].update(record)
    finally:
        connection.close()

    first_day = since or first_30_day
    daily = {
        day: observed_daily[day]
        for day in (
            first_day + dt.timedelta(days=index)
            for index in range((last_day - first_day).days + 1)
        )
    }
    last_30 = empty_totals()
    for day, record in daily.items():
        if day >= first_30_day:
            last_30.update(record)

    return {
        "version": 2,
        "generatedAt": generated.astimezone(dt.timezone.utc).isoformat().replace("+00:00", "Z"),
        "timezone": TIMEZONE.key,
        "since": first_day.isoformat(),
        "totals": dict(totals),
        "last30Days": dict(last_30),
        "insights": activity_insights(daily),
        "daily": [
            {
                "date": day.isoformat(),
                "directRuns": record["directRuns"],
                "subagentRuns": record["subagentRuns"],
                "directTokens": record["processedTokens"]
                - record["subagentProcessedTokens"],
                "subagentTokens": record["subagentProcessedTokens"],
            }
            for day, record in daily.items()
        ],
    }


def write_json(payload: dict[str, object], output: Path | None) -> None:
    rendered = json.dumps(payload, indent=2) + "\n"
    if output is None:
        print(rendered, end="")
        return

    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", dir=output.parent, delete=False) as handle:
        handle.write(rendered)
        temporary = Path(handle.name)
    temporary.replace(output)


def self_test() -> None:
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        database = root / "state.sqlite"
        connection = sqlite3.connect(database)
        connection.executescript(
            """
            CREATE TABLE threads (
              id TEXT PRIMARY KEY, rollout_path TEXT, created_at INTEGER,
              source TEXT, thread_source TEXT
            );
            CREATE TABLE thread_spawn_edges (
              parent_thread_id TEXT, child_thread_id TEXT PRIMARY KEY, status TEXT
            );
            """
        )
        now = dt.datetime(2026, 8, 25, 12, tzinfo=dt.timezone.utc)

        def add_thread(identifier: str, source: str, thread_source: str | None, tokens: int) -> None:
            rollout = root / f"{identifier}.jsonl"
            rollout.write_text(
                json.dumps(
                    {
                        "type": "event_msg",
                        "payload": {
                            "type": "token_count",
                            "info": {
                                "total_token_usage": {
                                    "total_tokens": tokens,
                                    "cached_input_tokens": tokens // 2,
                                    "output_tokens": tokens // 10,
                                }
                            },
                        },
                    }
                )
                + "\n"
            )
            connection.execute(
                "INSERT INTO threads VALUES (?, ?, ?, ?, ?)",
                (identifier, str(rollout), int(now.timestamp()), source, thread_source),
            )

        add_thread("direct", "vscode", "user", 100)
        add_thread("child", "vscode", None, 300)
        add_thread("automation", "vscode", "automation", 900)
        connection.execute("INSERT INTO thread_spawn_edges VALUES ('direct', 'child', 'done')")
        connection.commit()
        connection.close()

        payload = aggregate(database, now)
        assert payload["totals"] == {
            "cachedInputTokens": 200,
            "directRuns": 1,
            "outputTokens": 40,
            "processedTokens": 400,
            "runs": 2,
            "subagentProcessedTokens": 300,
            "subagentRuns": 1,
        }
        assert payload["daily"][-1]["directTokens"] == 100
        assert payload["daily"][-1]["subagentTokens"] == 300
        assert payload["insights"] == {
            "activeDays": 1,
            "currentStreakDays": 1,
            "longestStreakDays": 1,
            "peakDailyDate": "2026-08-25",
            "peakDailyTokens": 400,
        }
        assert payload["version"] == 2
        rendered = json.dumps(payload)
        assert all(key not in rendered for key in ('"id"', '"path"', '"prompt"', '"title"'))
    print("Codex usage exporter self-check passed")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--database",
        type=Path,
        default=Path.home() / ".codex" / "state_5.sqlite",
    )
    parser.add_argument("--output", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    write_json(aggregate(args.database), args.output)


if __name__ == "__main__":
    main()
