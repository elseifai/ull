import type { Accent } from "./types";
import { site } from "./site";

// ULL India is the umbrella; each school brand lives under its own path, and each campus
// under /<brand>/<city>/<locality>/ (plan 05). A new campus or brand is one entry here.

export const group = {
  name: "ULL India",
  fullName: site.group,
  tagline: site.groupTagline,
  description: "ULL India (United Learning League) is a group of schools in India. Each ULL school has its own curriculum and character, and shares one promise: inspiring generations.",
};

export type BrandSlug = "auremont" | "global";

export type Brand = {
  slug: BrandSlug;
  name: string;
  short: string; // the word after "ULL" in the logo
  board: string;
  grades?: string;
  accent: Accent;
  status: "live" | "launching";
  href: string;
  tagline: string;
  motto?: string;
};

export const brands: Record<BrandSlug, Brand> = {
  auremont: {
    slug: "auremont",
    name: site.name,
    short: "AUREMONT",
    board: site.board,
    grades: site.grades,
    accent: "orange",
    status: "live",
    href: "/auremont/",
    tagline: site.tagline,
    motto: site.motto,
  },
  global: {
    slug: "global",
    name: "ULL Global",
    short: "GLOBAL",
    board: "IB",
    accent: "teal",
    status: "launching",
    href: "/global/",
    // Keep within IB's rules for schools that are not yet authorised (plan 16).
    tagline: "An international school by ULL India, launching soon.",
  },
};

export type Campus = {
  brand: BrandSlug;
  name: string;
  locality: string;
  city: string;
  citySlug: string;
  slug: string;
  href: string;
  grades: string;
};

export const campuses: Campus[] = [
  {
    brand: "auremont",
    name: `${site.legalName}, ${site.address.locality}`,
    locality: site.address.locality,
    city: site.address.city,
    citySlug: "bengaluru",
    slug: "nagarbhavi",
    href: "/auremont/bengaluru/nagarbhavi/",
    grades: site.grades,
  },
];

export const campusAddress = () => {
  const a = site.address;
  return [a.street, a.locality, `${a.city}${a.postalCode ? ` ${a.postalCode}` : ""}`, a.region].filter(Boolean).join(", ");
};

export const directionsUrl = () => `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;

/** The brand a path belongs to; group pages (home, contact, portal, privacy) return null. */
export function brandOf(path: string): Brand | null {
  const first = path.split("/").filter(Boolean)[0];
  return first && first in brands ? brands[first as BrandSlug] : null;
}

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

const auremontNav: NavItem[] = [
  {
    label: "About",
    href: "/auremont/about/",
    children: [
      { label: "About ULL Auremont", href: "/auremont/about/" },
      { label: "What makes us unique", href: "/auremont/about/why-auremont/" },
      { label: "Our teachers", href: "/auremont/about/teachers/" },
    ],
  },
  {
    label: "Academics",
    href: "/auremont/academics/",
    children: [
      { label: "Our approach", href: "/auremont/academics/" },
      { label: "Foundational (Nursery–Grade 2)", href: "/auremont/academics/foundational/" },
      { label: "Preparatory (Grades 3–5)", href: "/auremont/academics/preparatory/" },
      { label: "Middle (Grades 6–8)", href: "/auremont/academics/middle/" },
      { label: "Secondary (Grades 9–10)", href: "/auremont/academics/secondary/" },
      { label: "Assessment and progress", href: "/auremont/academics/assessment/" },
    ],
  },
  {
    label: "Student Life",
    href: "/auremont/student-life/",
    children: [
      { label: "Sports & Fitness", href: "/auremont/student-life/sports/" },
      { label: "Pulse: weekly skills", href: "/auremont/student-life/pulse/" },
      { label: "Ruchi: hobby hour", href: "/auremont/student-life/ruchi/" },
      { label: "Kushala: life skills", href: "/auremont/student-life/kushala/" },
      { label: "Aurora Lab & robotics", href: "/auremont/student-life/aurora-lab/" },
      { label: "Summit Pathway", href: "/auremont/student-life/summit-pathway/" },
    ],
  },
  {
    label: "Campuses",
    href: "/auremont/bengaluru/",
    children: campuses
      .filter((c) => c.brand === "auremont")
      .flatMap((c) => [
        { label: `${c.locality}, ${c.city}`, href: c.href },
        { label: "Facilities and gallery", href: `${c.href}facilities/` },
      ]),
  },
  { label: "Parents", href: "/auremont/parents/" },
  {
    label: "Admissions",
    href: "/auremont/admissions/",
    children: [
      { label: "How to join", href: "/auremont/admissions/" },
      { label: "Book a campus visit", href: "/auremont/admissions/visit/" },
      { label: "Enquire", href: "/auremont/admissions/enquire/" },
      { label: "Parent expectations", href: "/parent-expectations/" },
      { label: "Questions parents ask", href: "/auremont/admissions/#faq" },
    ],
  },
  { label: "Contact", href: "/contact/" },
];

const globalNav: NavItem[] = [
  { label: "About ULL Global", href: "/global/" },
  { label: "Register interest", href: "/global/#enquire" },
  { label: "Visit ULL Auremont", href: "/auremont/" },
  { label: "Contact", href: "/contact/" },
];

const groupNav: NavItem[] = [
  {
    label: "Our schools",
    href: "/#schools",
    children: [
      ...Object.values(brands).map((b) => ({ label: `${b.name} (${b.board})`, href: b.href })),
      ...campuses.map((c) => ({ label: `${brands[c.brand].name}, ${c.locality}`, href: c.href })),
    ],
  },
  { label: "Admissions", href: "/auremont/admissions/" },
  { label: "Parent expectations", href: "/parent-expectations/" },
  { label: "Parent portal", href: "/portal/" },
  { label: "Contact", href: "/contact/" },
];

/** Header, footer and mobile-bar links for the brand a page belongs to. */
export function navFor(brand: Brand | null) {
  if (brand?.slug === "global") {
    return {
      nav: globalNav,
      utility: [{ label: "Register interest", href: "/global/#enquire" }, { label: "Parent Login", href: "/portal/" }],
      primary: { label: "Register interest", href: "/global/#enquire" },
      secondary: { label: "Contact us", href: "/contact/" },
    };
  }
  return {
    nav: brand ? auremontNav : groupNav,
    utility: [
      { label: "Book a Visit", href: "/auremont/admissions/visit/" },
      { label: "Enquire", href: "/auremont/admissions/enquire/" },
      { label: "Parent Login", href: "/portal/" },
    ],
    primary: { label: "Book a visit", href: "/auremont/admissions/visit/" },
    secondary: { label: "Enquire", href: "/auremont/admissions/enquire/" },
  };
}
