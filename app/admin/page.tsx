import React from "react";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  const [totalLeads, leads, demoLeads, partnerLeads, newLeads, urgentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: {
        _count: {
          select: { notes: true, activities: true },
        },
      },
    }),
    prisma.lead.count({ where: { enquiryType: "DEMO" } }),
    prisma.lead.count({ where: { enquiryType: "PARTNER" } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { priority: { in: ["HIGH", "URGENT"] } } }),
  ]);

  const initialStats = {
    total: totalLeads,
    new: newLeads,
    demo: demoLeads,
    partner: partnerLeads,
    urgent: urgentLeads,
  };

  const initialLeadsFormatted = leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <AdminDashboard
      initialLeads={initialLeadsFormatted}
      initialStats={initialStats}
      initialTotal={totalLeads}
      initialTotalPages={Math.ceil(totalLeads / 15) || 1}
    />
  );
}
