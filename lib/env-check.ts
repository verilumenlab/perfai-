/**
 * Production environment and secret validation.
 * Fail-closed startup: In production, enforces mandatory presence and minimum entropy
 * for critical security credentials.
 */

export function validateEnvironment(): void {
  // Only enforce strict fail-closed constraints in production runtime
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const checks: Array<{ name: string; value: string | undefined; minLen: number }> = [
    { name: "DATABASE_URL", value: process.env.DATABASE_URL, minLen: 10 },
    { name: "ADMIN_SESSION_SECRET", value: process.env.ADMIN_SESSION_SECRET, minLen: 32 },
    { name: "CSRF_SECRET", value: process.env.CSRF_SECRET, minLen: 32 },
  ];

  const errors: string[] = [];

  for (const check of checks) {
    if (!check.value || check.value.trim() === "") {
      errors.push(`Missing mandatory environment variable: ${check.name}`);
    } else if (check.value.length < check.minLen) {
      errors.push(
        `Environment variable ${check.name} does not meet minimum length requirement (${check.value.length}/${check.minLen} chars)`
      );
    }
  }

  if (errors.length > 0) {
    const message = `[FATAL STARTUP SECURITY ERROR] Production startup aborted due to configuration flaws:\n${errors.join("\n")}`;
    console.error(message);
    throw new Error(message);
  }
}

// Automatically execute check on module initialization
validateEnvironment();

