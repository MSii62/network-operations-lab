import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';
import { HotelResult } from './types';
const { fetchSupplierA, fetchSupplierB, cacheHotels, readHotels } = proxyActivities<typeof activities>({ startToCloseTimeout: '30 seconds', retry: { maximumAttempts: 3 } });

export interface HotelQuery { city: string; minPrice?: number; maxPrice?: number; }
export async function compareHotels(query: HotelQuery): Promise<HotelResult[]> {
  const [a, b] = await Promise.all([fetchSupplierA(query.city), fetchSupplierB(query.city)]);
  const byName = new Map<string, HotelResult>();
  for (const hotel of [...a.map(h => ({ ...h, supplier: 'Supplier A' as const })), ...b.map(h => ({ ...h, supplier: 'Supplier B' as const }))]) {
    const candidate = { name: hotel.name, price: hotel.price, supplier: hotel.supplier, commissionPct: hotel.commissionPct };
    const existing = byName.get(hotel.name.toLowerCase());
    if (!existing || candidate.price < existing.price) byName.set(hotel.name.toLowerCase(), candidate);
  }
  const all = [...byName.values()].sort((x, y) => x.price - y.price);
  await cacheHotels(query.city, all);
  return readHotels(query.city, query.minPrice ?? 0, query.maxPrice ?? Number.MAX_SAFE_INTEGER);
}
