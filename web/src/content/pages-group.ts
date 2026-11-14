import { img } from "./assets";
import { brands, campuses } from "./brands";
import { site } from "./site";
import type { Page } from "./types";

// Brand-level pages that are not part of the original Auremont site: the city listing
// (like Orchids' /bangalore-branches) and the ULL Global launching page (plans 05 and 16).

const bengaluru = campuses.filter((c) => c.brand === "auremont" && c.citySlug === "bengaluru");

export const groupPages: Page[] = [
  {
    slug: "auremont/bengaluru",
    title: "ULL Auremont schools in Bengaluru",
    description:
      "ULL Auremont CBSE schools in Bengaluru for Nursery to Grade 10. Find your nearest campus, see facilities and book a visit at Nagarbhavi.",
    hero: {
      image: img.arrival,
      eyebrow: "ULL Auremont · Bengaluru",
      heading: "ULL Auremont schools in Bengaluru",
      lead: `${site.board} schools for ${site.grades}. Choose a campus to see its facilities, admissions and how to visit.`,
      accent: "orange",
    },
    blocks: [
      {
        type: "subnav",
        eyebrow: "Our campuses",
        heading: `${bengaluru.length} campus${bengaluru.length === 1 ? "" : "es"} in Bengaluru`,
        items: bengaluru.map((c) => ({
          title: c.name,
          tag: `${c.locality} · ${c.grades}`,
          image: img.arrival,
          accent: "orange" as const,
          href: c.href,
          text: `${site.board} school in ${c.locality}, ${c.city}. Admissions, facilities, fees and visits.`,
        })),
      },
      {
        type: "cta",
        heading: "Not sure which campus suits you?",
        text: "Tell us where you live and your child’s grade, and our admissions team will help.",
        primary: { label: "Enquire now", href: "/auremont/admissions/enquire/" },
        secondary: { label: "Book a campus visit", href: "/auremont/admissions/visit/" },
      },
    ],
  },
  {
    slug: "global",
    title: "ULL Global: an international school, launching soon",
    description:
      "ULL Global is a new international school by ULL India, inspired by inquiry-led learning. Register your interest to hear first about the campus, curriculum and admissions.",
    hero: {
      image: img.senior,
      eyebrow: "ULL Global · Launching soon",
      heading: "An international school by ULL India",
      lead: "ULL Global is our next school: inquiry-led, globally minded and rooted in the same promise as every ULL school. Register your interest and you will hear first.",
      accent: "teal",
      actions: [
        { label: "Register interest", href: "/global/#enquire" },
        { label: "Visit ULL Auremont meanwhile", href: brands.auremont.href },
      ],
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "What we are planning",
        heading: "Learning that travels with your child",
        columns: 3,
        items: [
          { title: "Inquiry first", accent: "teal", text: "Children ask questions, investigate and explain, across subjects and languages." },
          { title: "Globally minded", accent: "navy", text: "World languages, global issues and the confidence to learn anywhere." },
          { title: "Rooted in India", accent: "gold", text: "Indian languages, culture and community, as in every ULL school." },
        ],
      },
      {
        // TODO: replace with IB-approved wording once candidacy starts (plan 16). Never say "IB World School" before authorisation.
        type: "text",
        tone: "cream",
        eyebrow: "Curriculum",
        heading: "The International Baccalaureate",
        body: [
          "ULL Global intends to seek authorisation to offer International Baccalaureate (IB) programmes. We will share each step here.",
          "Only schools authorised by the IB Organization can offer its programmes. Candidate status, once granted, is no guarantee that authorisation will follow.",
        ],
      },
      {
        type: "faq",
        eyebrow: "Questions parents ask",
        heading: "What we can tell you today",
        items: [
          // TODO: city, year and grades once ULL confirms them (plan 05 open questions).
          { q: "Where and when will ULL Global open?", a: "We will announce the campus and opening year here first. Families who register interest will hear before anyone else." },
          { q: "Which grades will ULL Global offer?", a: "Grades and the first intake will be announced with the campus. Tell us your child’s grade when you register so we can plan for you." },
          { q: "What are the fees?", a: "Fees will be published when admissions open." },
          { q: "Can my child join a ULL school now?", a: `Yes. ${brands.auremont.name} is a ${brands.auremont.board} school for ${brands.auremont.grades} in ${site.address.locality}, ${site.address.city}, with admissions open.` },
        ],
      },
      {
        type: "enquiry",
        mode: "interest",
        heading: "Register your interest",
        lead: "Join the waitlist and we will write to you first about the campus, curriculum, fees and admissions.",
      },
    ],
  },
];
