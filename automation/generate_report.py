#!/usr/bin/env python3
"""Generate a JSON operations report from inventory probes and config audit."""
from __future__ import annotations

import argparse
import json
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

from config_audit import audit

def ping(target: str) -> dict[str, object]:
    command = ["ping", "-n", "-c", "1", "-W", "2", target]
    # Windows uses different flags; retry with its native form when needed.
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        result = subprocess.run(["ping", "-n", "1", "-w", "2000", target], capture_output=True, text=True, check=False)
    return {"target": target, "reachable": result.returncode == 0}

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path, default=Path("reports/network-report.json"))
    args = parser.parse_args()
    inventory = json.loads((args.root / "automation/inventory.json").read_text(encoding="utf-8"))
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "probes": [ping(target) for target in inventory["probes"]],
        "configuration_audit": [item.__dict__ for item in audit(args.root)],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
