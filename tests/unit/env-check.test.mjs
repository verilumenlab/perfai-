import { describe, it } from "node:test";
import assert from "node:assert";

describe("Fail-Closed Production Environment Validation", () => {
  it("should pass in development mode even if production variables are short", async () => {
    const origEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = "development";
      const { validateEnvironment } = await import(`../../lib/env-check.ts?dev=${Date.now()}`);
      assert.doesNotThrow(() => validateEnvironment());
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  it("should throw in production mode if required secrets are missing or short", async () => {
    const origEnv = process.env.NODE_ENV;
    const origSecret = process.env.CSRF_SECRET;
    try {
      process.env.NODE_ENV = "production";
      process.env.CSRF_SECRET = "too-short"; // < 32 characters
      await assert.rejects(
        async () => {
          await import(`../../lib/env-check.ts?prod=${Date.now()}`);
        },
        /CRITICAL SECURITY CONFIGURATION ERROR|FATAL STARTUP SECURITY ERROR/
      );
    } finally {
      process.env.NODE_ENV = origEnv;
      process.env.CSRF_SECRET = origSecret;
    }
  });

  it("should succeed in production mode when all secrets are present and meet minimum length", async () => {
    const origEnv = process.env.NODE_ENV;
    const origDb = process.env.DATABASE_URL;
    const origSession = process.env.ADMIN_SESSION_SECRET;
    const origCsrf = process.env.CSRF_SECRET;
    try {
      process.env.NODE_ENV = "production";
      process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/perfai_db";
      process.env.ADMIN_SESSION_SECRET = "perfai-super-secret-session-key-production-valid-32chars";
      process.env.CSRF_SECRET = "perfai-super-secret-csrf-key-production-valid-32chars";
      const { validateEnvironment } = await import(`../../lib/env-check.ts?valid=${Date.now()}`);
      assert.doesNotThrow(() => validateEnvironment());
    } finally {
      process.env.NODE_ENV = origEnv;
      process.env.DATABASE_URL = origDb;
      process.env.ADMIN_SESSION_SECRET = origSession;
      process.env.CSRF_SECRET = origCsrf;
    }
  });
});
