/**
 * Pluggable Rate Limiter Interface & Memory Implementation.
 * In single-instance dev, MemoryRateLimiter operates smoothly.
 * In multi-instance distributed production, RedisRateLimiter can be substituted via this interface.
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export interface RateLimiter {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
}

interface RateLimitRecord {
  timestamps: number[];
}

export class MemoryRateLimiter implements RateLimiter {
  private map = new Map<string, RateLimitRecord>();
  private lastCleanup = Date.now();
  private cleanupIntervalMs = 60 * 1000;

  private cleanup(windowMs: number) {
    const now = Date.now();
    if (now - this.lastCleanup < this.cleanupIntervalMs) return;
    this.lastCleanup = now;

    for (const [key, record] of this.map.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        this.map.delete(key);
      }
    }
  }

  async check(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    this.cleanup(windowMs);

    const now = Date.now();
    const record = this.map.get(key) ?? { timestamps: [] };

    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (record.timestamps.length >= limit) {
      const oldestTimestamp = record.timestamps[0];
      const resetMs = windowMs - (now - oldestTimestamp);
      return {
        success: false,
        limit,
        remaining: 0,
        resetMs: Math.max(0, resetMs),
      };
    }

    record.timestamps.push(now);
    this.map.set(key, record);

    return {
      success: true,
      limit,
      remaining: limit - record.timestamps.length,
      resetMs: windowMs,
    };
  }

  async reset(key: string): Promise<void> {
    this.map.delete(key);
  }
}

// Default global instance
export const rateLimiter: RateLimiter = new MemoryRateLimiter();

// Convenience helper matching existing signature
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): Promise<RateLimitResult> {
  return rateLimiter.check(identifier, limit, windowMs);
}
