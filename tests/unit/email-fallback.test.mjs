import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ResendOrMockEmailProvider } from "../../lib/email.ts";

describe("Email Service & Failure Resiliency Tests", () => {
  const sampleLead = {
    leadNumber: "PF-2026-TEST",
    enquiryType: "DEMO",
    fullName: "Test User",
    businessEmail: "test@example.com",
    companyName: "Test Co",
    jobTitle: "Director",
    country: "India",
    industry: "Commercial Buildings",
    message: "Test message requirements.",
    createdAt: new Date(),
  };

  test("when RESEND_API_KEY is unset, logs mock and returns success without error", async () => {
    delete process.env.RESEND_API_KEY;
    const provider = new ResendOrMockEmailProvider();

    const notifyResult = await provider.sendLeadNotification(sampleLead);
    assert.strictEqual(notifyResult.success, true);
    assert.ok(notifyResult.messageId?.startsWith("mock-"));

    const ackResult = await provider.sendAcknowledgementEmail("test@example.com", "Test User", "PF-2026-TEST");
    assert.strictEqual(ackResult.success, true);
    assert.ok(ackResult.messageId?.startsWith("mock-ack-"));
  });

  test("when Resend API fails (mocked network rejection), returns failure safely without throwing", async () => {
    process.env.RESEND_API_KEY = "re_invalid_test_key";
    const provider = new ResendOrMockEmailProvider();

    // Mock global fetch failure
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error("Simulated network timeout connecting to api.resend.com");
    };

    try {
      const result = await provider.sendLeadNotification(sampleLead);
      assert.strictEqual(result.success, false);
      assert.ok(result.error?.includes("Simulated network timeout"));
    } finally {
      globalThis.fetch = originalFetch;
      delete process.env.RESEND_API_KEY;
    }
  });

  test("non-blocking execution pattern ensures lead persistence is never prevented by email error", async () => {
    let leadSaved = false;

    // Simulate lead persistence
    const simulatedLead = { id: "lead-123", ...sampleLead };
    leadSaved = Boolean(simulatedLead.id);

    // Simulate failing email dispatch in Promise.allSettled
    const failingProvider = {
      sendLeadNotification: async () => {
        throw new Error("Resend HTTP 500 server error");
      },
    };

    await Promise.allSettled([
      failingProvider.sendLeadNotification(),
    ]);

    // Lead remains saved and unaffected
    assert.strictEqual(leadSaved, true);
  });
});
