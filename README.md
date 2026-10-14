# Production-Style Network Operations Lab

A portfolio project that models a small trading/data-center network and demonstrates VLAN design, routing, multicast, firewalling, monitoring, troubleshooting, and automation.

## Skills demonstrated

- IPv4 addressing and subnetting
- VLAN segmentation and trunk design
- OSPF and static routing
- BGP configuration reference
- PIM/IGMP multicast design
- Linux networking and packet capture
- Firewall policy and NAT design
- Prometheus/Grafana monitoring
- Python network-health automation

## Topology

```text
                 +----------------+
                 |   Edge Router  |
                 |  BGP / Default |
                 +--------+-------+
                          |
                    +-----+------+
                    | Core R1   |
                    | OSPF      |
                    +--+-----+--+
                       |     |
                 +-----+     +------+
                 |                   |
             Core R2            Firewall
             OSPF             pfSense/nftables
                 |                   |
       +---------+---------+     +---+---+
       |                   |     |       |
  Trading VLAN         Server VLAN  Office VLAN
  Multicast             Monitoring  NAT clients
```

Detailed addressing and implementation notes are in [`docs/network-design.md`](docs/network-design.md).

## Repository layout

```text
configs/       FRR, firewall, and device configuration examples
automation/    Python health-check, config-audit, inventory, and reporting tools
monitoring/    Prometheus and Grafana configuration
docs/          Design, operations, and troubleshooting runbooks
scripts/       Validation and demo scripts
```

## Quick start: monitoring stack

Docker is only required for the monitoring demonstration.

```bash
docker compose up -d
```

Open:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin; change this locally)

Check status:

```bash
docker compose ps
python automation/network_health.py --targets 127.0.0.1,localhost
python automation/config_audit.py
python automation/generate_report.py
python -m unittest discover -s tests -v
```

The audit checks that routing, multicast, BGP, firewall, and NAT controls are present. The report is written to `reports/network-report.json`.

Stop the stack:

```bash
docker compose down
```

## Network lab

The routing and multicast configurations are written for a GNS3/EVE-NG lab using FRRouting. Import two FRR router appliances, connect the interfaces according to the design, then apply the files in `configs/frr/`.

The files are intentionally separated from Docker Compose so the repository can be used with either GNS3, EVE-NG, or physical lab equipment.

## Safety

All addresses and credentials in this repository are lab-only examples. Do not connect this topology to a production network. Replace the Grafana demo password before exposing the service.

## Validation scenarios

1. Shut down the R1-R2 primary link and verify OSPF reconvergence.
2. Block Office VLAN to Trading VLAN on the firewall and verify the policy with `ping` and `tcpdump`.
3. Start a multicast sender and verify that only IGMP subscribers receive traffic.
4. Stop a monitored endpoint and confirm the health script reports it.
5. Query Prometheus for node availability and display the result in Grafana.

See [`docs/troubleshooting-runbook.md`](docs/troubleshooting-runbook.md) for commands and expected observations.
