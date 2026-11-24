import type { Metadata } from "next";
import { ManagementPage } from "@/components/sections/ManagementPage";
import { managementPage } from "@/content/management";

export const metadata: Metadata = {
  title: managementPage.meta.title,
  description: managementPage.meta.description,
  alternates: {
    canonical: "/management",
  },
  openGraph: {
    title: `${managementPage.meta.title} | PerfAI`,
    description: managementPage.meta.description,
    url: "/management",
  },
};

export default function ManagementRoutePage() {
  return <ManagementPage />;
}
