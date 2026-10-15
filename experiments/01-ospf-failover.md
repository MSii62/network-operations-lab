# Experiment 1: OSPF adjacency and failover

## Objective

Verify that Core R1 and Core R2 form an OSPF adjacency and that traffic can use the backup link when the primary link fails.

## Prerequisites

- Import `configs/frr/r1.conf` and `configs/frr/r2.conf` into FRRouting routers.
- Connect R1 `eth0` to R2 `eth0` and R1 `eth1` to R2 `eth1`.

## Procedure

```text
show ip ospf neighbor
show ip route ospf
ping 10.10.30.1
```

Shut the primary link on R1:

```text
configure terminal
interface eth0
shutdown
end
show ip ospf neighbor
show ip route 10.10.30.0/24
```

Restore it:

```text
configure terminal
interface eth0
no shutdown
end
```

## Expected result

The neighbor remains reachable through the second /30 link after reconvergence. The route to `10.10.30.0/24` changes its next hop/interface during the failure.

Record adjacency state, convergence time, and before/after route output in `outputs/01-ospf-failover.txt`.
