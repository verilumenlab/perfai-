import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin, validateCsrf, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[Admin Lead Detail Error]:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const csrfCheck = validateCsrf(req, token);
    if (!csrfCheck.valid) {
      return NextResponse.json({ success: false, error: csrfCheck.reason }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const existingLead = await prisma.lead.findUnique({ where: { id } });
    if (!existingLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};

    // 1. Status update
    if (body.status && body.status !== existingLead.status) {
      updates.status = body.status;
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          adminUserId: admin.id,
          action: "STATUS_CHANGE",
          previousValue: existingLead.status,
          newValue: body.status,
          note: `Status updated by ${admin.name}`,
        },
      });
    }

    // 2. Priority update
    if (body.priority && body.priority !== existingLead.priority) {
      updates.priority = body.priority;
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          adminUserId: admin.id,
          action: "PRIORITY_CHANGE",
          previousValue: existingLead.priority,
          newValue: body.priority,
          note: `Priority updated by ${admin.name}`,
        },
      });
    }

    // 3. Add internal note
    if (body.newNote && typeof body.newNote === "string" && body.newNote.trim().length > 0) {
      const trimmedNote = body.newNote.trim();
      await prisma.leadNote.create({
        data: {
          leadId: id,
          adminUserId: admin.id,
          authorName: admin.name,
          note: trimmedNote,
        },
      });

      await prisma.leadActivity.create({
        data: {
          leadId: id,
          adminUserId: admin.id,
          action: "NOTE_ADDED",
          note: `Internal note added by ${admin.name}`,
        },
      });
    }

    if (Object.keys(updates).length > 0) {
      await prisma.lead.update({
        where: { id },
        data: updates,
      });
    }

    // Fetch refreshed lead
    const updatedLead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error("[Admin Lead PATCH Error]:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

