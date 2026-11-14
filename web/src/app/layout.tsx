import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/content/site";
import { group } from "@/content/brands";

// Page titles carry their brand ("… | ULL Auremont"); see pageMetadata in lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${group.name} | ${group.fullName} schools`, template: `%s | ${group.name}` },
  description: group.description,
  applicationName: group.name,
  openGraph: { siteName: group.name, locale: "en_IN", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
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
      <head>
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5LD9P9KD" />
        <script
          dangerouslySetInnerHTML={{
            __html: "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());",
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
