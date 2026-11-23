import { NextRequest } from "next/server";

/**
 * Safely extracts client IP address.
 * Forwarded headers (x-forwarded-for, x-real-ip) are ONLY trusted when TRUST_PROXY is set to "true".
 * This prevents attackers from spoofing their IP by sending arbitrary headers directly to the application.
 */
export function getClientIp(req: NextRequest): string {
  const trustProxy = process.env.TRUST_PROXY === "true";

  if (trustProxy) {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      const parts = forwarded.split(",");
      const first = parts[0]?.trim();
      if (first) return first;
    }

    const realIp = req.headers.get("x-real-ip");
    if (realIp?.trim()) return realIp.trim();
  }

  // NextRequest ip property (available in edge/proxy or custom server environments)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directIp = (req as any).ip;
  if (directIp) return directIp;

  return "127.0.0.1";
}
