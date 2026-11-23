/**
 * Pluggable CRM integration adapter.
 * Allows effortless forwarding of new enterprise leads to external CRMs (Salesforce, HubSpot, custom webhooks).
 */

export interface CrmLeadPayload {
  leadNumber: string;
  enquiryType: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  jobTitle: string;
  phoneNumber?: string | null;
  country: string;
  industry: string;
  facilityType?: string | null;
  areaOfInterest?: string | null;
  facilitySize?: string | null;
  partnershipType?: string | null;
  message: string;
  sourcePage: string;
  createdAt: Date;
}

export interface CrmAdapter {
  syncLead(lead: CrmLeadPayload): Promise<{ success: boolean; externalId?: string; error?: string }>;
}

export class WebhookCrmAdapter implements CrmAdapter {
  constructor(
    private webhookUrl?: string,
    private bearerToken?: string
  ) {}

  async syncLead(lead: CrmLeadPayload) {
    if (!this.webhookUrl) {
      // No CRM webhook configured; no-op successfully
      return { success: true };
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.bearerToken ? { Authorization: `Bearer ${this.bearerToken}` } : {}),
        },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `CRM webhook responded with status ${response.status}`,
        };
      }

      const data = await response.json().catch(() => ({}));
      return { success: true, externalId: data.id || data.leadId };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown CRM sync failure";
      return { success: false, error: msg };
    }
  }
}

export const crmAdapter: CrmAdapter = new WebhookCrmAdapter(
  process.env.CRM_WEBHOOK_URL,
  process.env.CRM_API_BEARER_TOKEN
);
