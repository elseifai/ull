import type { Metadata } from "next";
import { hasImage } from "@/components/Img";
import { img } from "@/content/assets";
import { mediaVariant } from "@/content/media";
import { site } from "@/content/site";
import type { Page } from "@/content/types";

// Brand files come from the CDN once a stage publishes them; locally they are site-relative.
const absolute = (src: string) => (/^https?:/.test(src) ? src : `${site.url}${src}`);

export function pageUrl(slug: string) {
  return `${site.url}/${slug ? `${slug}/` : ""}`;
}

export function pageMetadata(page: Page): Metadata {
  const url = pageUrl(page.slug);
  const noindex = page.slug === "portal";
  // The hero photo's 1200×630 crop from the CDN; pages without one keep the site-wide /og.png.
  const og = mediaVariant(page.hero.image)?.og;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      ...(og && { images: [{ url: og, width: 1200, height: 630 }] }),
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function schoolJsonLd() {
  const a = site.address;
  return {
    "@context": "https://schema.org",
    "@type": ["School", "EducationalOrganization"],
    "@id": `${site.url}/#school`,
    name: site.legalName,
    alternateName: site.name,
    slogan: site.motto,
    description: `${site.board} school in ${a.locality}, ${a.city} for ${site.grades}. ${site.tagline}`,
    url: site.url,
    logo: hasImage(img.logo) ? absolute(img.logo) : `${site.url}/icon.svg`,
    ...(site.phone && { telephone: site.phone }),
    ...(site.email && { email: site.email }),
    address: {
      "@type": "PostalAddress",
      ...(a.street && { streetAddress: a.street }),
      addressLocality: `${a.locality}, ${a.city}`,
      addressRegion: a.region,
      ...(a.postalCode && { postalCode: a.postalCode }),
      addressCountry: a.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    parentOrganization: { "@type": "Organization", name: site.group },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function breadcrumbJsonLd(page: Page) {
  const items = [{ label: "Home", href: "/" }, ...(page.breadcrumb ?? []), { label: page.title, href: `/${page.slug}/` }];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: `${site.url}${it.href}` })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
