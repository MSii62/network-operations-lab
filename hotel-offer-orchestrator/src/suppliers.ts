import { Hotel } from './types';

const data: Record<string, Hotel[]> = {
  A: [
    { hotelId: 'a1', name: 'Holtin', price: 6000, city: 'delhi', commissionPct: 10 },
    { hotelId: 'a2', name: 'Radison', price: 5900, city: 'delhi', commissionPct: 13 },
    { hotelId: 'a3', name: 'Taj Palace', price: 9000, city: 'delhi', commissionPct: 12 },
  ],
  B: [
    { hotelId: 'b1', name: 'Holtin', price: 5340, city: 'delhi', commissionPct: 20 },
    { hotelId: 'b2', name: 'Radison', price: 6200, city: 'delhi', commissionPct: 11 },
    { hotelId: 'b3', name: 'The Oberoi', price: 8500, city: 'delhi', commissionPct: 15 },
  ],
};
export function hotelsFor(supplier: 'A' | 'B', city: string): Hotel[] {
  return (data[supplier] || []).filter(h => h.city.toLowerCase() === city.toLowerCase());
}
