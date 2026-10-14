#!/usr/bin/env python3
"""Small, dependency-free reachability and latency checker for lab endpoints."""
from __future__ import annotations

import argparse
import platform
import subprocess
import sys
import time
from dataclasses import dataclass

@dataclass
class Result:
    target: str
    ok: bool
    latency_ms: float | None
    detail: str

def check(target: str, timeout: int) -> Result:
    flag = "-n" if platform.system().lower() == "windows" else "-c"
    timeout_flag = "-w" if platform.system().lower() == "windows" else "-W"
    command = ["ping", flag, "1", timeout_flag, str(timeout), target]
    started = time.perf_counter()
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    elapsed = (time.perf_counter() - started) * 1000
    if completed.returncode == 0:
        return Result(target, True, elapsed, "reachable")
    detail = completed.stderr.strip() or "no response"
    return Result(target, False, None, detail)

def main() -> int:
    parser = argparse.ArgumentParser(description="Check lab endpoint reachability")
    parser.add_argument("--targets", required=True, help="Comma-separated hostnames or IP addresses")
    parser.add_argument("--timeout", type=int, default=2, help="Ping timeout in seconds")
    args = parser.parse_args()
    results = [check(target.strip(), args.timeout) for target in args.targets.split(",") if target.strip()]
    print(f"{'TARGET':<24} {'STATUS':<10} {'LATENCY':<12} DETAIL")
    print("-" * 65)
    failed = 0
    for result in results:
        if not result.ok:
            failed += 1
        latency = f"{result.latency_ms:.1f} ms" if result.latency_ms is not None else "-"
        print(f"{result.target:<24} {('UP' if result.ok else 'DOWN'):<10} {latency:<12} {result.detail}")
    return 1 if failed else 0

if __name__ == "__main__":
    sys.exit(main())
