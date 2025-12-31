import { createClient } from 'redis';
// Redis client is optional; we avoid strict typing here to not require redis types at compile time

export interface CacheAdapter<T = unknown> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  getOrSet(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}

const REDIS_URL = process.env.REDIS_URL;
type RedisLike = {
  get(k: string): Promise<string | null>;
  setEx(k: string, ttl: number, v: string): Promise<unknown>;
  set(k: string, v: string): Promise<unknown>;
  del(...keys: string[]): Promise<unknown>;
  keys(pattern: string): Promise<string[]>;
  quit(): Promise<unknown>;
};

let redisClient: RedisLike | null = null;
if (REDIS_URL) {
  // create client lazily
  const client = createClient({ url: REDIS_URL });
  client.connect().catch((err: unknown) => {
    // Fail gracefully in case Redis is unavailable
    console.error('Redis connection error:', (err as Error).message);
  });
  redisClient = client as unknown as RedisLike;
}

// Utility to revive ISO date strings back to Date objects
const isIsoDate = (value: unknown): boolean => {
  if (typeof value !== 'string') return false;
  // basic ISO date format check
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return iso.test(value) && !Number.isNaN(Date.parse(value));
};

const parseJsonWithDates = (input: string) => {
  return JSON.parse(input, (_key, value) => {
    if (isIsoDate(value)) return new Date(value as string);
    return value;
  });
};

class InMemoryCache<T = unknown> implements CacheAdapter<T> {
  private map: Map<string, { value: T; expiresAt?: number }> = new Map();
  private inFlight: Map<string, Promise<T>> = new Map();
  private maxEntries: number;

  constructor(maxEntries = 500) {
    this.maxEntries = maxEntries;
  }

  private evictIfNeeded() {
    if (this.map.size <= this.maxEntries) return;
    const oldest = this.map.keys().next().value as string | undefined;
    if (oldest) this.map.delete(oldest);
  }

  async get(key: string): Promise<T | undefined> {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.map.delete(key);
      return undefined;
    }
    return entry.value;
  }

  async set(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.map.set(key, { value, expiresAt });
    this.evictIfNeeded();
  }

  async del(key: string): Promise<void> {
    this.map.delete(key);
  }

  async clear(): Promise<void> {
    this.map.clear();
  }

  async getOrSet(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    // fast path
    const existing = await this.get(key);
    if (existing !== undefined) return existing;

    // dedupe in-flight promises
    const inFlight = this.inFlight.get(key);
    if (inFlight) return inFlight;

    const promise = (async () => {
      try {
        const res = await fn();
        await this.set(key, res, ttlSeconds);
        return res;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }
}

class RedisCache<T = unknown> implements CacheAdapter<T> {
  private client: unknown;
  private inFlight: Map<string, Promise<T>> = new Map();
  private prefix: string;

  constructor(client: unknown, prefix = '') {
    this.client = client;
    this.prefix = prefix;
  }

  private key(k: string) {
    return this.prefix ? `${this.prefix}::${k}` : k;
  }

  async get(key: string): Promise<T | undefined> {
    const client = this.client as RedisLike;
    const data = await client.get(this.key(key));
    if (!data) return undefined;
    return parseJsonWithDates(data) as T;
  }

  async set(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      const client = this.client as RedisLike;
      await client.setEx(this.key(key), ttlSeconds, data);
    } else {
      const client = this.client as RedisLike;
      await client.set(this.key(key), data);
    }
  }

  async del(key: string): Promise<void> {
    const client = this.client as RedisLike;
    await client.del(this.key(key));
  }

  async clear(): Promise<void> {
    // dangerous in shared redis, so only delete keys with our prefix
    const pattern = this.prefix ? `${this.prefix}::*` : '*';
    const client = this.client as RedisLike;
    const keys = await client.keys(pattern);
    if (keys.length) await client.del(...keys);
  }

  async getOrSet(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const existing = await this.get(key);
    if (existing !== undefined) return existing;

    const inFlight = this.inFlight.get(key);
    if (inFlight) return inFlight;

    const promise = (async () => {
      try {
        const res = await fn();
        await this.set(key, res, ttlSeconds);
        return res;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }
}

const namespaceCache = new Map<string, CacheAdapter>();

export const getCacheAdapter = <T = unknown,>(name: string, maxEntries = 500): CacheAdapter<T> => {
  if (namespaceCache.has(name)) return namespaceCache.get(name) as CacheAdapter<T>;

  let adapter: CacheAdapter<T>;
  if (redisClient) {
    adapter = new RedisCache<T>(redisClient, name);
  } else {
    adapter = new InMemoryCache<T>(maxEntries);
  }

  namespaceCache.set(name, adapter);
  return adapter;
};

export const shutdownCache = async (): Promise<void> => {
  if (redisClient) {
    try {
      const client = redisClient as RedisLike;
      await client.quit();
      console.info('Redis client disconnected');
    } catch (err) {
      console.error('Error quitting redis client', (err as Error).message);
    }
  }
};