import type { Metadata } from "next";
import { hasImage } from "@/components/Img";
import { img } from "@/content/assets";
import { mediaVariant } from "@/content/media";
import { site } from "@/content/site";
import type { Page } from "@/content/types";
import { brandOf, brands, campuses, group } from "@/content/brands";

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
  const title = `${page.title} | ${brandOf(`/${page.slug}`)?.name ?? group.name}`;
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: page.description,
      url,
      type: "website",
      ...(og && { images: [{ url: og, width: 1200, height: 630 }] }),
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

const logo = () => (hasImage(img.logo) ? absolute(img.logo) : `${site.url}/icon.svg`);

/** ULL India and its school brands, on every page. Campus pages add their own School. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#org`,
    name: group.name,
    legalName: group.fullName,
    slogan: group.tagline,
    url: `${site.url}/`,
    logo: `${site.url}/icon.svg`,
    subOrganization: Object.values(brands).map((b) => ({
      "@type": "EducationalOrganization",
      "@id": `${site.url}${b.href}#brand`,
      name: b.name,
      url: `${site.url}${b.href}`,
    })),
    department: campuses.map((c) => ({ "@id": `${site.url}${c.href}#school` })),
  };
}

export function schoolJsonLd() {
  const a = site.address;
  const campus = campuses[0];
  return {
    "@context": "https://schema.org",
    "@type": ["School", "EducationalOrganization"],
    "@id": `${site.url}${campus.href}#school`,
    name: campus.name,
    alternateName: site.name,
    slogan: site.motto,
    description: `${site.board} school in ${a.locality}, ${a.city} for ${site.grades}. ${site.tagline}`,
    url: `${site.url}${campus.href}`,
    logo: logo(),
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
    openingHours: "Mo-Sa 09:00-16:00", // TODO: keep in step with site.hours once confirmed
    parentOrganization: { "@id": `${site.url}/#org` },
    brand: { "@id": `${site.url}${brands[campus.brand].href}#brand` },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

/** Breadcrumb links above a page: its brand home first, then the page's own trail. */
export function trail(page: Pick<Page, "slug" | "breadcrumb">) {
  const crumbs = page.breadcrumb ?? [];
  const brand = brandOf(`/${page.slug}`);
  if (!brand || page.slug === brand.slug || crumbs.some((c) => c.href === brand.href)) return crumbs;
  return [{ label: brand.name, href: brand.href }, ...crumbs];
}

export function breadcrumbJsonLd(page: Pick<Page, "slug" | "breadcrumb" | "title">) {
  const items = [{ label: "Home", href: "/" }, ...trail(page), { label: page.title, href: `/${page.slug}/` }];
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
