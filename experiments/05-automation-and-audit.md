# Experiment 5: Automation and configuration audit

## Objective

Use Python to check endpoint reachability, audit network controls, and generate a machine-readable operations report.

## Procedure

From the project root:

```bash
python automation/network_health.py --targets 127.0.0.1,localhost
python automation/config_audit.py
python automation/generate_report.py
python -m unittest discover -s tests -v
```

## Expected result

The health checker reports reachable targets, the audit reports PASS for OSPF, BGP, multicast, firewall, and NAT controls, and the report is written to `reports/network-report.json`. All unit tests should pass.

Keep the output in `outputs/05-automation-and-audit.txt` after running it locally.
