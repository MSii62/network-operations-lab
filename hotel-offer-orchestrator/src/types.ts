export type Supplier = 'Supplier A' | 'Supplier B';
export interface Hotel { hotelId: string; name: string; price: number; city: string; commissionPct: number; supplier?: Supplier; }
export interface HotelResult { name: string; price: number; supplier: Supplier; commissionPct: number; }
