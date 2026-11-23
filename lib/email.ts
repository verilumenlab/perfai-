/**
 * Email notification service interface and implementation.
 * Sends staff alerts on new inbound leads and optional client acknowledgements.
 * Safe design: never blocks or crashes lead capture if email dispatch encounters network issues.
 */

export interface LeadNotificationPayload {
  leadNumber: string;
  enquiryType: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  jobTitle: string;
  phoneNumber?: string | null;
  country: string;
  industry: string;
  areaOfInterest?: string | null;
  partnershipType?: string | null;
  message: string;
  createdAt: Date;
}

export interface EmailProvider {
  sendLeadNotification(lead: LeadNotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendAcknowledgementEmail(to: string, name: string, leadNumber: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export class ResendOrMockEmailProvider implements EmailProvider {
  private apiKey = process.env.RESEND_API_KEY;
  private recipientEmail = process.env.NOTIFICATION_RECIPIENT_EMAIL || "leads@perfai.in";
  private senderEmail = process.env.NOTIFICATION_SENDER_EMAIL || "PerfAI Leads <no-reply@perfai.in>";

  async sendLeadNotification(lead: LeadNotificationPayload) {
    if (!this.apiKey) {
      console.log(
        `[EmailProvider Mock] New Lead Received [${lead.leadNumber}]: ${lead.fullName} (${lead.companyName}, ${lead.businessEmail}) - ${lead.enquiryType}`
      );
      return { success: true, messageId: `mock-${Date.now()}` };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: this.senderEmail,
          to: [this.recipientEmail],
          subject: `[New ${lead.enquiryType} Lead] ${lead.companyName} — ${lead.leadNumber}`,
          text: `A new ${lead.enquiryType} enquiry was received:\n\nReference: ${lead.leadNumber}\nName: ${lead.fullName}\nEmail: ${lead.businessEmail}\nCompany: ${lead.companyName}\nTitle: ${lead.jobTitle}\nPhone: ${lead.phoneNumber || "Not provided"}\nCountry: ${lead.country}\nIndustry: ${lead.industry}\nArea/Type: ${lead.areaOfInterest || lead.partnershipType || "General"}\n\nMessage:\n${lead.message}`,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return { success: false, error: `Resend HTTP ${res.status}: ${text}` };
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown email dispatch failure",
      };
    }
  }

  async sendAcknowledgementEmail(to: string, name: string, leadNumber: string) {
    if (!this.apiKey) {
      console.log(`[EmailProvider Mock] Acknowledgement sent to ${to} for ${leadNumber}`);
      return { success: true, messageId: `mock-ack-${Date.now()}` };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: this.senderEmail,
          to: [to],
          subject: `Thank you for contacting PerfAI [Ref: ${leadNumber}]`,
          text: `Dear ${name},\n\nThank you for reaching out to PerfAI regarding building management services.\n\nWe have received your enquiry (Reference: ${leadNumber}). A member of our team will review your requirements and follow up promptly.\n\nBest regards,\nPerfAI Client Success Team\nhttps://perfai.in`,
        }),
      });

      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}` };
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown acknowledgement dispatch failure",
      };
    }
  }
}

export const emailProvider: EmailProvider = new ResendOrMockEmailProvider();

