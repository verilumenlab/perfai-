import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";

/**
 * Escapes CSV cell to prevent spreadsheet formula injection.
 * Prepends a single quote if the string begins with =, +, -, @, \t, or \r.
 */
function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();

  // Protect against CSV formula execution in Excel/Sheets/LibreOffice
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape inner double quotes
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const type = searchParams.get("type")?.trim() || "";
    const priority = searchParams.get("priority")?.trim() || "";

    const where: Prisma.LeadWhereInput = {};

    if (status && status !== "ALL") where.status = status;
    if (type && type !== "ALL") where.enquiryType = type;
    if (priority && priority !== "ALL") where.priority = priority;

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { businessEmail: { contains: search } },
        { companyName: { contains: search } },
        { leadNumber: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // CSV Headers
    const headers = [
      "Lead Ref",
      "Type",
      "Created At",
      "Status",
      "Priority",
      "Full Name",
      "Business Email",
      "Company Name",
      "Job Title",
      "Phone Number",
      "Country",
      "Industry",
      "Facility Type",
      "Area of Interest",
      "Facility Size",
      "Partnership Type",
      "Source Page",
      "UTM Source",
      "Message",
    ];

    const rows = leads.map((l) => [
      sanitizeCsvCell(l.leadNumber),
      sanitizeCsvCell(l.enquiryType),
      sanitizeCsvCell(l.createdAt.toISOString()),
      sanitizeCsvCell(l.status),
      sanitizeCsvCell(l.priority),
      sanitizeCsvCell(l.fullName),
      sanitizeCsvCell(l.businessEmail),
      sanitizeCsvCell(l.companyName),
      sanitizeCsvCell(l.jobTitle),
      sanitizeCsvCell(l.phoneNumber || ""),
      sanitizeCsvCell(l.country),
      sanitizeCsvCell(l.industry),
      sanitizeCsvCell(l.facilityType || ""),
      sanitizeCsvCell(l.areaOfInterest || ""),
      sanitizeCsvCell(l.facilitySize || ""),
      sanitizeCsvCell(l.partnershipType || ""),
      sanitizeCsvCell(l.sourcePage),
      sanitizeCsvCell(l.utmSource || ""),
      sanitizeCsvCell(l.message),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `perfai-leads-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[CSV Export Error]:", error);
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 });
  }
}
