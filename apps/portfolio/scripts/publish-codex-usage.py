#!/usr/bin/env python3
"""Export local Codex aggregates and replace the public Vercel Blob object."""

from __future__ import annotations

import os
import shlex
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def environment_value(name: str) -> str:
    for line in (ROOT / ".env.local").read_text().splitlines():
        if line.startswith(f"{name}="):
            value = line.split("=", 1)[1].strip()
            parsed = shlex.split(value)
            if parsed:
                return parsed[0]
    raise RuntimeError(f"{name} is missing; run `vercel env pull .env.local --yes`")


def main() -> None:
    with tempfile.TemporaryDirectory() as directory:
        aggregate = Path(directory) / "codex-usage.json"
        subprocess.run(
            [
                sys.executable,
                str(ROOT / "scripts" / "export-codex-usage.py"),
                "--output",
                str(aggregate),
            ],
            check=True,
        )
        environment = os.environ.copy()
        environment["BLOB_READ_WRITE_TOKEN"] = environment_value(
            "BLOB_READ_WRITE_TOKEN"
        )
        subprocess.run(
            [
                "/opt/homebrew/bin/vercel",
                "blob",
                "put",
                str(aggregate),
                "--pathname",
                "codex-usage.json",
                "--content-type",
                "application/json",
                "--cache-control-max-age",
                "3600",
                "--force",
                "true",
                "--multipart",
                "false",
            ],
            check=True,
            cwd=ROOT,
            env=environment,
        )


if __name__ == "__main__":
    main()
