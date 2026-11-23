import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { demoFormSchema, partnerFormSchema } from "@/lib/validation";
import { emailProvider } from "@/lib/email";
import { crmAdapter } from "@/lib/crm";

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction and Rate Limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submission attempts. Please wait 60 seconds before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
          },
        }
      );
    }

    // 2. Parse body
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // 3. Honeypot check (silently drop bot submissions)
    if (body.hp_website && body.hp_website.length > 0) {
      // Return fake success to deceive spam bots
      return NextResponse.json({
        success: true,
        leadNumber: `PF-${new Date().getFullYear()}-0000`,
        message: "Thank you. Your request has been received.",
      });
    }

    // 4. Minimum time-to-submit verification (1.5 seconds)
    if (body.formLoadTime && typeof body.formLoadTime === "number") {
      const elapsedMs = Date.now() - body.formLoadTime;
      // Allow fast submission only if process.env.NODE_ENV === "test"
      if (elapsedMs < 1200 && process.env.NODE_ENV !== "test") {
        return NextResponse.json({
          success: true,
          leadNumber: `PF-${new Date().getFullYear()}-0000`,
          message: "Thank you. Your request has been received.",
        });
      }
    }

    // 5. Schema validation based on enquiry type
    const enquiryType = body.enquiryType === "PARTNER" ? "PARTNER" : "DEMO";

    let validatedData;
    if (enquiryType === "PARTNER") {
      const result = partnerFormSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: result.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
      validatedData = result.data;
    } else {
      const result = demoFormSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: result.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
      validatedData = result.data;
    }

    // 6. Generate human-readable reference number (PF-YYYY-XXXX)
    const currentYear = new Date().getFullYear();
    const count = await prisma.lead.count();
    let leadNumber = `PF-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    // Ensure uniqueness in the rare case of sequence collision
    const existing = await prisma.lead.findUnique({ where: { leadNumber } });
    if (existing) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      leadNumber = `PF-${currentYear}-${randomSuffix}`;
    }

    // 7. Persist to database
    const lead = await prisma.lead.create({
      data: {
        leadNumber,
        enquiryType,
        fullName: validatedData.fullName,
        businessEmail: validatedData.businessEmail,
        companyName: validatedData.companyName,
        jobTitle: validatedData.jobTitle,
        phoneNumber: validatedData.phoneNumber || null,
        country: validatedData.country,
        industry: validatedData.industry,
        facilityType: "facilityType" in validatedData ? validatedData.facilityType || null : null,
        areaOfInterest: "areaOfInterest" in validatedData ? validatedData.areaOfInterest || null : null,
        facilitySize: "facilitySize" in validatedData ? validatedData.facilitySize || null : null,
        partnershipType: "partnershipType" in validatedData ? validatedData.partnershipType || null : null,
        message: validatedData.message,
        privacyConsent: true,
        consentTimestamp: new Date(),
        sourcePage: validatedData.sourcePage || "/",
        utmSource: validatedData.utmSource || null,
        utmMedium: validatedData.utmMedium || null,
        utmCampaign: validatedData.utmCampaign || null,
        status: "NEW",
        priority: "NORMAL",
        activities: {
          create: {
            action: "CREATED",
            note: `Inbound ${enquiryType} enquiry registered from ${validatedData.sourcePage || "/"}`,
          },
        },
      },
    });

    // 8. Trigger background integrations (non-blocking)
    Promise.allSettled([
      emailProvider.sendLeadNotification(lead),
      emailProvider.sendAcknowledgementEmail(lead.businessEmail, lead.fullName, lead.leadNumber),
      crmAdapter.syncLead(lead),
    ]).catch((err) => {
      console.error("[Lead Background Sync Error]:", err);
    });

    return NextResponse.json(
      {
        success: true,
        leadNumber: lead.leadNumber,
        message: "Your enquiry has been successfully registered.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[Leads API Error]:", error);
    // Never leak database stack traces to the public
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process your enquiry at this moment. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed" },
    { status: 405 }
  );
}
