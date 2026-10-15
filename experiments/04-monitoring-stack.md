# Experiment 4: Monitoring stack

## Objective

Use Docker Compose to monitor endpoint reachability and display metrics in Grafana.

## Procedure

```bash
docker compose up -d
docker compose ps
curl http://localhost:9090/-/ready
curl http://localhost:9115/-/healthy
```

Open `http://localhost:3000`, sign in with the local lab credentials from `docker-compose.yml`, and open the **Network Operations Lab** dashboard.

Stop and restart a monitored service to create a visible status change:

```bash
docker compose stop node-exporter
docker compose start node-exporter
```

## Expected result

Prometheus is ready, Grafana loads the provisioned dashboard, and the Node Exporter status changes during the stop/start test. Replace the demo password before exposing Grafana.

Save `docker compose ps` output and screenshots in `outputs/04-monitoring-stack.txt`.
