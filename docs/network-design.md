# Network design

## Address plan

| Segment | CIDR | Gateway | Purpose |
|---|---|---|---|
| Trading | 10.10.10.0/24 | 10.10.10.1 | Low-latency application hosts |
| Servers | 10.10.20.0/24 | 10.10.20.1 | Linux services and monitoring |
| Office | 10.10.30.0/24 | 10.10.30.1 | User endpoints and NAT |
| Management | 10.10.40.0/24 | 10.10.40.1 | Device administration |
| OSPF primary | 10.255.0.0/30 | .1/.2 | R1-R2 link |
| OSPF backup | 10.255.0.4/30 | .5/.6 | R1-R2 backup link |
| Loopbacks | 10.255.255.0/24 | — | Stable router IDs |

## Design decisions

- OSPF area 0 is used for internal dynamic routing.
- The second R1-R2 link provides a simple failover exercise.
- Office traffic is isolated from the Trading VLAN by firewall policy.
- PIM/IGMP is enabled only where multicast is required.
- Monitoring traffic is placed in the Server/Management segments.

## Verification commands

```text
show ip ospf neighbor
show ip ospf route
show ip route
show ip pim neighbor
show ip igmp join
ping 10.10.20.10
traceroute 10.10.10.10
```
