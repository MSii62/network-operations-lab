import { config } from './config';
import { filterHotels, saveHotels } from './redis';
import { Hotel, HotelResult, Supplier } from './types';

async function fetchSupplier(path: string, city: string): Promise<Hotel[]> {
  const response = await fetch(`${config.supplierBaseUrl}${path}?city=${encodeURIComponent(city)}`);
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return response.json() as Promise<Hotel[]>;
}
export async function fetchSupplierA(city: string) { return fetchSupplier('/supplierA/hotels', city); }
export async function fetchSupplierB(city: string) { return fetchSupplier('/supplierB/hotels', city); }
export async function cacheHotels(city: string, hotels: HotelResult[]) { await saveHotels(city, hotels); }
export async function readHotels(city: string, minPrice: number, maxPrice: number) { return filterHotels(city, minPrice, maxPrice); }

export function deduplicate(a: Hotel[], b: Hotel[]): HotelResult[] {
  const best = new Map<string, HotelResult>();
  for (const hotel of [...a.map(h => ({ ...h, supplier: 'Supplier A' as Supplier })), ...b.map(h => ({ ...h, supplier: 'Supplier B' as Supplier }))]) {
    const result: HotelResult = { name: hotel.name, price: hotel.price, supplier: hotel.supplier, commissionPct: hotel.commissionPct };
    const current = best.get(hotel.name.toLowerCase());
    if (!current || result.price < current.price) best.set(hotel.name.toLowerCase(), result);
  }
  return [...best.values()].sort((x, y) => x.price - y.price);
}
