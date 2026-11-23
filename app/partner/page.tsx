import type { Metadata } from "next";
import { HashRedirect } from "@/components/layout/HashRedirect";

export const metadata: Metadata = {
  title: "Partner",
  robots: { index: false, follow: true },
};

/** Old /partner URLs land on the unified contact form. */
export default function PartnerRedirectPage() {
  return <HashRedirect hash="demo" />;
}
