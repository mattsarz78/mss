export interface CacheAdapter<T = unknown> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
  getOrSet(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T>;
}

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

const namespaceCache = new Map<string, CacheAdapter>();

export const getCacheAdapter = <T = unknown,>(name: string, maxEntries = 500): CacheAdapter<T> => {
  if (namespaceCache.has(name)) return namespaceCache.get(name) as CacheAdapter<T>;

  const adapter = new InMemoryCache<T>(maxEntries);

  namespaceCache.set(name, adapter);
  return adapter;
};

export const shutdownCache = async (): Promise<void> => {
  for (const adapter of namespaceCache.values()) {
    try {
      await adapter.clear();
    } catch (err) {
      console.error('Error clearing cache adapter', (err as Error).message);
    }
  }
  namespaceCache.clear();
};
