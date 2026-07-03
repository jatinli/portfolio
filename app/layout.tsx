import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data";
import SmoothScroll from "@/components/providers/SmoothScroll";
import AccentField from "@/components/providers/AccentField";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import FaviconProgress from "@/components/FaviconProgress";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} — AI Engineer & Researcher`,
  description: site.metaDescription,
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Data Science",
    "Research",
    "Deep Learning",
    site.name,
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — AI Engineer & Researcher`,
    description: site.metaDescription,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — AI Engineer & Researcher`,
    description: site.metaDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  email: `mailto:${site.email}`,
  jobTitle: "AI/ML Engineer & Data Scientist",
  url: site.links.github,
  sameAs: [site.links.github, site.links.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[130] focus:bg-fg focus:text-bg focus:px-4 focus:py-2 focus:rounded-full"
        >
          Skip to content
        </a>

        <AccentField>
          <Preloader />
          <Cursor />
          <FaviconProgress />
          <Nav />

          <SmoothScroll>
            <main id="main">{children}</main>
          </SmoothScroll>

          <div className="noise-overlay" aria-hidden />
        </AccentField>
      </body>
    </html>
  );
}
