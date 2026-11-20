import Redis from 'ioredis';
import { HotelResult } from './types';
import { config } from './config';
export const redis = new Redis(config.redisUrl);

const key = (city: string) => `hotels:${city.toLowerCase()}`;
const index = (city: string) => `hotels:price:${city.toLowerCase()}`;

export async function saveHotels(city: string, hotels: HotelResult[]) {
  const multi = redis.multi();
  multi.del(key(city), index(city));
  for (const hotel of hotels) {
    const value = JSON.stringify(hotel);
    multi.hset(key(city), hotel.name, value);
    multi.zadd(index(city), hotel.price, hotel.name);
  }
  await multi.exec();
}
export async function filterHotels(city: string, minPrice = 0, maxPrice = Number.MAX_SAFE_INTEGER): Promise<HotelResult[]> {
  const names = await redis.zrangebyscore(index(city), minPrice, maxPrice);
  if (!names.length) return [];
  const values = await redis.hmget(key(city), ...names);
  return values.filter((v): v is string => Boolean(v)).map(v => JSON.parse(v));
}
