import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { SkipLink } from "@/components/layout/SkipLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "PerfAI | SENATRIA — Authorised Partner",
    template: "%s | PerfAI",
  },
  description:
    "PerfAI is an authorised reseller and business partner bringing Senatria's Physical AI platform to commercial enterprises and infrastructure operators.",
  alternates: {
    canonical: siteConfig.domain,
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: siteConfig.domain,
    siteName: "PerfAI",
    title: "PerfAI | SENATRIA — Authorised Partner",
    description:
      "Enterprise deployment partner for Senatria Physical AI infrastructure solutions: ATRIA, BuildingShield, GridShield, ComputeShield.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PerfAI | SENATRIA — Authorised Partner",
    description:
      "Enterprise deployment partner for Senatria Physical AI infrastructure solutions.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PerfAI",
  url: siteConfig.domain,
  description:
    "Authorised commercial partner and reseller of Senatria Physical AI infrastructure solutions.",
  knowsAbout: [
    "Physical AI",
    "BuildingShield",
    "GridShield",
    "ComputeShield",
    "HVAC Optimization",
    "Building Management Systems",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-deep text-white">
        <SkipLink />
        <Navbar />
        <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
