/**
 * Simple Cache Utility for AI-Generated Data
 * Caches successful API responses to avoid redundant calls
 * Supports both Node.js (filesystem) and Browser (localStorage) environments
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// Detect if we're running in a browser
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export interface CacheConfig {
  enabled: boolean;
  directory: string;
  ttl?: number; // Time to live in milliseconds (optional)
  storagePrefix?: string; // Prefix for localStorage keys (browser only)
}

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Default cache configuration
 */
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  enabled: true,
  directory: isBrowser ? 'cache' : path.join(process.cwd(), '.cache', 'ai-data'),
  ttl: 24 * 60 * 60 * 1000, // 24 hours default
  storagePrefix: 'docgen-cache:',
};

/**
 * Generate a cache key from input parameters
 */
export function generateCacheKey(...params: any[]): string {
  const content = JSON.stringify(params);
  if (isBrowser) {
    // Use SubtleCrypto API in browser
    return simpleHash(content);
  }
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Simple hash function for browser environment
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Initialize cache directory (Node.js only)
 */
function ensureCacheDirectory(config: CacheConfig): void {
  if (isBrowser) return;
  if (!fs.existsSync(config.directory)) {
    fs.mkdirSync(config.directory, { recursive: true });
  }
}

/**
 * Get cache file path (Node.js only)
 */
function getCacheFilePath(config: CacheConfig, key: string): string {
  return path.join(config.directory, `${key}.json`);
}

/**
 * Get localStorage key (Browser only)
 */
function getStorageKey(config: CacheConfig, key: string): string {
  return `${config.storagePrefix || 'cache:'}${key}`;
}

/**
 * Check if cache entry is expired
 */
function isExpired(entry: CacheEntry<any>): boolean {
  if (!entry.expiresAt) {
    return false; // No expiration set
  }
  return Date.now() > entry.expiresAt;
}

/**
 * Get data from cache (Browser - localStorage)
 */
function getFromLocalStorage<T>(config: CacheConfig, key: string): T | null {
  try {
    const storageKey = getStorageKey(config, key);
    const item = window.localStorage.getItem(storageKey);
    
    if (!item) {
      return null;
    }

    const entry: CacheEntry<T> = JSON.parse(item);

    // Check if expired
    if (isExpired(entry)) {
      console.log(`🗑️  Cache expired for key: ${key.substring(0, 8)}...`);
      window.localStorage.removeItem(storageKey);
      return null;
    }

    console.log(`✨ Cache hit (localStorage) for key: ${key.substring(0, 8)}...`);
    return entry.data;
  } catch (error) {
    console.warn(`⚠️  Failed to read from localStorage:`, error);
    return null;
  }
}

/**
 * Get data from cache (Node.js - filesystem)
 */
function getFromFileSystem<T>(config: CacheConfig, key: string): T | null {
  try {
    const filePath = getCacheFilePath(config, key);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(fileContent);

    // Check if expired
    if (isExpired(entry)) {
      console.log(`🗑️  Cache expired for key: ${key.substring(0, 8)}...`);
      fs.unlinkSync(filePath); // Delete expired cache
      return null;
    }

    console.log(`✨ Cache hit (filesystem) for key: ${key.substring(0, 8)}...`);
    return entry.data;
  } catch (error) {
    console.warn(`⚠️  Failed to read from cache:`, error);
    return null;
  }
}

/**
 * Get data from cache
 */
export function getFromCache<T>(
  config: CacheConfig,
  key: string
): T | null {
  if (!config.enabled) {
    return null;
  }

  if (isBrowser) {
    return getFromLocalStorage<T>(config, key);
  } else {
    return getFromFileSystem<T>(config, key);
  }
}

/**
 * Save data to cache (Browser - localStorage)
 */
function saveToLocalStorage<T>(config: CacheConfig, key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: config.ttl ? Date.now() + config.ttl : undefined,
    };

    const storageKey = getStorageKey(config, key);
    window.localStorage.setItem(storageKey, JSON.stringify(entry));
    
    console.log(`💾 Cached response (localStorage) for key: ${key.substring(0, 8)}...`);
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn(`⚠️  localStorage quota exceeded. Attempting to clear old entries...`);
      clearExpiredCache(config);
      // Try again after clearing
      try {
        const entry: CacheEntry<T> = {
          key,
          data,
          timestamp: Date.now(),
          expiresAt: config.ttl ? Date.now() + config.ttl : undefined,
        };
        window.localStorage.setItem(getStorageKey(config, key), JSON.stringify(entry));
        console.log(`💾 Cached response (localStorage) after cleanup for key: ${key.substring(0, 8)}...`);
      } catch (retryError) {
        console.warn(`⚠️  Failed to save to localStorage even after cleanup:`, retryError);
      }
    } else {
      console.warn(`⚠️  Failed to save to localStorage:`, error);
    }
  }
}

/**
 * Save data to cache (Node.js - filesystem)
 */
function saveToFileSystem<T>(config: CacheConfig, key: string, data: T): void {
  try {
    ensureCacheDirectory(config);

    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: config.ttl ? Date.now() + config.ttl : undefined,
    };

    const filePath = getCacheFilePath(config, key);
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8');
    
    console.log(`💾 Cached response (filesystem) for key: ${key.substring(0, 8)}...`);
  } catch (error) {
    console.warn(`⚠️  Failed to save to cache:`, error);
  }
}

/**
 * Save data to cache
 */
export function saveToCache<T>(
  config: CacheConfig,
  key: string,
  data: T
): void {
  if (!config.enabled) {
    return;
  }

  if (isBrowser) {
    saveToLocalStorage<T>(config, key, data);
  } else {
    saveToFileSystem<T>(config, key, data);
  }
}

/**
 * Clear all cache entries (Browser - localStorage)
 */
function clearLocalStorage(config: CacheConfig): void {
  try {
    const prefix = config.storagePrefix || 'cache:';
    const keysToRemove: string[] = [];
    
    // Find all keys with our prefix
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove them
    keysToRemove.forEach(key => window.localStorage.removeItem(key));
    console.log(`🗑️  Cleared ${keysToRemove.length} cache entries from localStorage`);
  } catch (error) {
    console.warn(`⚠️  Failed to clear localStorage cache:`, error);
  }
}

/**
 * Clear all cache entries (Node.js - filesystem)
 */
function clearFileSystem(config: CacheConfig): void {
  if (!fs.existsSync(config.directory)) {
    return;
  }

  try {
    const files = fs.readdirSync(config.directory);
    for (const file of files) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(config.directory, file));
      }
    }
    console.log(`🗑️  Cleared ${files.length} cache entries from filesystem`);
  } catch (error) {
    console.warn(`⚠️  Failed to clear filesystem cache:`, error);
  }
}

/**
 * Clear all cache entries
 */
export function clearCache(config: CacheConfig): void {
  if (isBrowser) {
    clearLocalStorage(config);
  } else {
    clearFileSystem(config);
  }
}

/**
 * Clear expired cache entries (Browser - localStorage)
 */
function clearExpiredLocalStorage(config: CacheConfig): void {
  try {
    const prefix = config.storagePrefix || 'cache:';
    const keysToRemove: string[] = [];
    
    // Find all keys with our prefix
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const item = window.localStorage.getItem(key);
          if (item) {
            const entry: CacheEntry<any> = JSON.parse(item);
            if (isExpired(entry)) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // Invalid entry, remove it
          keysToRemove.push(key);
        }
      }
    }
    
    // Remove expired entries
    keysToRemove.forEach(key => window.localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`🗑️  Cleared ${keysToRemove.length} expired cache entries from localStorage`);
    }
  } catch (error) {
    console.warn(`⚠️  Failed to clear expired localStorage cache:`, error);
  }
}

/**
 * Clear expired cache entries (Node.js - filesystem)
 */
function clearExpiredFileSystem(config: CacheConfig): void {
  if (!fs.existsSync(config.directory)) {
    return;
  }

  try {
    const files = fs.readdirSync(config.directory);
    let expiredCount = 0;

    for (const file of files) {
      if (!file.endsWith('.json')) {
        continue;
      }

      const filePath = path.join(config.directory, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const entry: CacheEntry<any> = JSON.parse(fileContent);

      if (isExpired(entry)) {
        fs.unlinkSync(filePath);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      console.log(`🗑️  Cleared ${expiredCount} expired cache entries from filesystem`);
    }
  } catch (error) {
    console.warn(`⚠️  Failed to clear expired filesystem cache:`, error);
  }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(config: CacheConfig): void {
  if (isBrowser) {
    clearExpiredLocalStorage(config);
  } else {
    clearExpiredFileSystem(config);
  }
}

/**
 * Get cache statistics (Browser - localStorage)
 */
function getLocalStorageStats(config: CacheConfig): {
  totalEntries: number;
  expiredEntries: number;
  validEntries: number;
  totalSize: number;
} {
  try {
    const prefix = config.storagePrefix || 'cache:';
    let totalEntries = 0;
    let expiredEntries = 0;
    let validEntries = 0;
    let totalSize = 0;

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const item = window.localStorage.getItem(key);
          if (item) {
            totalEntries++;
            totalSize += new Blob([item]).size; // Approximate size in bytes
            
            const entry: CacheEntry<any> = JSON.parse(item);
            if (isExpired(entry)) {
              expiredEntries++;
            } else {
              validEntries++;
            }
          }
        } catch {
          // Invalid entry
          totalEntries++;
        }
      }
    }

    return {
      totalEntries,
      expiredEntries,
      validEntries,
      totalSize,
    };
  } catch (error) {
    console.warn(`⚠️  Failed to get localStorage cache stats:`, error);
    return {
      totalEntries: 0,
      expiredEntries: 0,
      validEntries: 0,
      totalSize: 0,
    };
  }
}

/**
 * Get cache statistics (Node.js - filesystem)
 */
function getFileSystemStats(config: CacheConfig): {
  totalEntries: number;
  expiredEntries: number;
  validEntries: number;
  totalSize: number;
} {
  if (!fs.existsSync(config.directory)) {
    return {
      totalEntries: 0,
      expiredEntries: 0,
      validEntries: 0,
      totalSize: 0,
    };
  }

  try {
    const files = fs.readdirSync(config.directory);
    let totalEntries = 0;
    let expiredEntries = 0;
    let validEntries = 0;
    let totalSize = 0;

    for (const file of files) {
      if (!file.endsWith('.json')) {
        continue;
      }

      totalEntries++;
      const filePath = path.join(config.directory, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const entry: CacheEntry<any> = JSON.parse(fileContent);

      if (isExpired(entry)) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries,
      expiredEntries,
      validEntries,
      totalSize,
    };
  } catch (error) {
    console.warn(`⚠️  Failed to get filesystem cache stats:`, error);
    return {
      totalEntries: 0,
      expiredEntries: 0,
      validEntries: 0,
      totalSize: 0,
    };
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(config: CacheConfig): {
  totalEntries: number;
  expiredEntries: number;
  validEntries: number;
  totalSize: number;
} {
  if (isBrowser) {
    return getLocalStorageStats(config);
  } else {
    return getFileSystemStats(config);
  }
}
