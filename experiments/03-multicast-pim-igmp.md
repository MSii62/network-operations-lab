# Experiment 3: PIM/IGMP multicast

## Objective

Verify that a receiver joins a multicast group and that multicast traffic is forwarded only where it is subscribed.

## Procedure

On the receiver, join group `239.1.1.1` using a suitable lab multicast tool. On the sender, transmit to the same group. On FRR routers:

```text
show ip pim neighbor
show ip igmp join
show ip mroute
```

Capture traffic:

```bash
sudo tcpdump -ni any host 239.1.1.1
```

## Expected result

PIM neighbors are present, the receiver appears in the IGMP membership table, and the multicast route shows the source and outgoing interface. An unsubscribed receiver should not receive the stream.

Save the actual outputs in `outputs/03-multicast-pim-igmp.txt`.
