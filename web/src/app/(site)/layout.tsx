import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { JsonLd } from "@/components/JsonLd";
import { schoolJsonLd } from "@/lib/seo";
import { img } from "@/content/assets";
import { hasImage } from "@/components/Img";

// The public website: header, footer and the mobile action bar around every page.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded bg-navy px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <JsonLd data={schoolJsonLd()} />
      <Header logoSrc={hasImage(img.logo) ? img.logo : undefined} />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <MobileBar />
    </>
  );
}
