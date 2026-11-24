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
    default: "PerfAI | Building Management Channel Partner",
    template: "%s | PerfAI",
  },
  description:
    "PerfAI is a channel partner for building management services — helping commercial facilities adopt BMS, HVAC and energy solutions that fit real operations.",
  alternates: {
    canonical: siteConfig.domain,
  },
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: siteConfig.domain,
    siteName: "PerfAI",
    title: "PerfAI | Building Management Channel Partner",
    description:
      "Channel partner for building management services: HVAC, energy monitoring, BMS integration and facility operations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PerfAI | Building Management Channel Partner",
    description:
      "Channel partner for building management services for commercial facilities.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PerfAI",
  url: siteConfig.domain,
  logo: `${siteConfig.domain}${siteConfig.logo.light}`,
  description:
    "Channel partner for building management services for commercial buildings and facilities.",
  knowsAbout: [
    "Building Management Systems",
    "HVAC Optimisation",
    "Energy Monitoring",
    "Facility Operations",
    "BMS Integration",
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
