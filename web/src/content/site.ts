import cms from "./cms.json";

type Settings = Partial<{
  admissionsYear: string; phone: string; whatsapp: string; email: string; hours: string; affiliation: string;
  address: { street?: string; postalCode?: string };
  social: Partial<Record<"instagram" | "facebook" | "youtube" | "linkedin", string>>;
}>;
const s = (cms.settings ?? {}) as Settings;

// School-wide settings. Values saved in the CMS "Site settings" override these.
// Empty strings are content gaps still to be supplied
// (see ULL-Auremont-Content-Map.xlsx); components hide anything left empty.

const defaults = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ullindia.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  group: "United Learning League",
  groupTagline: "Inspiring Generations",
  name: "ULL Auremont",
  legalName: "ULL Auremont School",
  motto: "Rooted deep. Rising high.",
  tagline: "Strong academics. Indian roots. Learning for life.",
  headline: "Every lesson connects. Every child rises.",
  promise: "The schooling you wish you’d had",
  board: "CBSE",
  grades: "Nursery to Grade 10",
  admissionsYear: "", // e.g. "2027–28"
  address: {
    street: "", // TODO: street address
    locality: "Nagarbhavi",
    city: "Bengaluru",
    region: "Karnataka",
    postalCode: "", // TODO: PIN
    country: "IN",
  },
  geo: { lat: 12.9606, lng: 77.5096 }, // approximate Nagarbhavi; replace with campus pin
  phone: "", // TODO: e.g. "+91 80 0000 0000"
  whatsapp: "", // TODO: WATI number, digits only with country code, e.g. "918000000000"
  email: "", // TODO: admissions email
  hours: "Monday to Saturday, 9:00 am to 4:00 pm", // TODO: confirm office hours
  affiliation: "", // TODO: "CBSE Affiliation No. ____ · School Code ____"
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
  },
  ambassador: { name: "Jonty Rhodes", role: "Brand Ambassador" },
};

export const site = {
  ...defaults,
  admissionsYear: s.admissionsYear || defaults.admissionsYear,
  phone: s.phone || defaults.phone,
  whatsapp: s.whatsapp || defaults.whatsapp,
  email: s.email || defaults.email,
  hours: s.hours || defaults.hours,
  affiliation: s.affiliation || defaults.affiliation,
  address: { ...defaults.address, street: s.address?.street || defaults.address.street, postalCode: s.address?.postalCode || defaults.address.postalCode },
  social: { ...defaults.social, ...Object.fromEntries(Object.entries(s.social ?? {}).filter(([, v]) => v)) },
};

export const nav = [
  {
    label: "About",
    href: "/about/",
    children: [
      { label: "About ULL Auremont", href: "/about/" },
      { label: "What makes us unique", href: "/about/why-auremont/" },
      { label: "Our teachers", href: "/about/teachers/" },
    ],
  },
  {
    label: "Academics",
    href: "/academics/",
    children: [
      { label: "Our approach", href: "/academics/" },
      { label: "Foundational (Nursery–Grade 2)", href: "/academics/foundational/" },
      { label: "Preparatory (Grades 3–5)", href: "/academics/preparatory/" },
      { label: "Middle (Grades 6–8)", href: "/academics/middle/" },
      { label: "Secondary (Grades 9–10)", href: "/academics/secondary/" },
      { label: "Assessment and progress", href: "/academics/assessment/" },
    ],
  },
  {
    label: "Student Life",
    href: "/student-life/",
    children: [
      { label: "Sports & Fitness", href: "/student-life/sports/" },
      { label: "Pulse: weekly skills", href: "/student-life/pulse/" },
      { label: "Ruchi: hobby hour", href: "/student-life/ruchi/" },
      { label: "Kushala: life skills", href: "/student-life/kushala/" },
      { label: "Aurora Lab & robotics", href: "/student-life/aurora-lab/" },
      { label: "Summit Pathway", href: "/student-life/summit-pathway/" },
    ],
  },
  { label: "Campus", href: "/campus/" },
  { label: "Parents", href: "/parents/" },
  {
    label: "Admissions",
    href: "/admissions/",
    children: [
      { label: "How to join", href: "/admissions/" },
      { label: "Book a campus visit", href: "/admissions/visit/" },
      { label: "Enquire", href: "/admissions/enquire/" },
      { label: "Questions parents ask", href: "/admissions/#faq" },
    ],
  },
  { label: "Contact", href: "/contact/" },
];

export const utilityLinks = [
  { label: "Book a Visit", href: "/admissions/visit/" },
  { label: "Enquire", href: "/admissions/enquire/" },
  { label: "Parent Login", href: "/portal/" },
];
