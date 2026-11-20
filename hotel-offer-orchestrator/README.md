# Hotel Offer Orchestrator

Node.js/TypeScript + Express + Temporal + Redis implementation of a hotel-offer aggregator.

## Run with Docker

```bash
docker compose up --build
```

The API is at `http://localhost:3000`, Temporal UI at `http://localhost:8080`.

```bash
curl 'http://localhost:3000/api/hotels?city=delhi'
curl 'http://localhost:3000/api/hotels?city=delhi&minPrice=5000&maxPrice=6000'
curl http://localhost:3000/health
```

Import `postman_collection.json` into Postman for the ready-made scenarios. Stop with `docker compose down`.

## Local development

Start Redis and a Temporal server on ports 6379 and 7233, then:

```bash
npm install
npm run build
npm run dev       # terminal 1: API
npm run dev:worker # terminal 2: Temporal worker
```

## Design

- `/supplierA/hotels` and `/supplierB/hotels` are deterministic mock supplier APIs. They intentionally overlap `Holtin` and `Radison`.
- `/api/hotels` starts a Temporal `compareHotels` workflow. The workflow invokes both supplier activities with `Promise.all`, so calls happen in parallel.
- The workflow chooses the lower price case-insensitively for each hotel name and preserves the winning supplier and commission.
- The complete de-duplicated result is saved to Redis. A Redis hash stores hotel JSON and a sorted set indexes names by price. `ZRANGEBYSCORE` performs the requested price filtering in Redis, not in Node.js.
- Temporal activity retries make supplier and Redis operations resilient; API errors return a useful 4xx/5xx response and are logged.
- `/health` checks both supplier health endpoints and Redis and returns HTTP 503 when any dependency is unhealthy.

## Project structure

`src/server.ts` HTTP API and mock suppliers; `src/workflows.ts` Temporal orchestration; `src/activities.ts` supplier/cache activities; `src/redis.ts` Redis persistence/query; `src/worker.ts` worker bootstrap; `Dockerfile`, `docker-compose.yml`, and `postman_collection.json` provide deployment and testing.
