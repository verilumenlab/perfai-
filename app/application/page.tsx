import type { Metadata } from "next";
import { HashRedirect } from "@/components/layout/HashRedirect";

export const metadata: Metadata = {
  title: "Application",
  robots: { index: false, follow: true },
};

/** Old /application URLs land on home demo. */
export default function ApplicationRedirectPage() {
  return <HashRedirect hash="demo" />;
}
