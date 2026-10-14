# Troubleshooting runbook

## 1. Endpoint unreachable

```bash
ip addr
ip route
ping -c 3 <gateway>
traceroute <destination>
sudo tcpdump -ni any host <destination>
```

Check in order: link state, IP address, gateway, route table, firewall policy, and return path.

## 2. OSPF neighbor is down

```text
show ip ospf neighbor
show ip ospf interface
show running-config
```

Confirm both ends use the same subnet, area, network type, and are not passive. Check the interface with `ip link` and `tcpdump -ni <interface> proto ospf`.

## 3. Multicast is not arriving

```text
show ip pim neighbor
show ip igmp join
show ip mroute
```

Confirm the receiver joined the group, PIM neighbors exist, and the source/RP route is available. Capture with `tcpdump -ni any multicast`.

## 4. Monitoring target is down

```bash
docker compose ps
curl http://localhost:9090/-/ready
curl http://localhost:9115/-/healthy
python automation/network_health.py --targets 127.0.0.1,localhost
```

## Evidence to capture for the portfolio

- Screenshot of the topology
- OSPF neighbor output before and after link failure
- Grafana dashboard
- Wireshark multicast capture
- Automation script output
