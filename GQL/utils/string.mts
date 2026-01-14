const SPLIT_CACHE_MAX = 2000;
const splitCache = new Map<string, string[]>();

const makeKey = (input: string, delimiter: string) => `${delimiter}::${input}`;

export const splitComma = (input: string): string[] => splitBy(input, ',');

export const splitBy = (input: string, delimiter = ','): string[] => {
  if (!input) return [];
  const key = makeKey(input, delimiter);
  const cached = splitCache.get(key);
  if (cached) return cached;
  const parts = input.split(delimiter);
  splitCache.set(key, parts);
  if (splitCache.size > SPLIT_CACHE_MAX) {
    const oldest = splitCache.keys().next().value as string | undefined;
    if (oldest) splitCache.delete(oldest);
  }
  return parts;
};
