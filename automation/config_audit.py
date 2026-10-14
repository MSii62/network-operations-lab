#!/usr/bin/env python3
"""Audit lab configuration files for required network controls."""
from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path

@dataclass
class Finding:
    file: str
    control: str
    status: str
    detail: str

CHECKS = {
    "configs/frr/r1.conf": {
        "OSPF": ["router ospf", "ip ospf"],
        "Multicast": ["ip pim", "ip igmp"],
    },
    "configs/frr/r2.conf": {"OSPF": ["router ospf", "ip ospf"]},
    "configs/frr/edge-bgp.conf": {"BGP": ["router bgp", "neighbor"]},
    "configs/firewall/policy.nft": {
        "Firewall default deny": ["policy drop"],
        "NAT": ["masquerade"],
    },
}

def audit(root: Path) -> list[Finding]:
    findings: list[Finding] = []
    for relative, controls in CHECKS.items():
        path = root / relative
        text = path.read_text(encoding="utf-8").lower() if path.exists() else ""
        for control, tokens in controls.items():
            missing = [token for token in tokens if token.lower() not in text]
            findings.append(Finding(relative, control, "PASS" if not missing else "FAIL", "all required tokens present" if not missing else "missing: " + ", ".join(missing)))
    return findings

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--json", action="store_true", help="emit machine-readable output")
    args = parser.parse_args()
    findings = audit(args.root)
    if args.json:
        print(json.dumps([asdict(item) for item in findings], indent=2))
    else:
        for item in findings:
            print(f"[{item.status}] {item.file} | {item.control} | {item.detail}")
    return 1 if any(item.status == "FAIL" for item in findings) else 0

if __name__ == "__main__":
    raise SystemExit(main())
