# Experiment 2: Firewall segmentation and NAT

## Objective

Prove that Office traffic cannot access the Trading VLAN, while permitted Office traffic can reach the outside through NAT.

## Procedure

On the firewall, load `configs/firewall/policy.nft` in the lab only. From an Office host (`10.10.30.0/24`):

```bash
ping -c 3 10.10.30.1
ping -c 3 10.10.10.10
curl http://example.com
sudo nft list ruleset
sudo tcpdump -ni any host 10.10.10.10
```

## Expected result

- Office gateway is reachable.
- Office-to-Trading traffic is dropped.
- Allowed Internet traffic is translated by the masquerade rule.
- Packet capture shows the denied attempt and no successful application response.

Save the real command output and a firewall screenshot in `outputs/02-firewall-and-nat.txt`.
