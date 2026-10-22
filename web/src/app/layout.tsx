import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | CBSE School in Nagarbhavi, Bengaluru`, template: `%s | ${site.name}` },
  description: `${site.name} is a CBSE school in Nagarbhavi, Bengaluru for Nursery to Grade 10. ${site.tagline}`,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "en_IN", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0D3161",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
