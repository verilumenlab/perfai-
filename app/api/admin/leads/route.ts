import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";

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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // Build Prisma where filter
    const where: Prisma.LeadWhereInput = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (type && type !== "ALL") {
      where.enquiryType = type;
    }

    if (priority && priority !== "ALL") {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { businessEmail: { contains: search } },
        { companyName: { contains: search } },
        { leadNumber: { contains: search } },
      ];
    }

    const [total, leads, statusCounts] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: { notes: true, activities: true },
          },
        },
      }),
      prisma.lead.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const totalLeads = await prisma.lead.count();
    const demoLeads = await prisma.lead.count({ where: { enquiryType: "DEMO" } });
    const partnerLeads = await prisma.lead.count({ where: { enquiryType: "PARTNER" } });
    const newLeads = await prisma.lead.count({ where: { status: "NEW" } });
    const urgentLeads = await prisma.lead.count({
      where: { priority: { in: ["HIGH", "URGENT"] } },
    });

    const stats = {
      total: totalLeads,
      new: newLeads,
      demo: demoLeads,
      partner: partnerLeads,
      urgent: urgentLeads,
      byStatus: Object.fromEntries(
        statusCounts.map((s) => [s.status, s._count._all])
      ),
    };

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("[Admin Leads API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

