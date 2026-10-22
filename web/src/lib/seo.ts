import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Page } from "@/content/types";

export function pageUrl(slug: string) {
  return `${site.url}/${slug ? `${slug}/` : ""}`;
}

export function pageMetadata(page: Page): Metadata {
  const url = pageUrl(page.slug);
  const noindex = page.slug === "portal";
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { title: page.title, description: page.description, url, type: "website" },
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
    logo: `${site.url}/icon.svg`,
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
