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

