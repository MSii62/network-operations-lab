import express, { Request, Response } from 'express';
import { Connection, Client } from '@temporalio/client';
import { config } from './config';
import { hotelsFor } from './suppliers';
import { redis } from './redis';
import { compareHotels } from './workflows';

const app = express();
app.use(express.json());
const queryNumber = (value: unknown, fallback: number) => value === undefined ? fallback : Number(value);

app.get('/supplierA/hotels', (req, res) => res.json(hotelsFor('A', String(req.query.city || ''))));
app.get('/supplierB/hotels', (req, res) => res.json(hotelsFor('B', String(req.query.city || ''))));
app.get('/health', async (_req, res) => {
  const check = async (path: string) => { try { const r = await fetch(`${config.supplierBaseUrl}${path}`); return r.ok; } catch { return false; } };
  let redisOk = true; try { await redis.ping(); } catch { redisOk = false; }
  const [supplierA, supplierB] = await Promise.all([check('/supplierA/health'), check('/supplierB/health')]);
  const healthy = supplierA && supplierB && redisOk;
  res.status(healthy ? 200 : 503).json({ status: healthy ? 'ok' : 'degraded', suppliers: { supplierA, supplierB }, redis: redisOk });
});
app.get('/supplierA/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/supplierB/health', (_req, res) => res.json({ status: 'ok' }));

let temporalClient: Client;
app.get('/api/hotels', async (req: Request, res: Response) => {
  const city = String(req.query.city || '').trim().toLowerCase();
  if (!city) return res.status(400).json({ error: 'city is required' });
  const minPrice = queryNumber(req.query.minPrice, 0);
  const maxPrice = queryNumber(req.query.maxPrice, Number.MAX_SAFE_INTEGER);
  if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice) || minPrice < 0 || maxPrice < minPrice) return res.status(400).json({ error: 'minPrice and maxPrice must be valid, and minPrice <= maxPrice' });
  try {
    const result = await temporalClient.workflow.execute(compareHotels, { args: [{ city, minPrice, maxPrice }], taskQueue: 'hotel-offers', workflowId: `hotel-${city}-${Date.now()}` });
    res.json(result);
  } catch (error) {
    console.error('hotel workflow failed', error);
    res.status(502).json({ error: 'Unable to retrieve hotel offers' });
  }
});

async function main() {
  const connection = await Connection.connect({ address: config.temporalAddress });
  temporalClient = new Client({ connection, namespace: config.temporalNamespace });
  app.listen(config.port, () => console.log(`API listening on port ${config.port}`));
}
main().catch(error => { console.error(error); process.exit(1); });
