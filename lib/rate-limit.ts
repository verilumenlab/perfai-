/**
 * In-memory sliding window rate limiter for API endpoints.
 * Protects lead submission from rapid spam without requiring external Redis.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale records periodically
const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (record.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): RateLimitResult {
  cleanupStaleRecords(windowMs);

  const now = Date.now();
  const record = rateLimitMap.get(identifier) ?? { timestamps: [] };

  // Filter timestamps within the current sliding window
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
  rateLimitMap.set(identifier, record);

  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}
