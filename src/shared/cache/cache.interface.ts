export interface CacheBase {
  // Retrieve a value from the cache as a string or parsed object
  getKey(key: string): Promise<string | object | undefined>;

  // Save a string value in the cache
  setKey(key: string, value: string | object): Promise<void>;

  // Save a value (string or object) with an expiration time in the cache
  setKeyWithExpiry(
    key: string,
    value: string | object,
    exp: number,
  ): Promise<void>;

  // Delete a key from the cache
  deleteKey(key: string): Promise<void>;
}
export const CACHE_BASE = "CACHE_BASE";
