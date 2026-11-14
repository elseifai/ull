import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BlockView } from "@/components/Blocks";
import { EnquiryForm } from "@/components/EnquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { img } from "@/content/assets";
import { campusAddress, campuses, directionsUrl } from "@/content/brands";
import { faqs } from "@/content/pages-more";
import { site } from "@/content/site";
import type { Page } from "@/content/types";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, schoolJsonLd } from "@/lib/seo";

// One campus of a school brand, modelled on competitors' branch pages (Orchids
// /bangalore-branches/nagarbhavi, Ryan /ryaninternational/cbse/bangalore/<school>): local
// facts, an early enquiry form, facilities, grades, admissions, local FAQs and directions.
// A second campus copies this file with its own entry in campuses (content/brands.ts).

const campus = campuses.find((c) => c.href === "/auremont/bengaluru/nagarbhavi/")!;
const base = campus.href;

const page: Page = {
  slug: base.replace(/^\/|\/$/g, ""),
  title: `${campus.name}: ${site.board} school in ${campus.city}`,
  description: `${campus.name} is a ${site.board} school in ${campus.locality}, ${campus.city} for ${campus.grades}. See facilities, admissions and fees, and book a campus visit.`,
  breadcrumb: [{ label: campus.city, href: `/auremont/${campus.citySlug}/` }],
  hero: {
    image: img.arrival,
    eyebrow: `${site.board} school · ${campus.locality}, ${campus.city}`,
    heading: campus.name,
    lead: `A ${site.board} school for children from ${campus.grades}. ${site.tagline}`,
    accent: "orange",
    actions: [
      { label: "Book a campus visit", href: "/auremont/admissions/visit/" },
      { label: "Enquire now", href: `${base}#enquire` },
    ],
  },
  blocks: [],
};

export const metadata = pageMetadata(page);

const localFaqs = [
  { q: `Where is ${site.name} in ${campus.locality}?`, a: `${campusAddress()}. Use “Get directions” on this page to open the campus in Google Maps.` },
  { q: "Which grades do you offer at this campus?", a: `${campus.grades}, all on one campus, following the ${site.board} curriculum.` },
  ...(site.affiliation ? [{ q: `What is the ${site.board} affiliation number?`, a: site.affiliation }] : []),
  { q: "What are the school hours for visits?", a: `${site.hours}. Visits are by appointment so a teacher can show you around.` },
  { q: "How do I get the fee structure?", a: "We share the fee structure for each grade during your campus visit, or on request after an enquiry." },
  ...faqs.filter((f) => /visit|board exam|languages/i.test(f.q)),
];

const facts = [
  { value: site.board, label: "Curriculum shaped by NCF 2023" },
  { value: "Nursery–10", label: "Every stage on one campus" },
  { value: site.admissionsYear ? `${site.admissionsYear}` : "Open", label: "Admissions" },
  { value: "Mon–Sat", label: "Visits by appointment" },
];

export default function CampusPage() {
  const contact = [
    { icon: MapPin, label: "Address", value: campusAddress(), href: directionsUrl(), cta: "Get directions" },
    site.phone && { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.whatsapp && { icon: MessageCircle, label: "WhatsApp", value: "Chat with admissions", href: `https://wa.me/${site.whatsapp}` },
    site.email && { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: "Office hours", value: site.hours },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href?: string; cta?: string }[];

  return (
    <>
      <JsonLd data={schoolJsonLd()} />
      <JsonLd data={breadcrumbJsonLd(page)} />
      <JsonLd data={faqJsonLd(localFaqs)} />
      <PageHero page={page} />

      {/* At a glance */}
      <section className="bg-navy text-white">
        <dl className="container-x grid grid-cols-2 gap-y-10 py-12 lg:grid-cols-4 lg:py-14">
          {facts.map((f, i) => (
            <div key={f.label} className={`pr-4 ${i ? "lg:border-l lg:border-white/15 lg:pl-8" : ""}`}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-serif text-3xl font-semibold text-white sm:text-4xl">{f.value}</dd>
              <dd className="mt-2 text-[15px] text-white/70">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Visit us + enquiry, early on the page as on competitors' branch pages */}
      <section className="section-y bg-cream">
        <div id="enquire" className="container-x grid scroll-mt-28 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow"><span className="rule-gold" aria-hidden />Visit us</p>
            <h2 className="h2 mt-4">{campus.locality}, {campus.city}</h2>
            <ul className="mt-8 space-y-6 border-t border-navy/15 pt-6">
              {contact.map(({ icon: Icon, label, value, href, cta }) => (
                <li key={label} className="flex gap-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
                    {href && !cta ? (
                      <a href={href} className="mt-1 block text-ink hover:text-navy hover:underline" rel="noopener">{value}</a>
                    ) : (
                      <p className="mt-1 text-ink">{value}</p>
                    )}
                    {cta && href && (
                      <a href={href} target="_blank" rel="noopener" className="link-arrow mt-2">{cta} <ArrowRight className="h-4 w-4" aria-hidden /></a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm mode="enquiry" />
          </div>
        </div>
      </section>

      <BlockView
        block={{
          type: "cards",
          eyebrow: `Why families in ${campus.locality} choose us`,
          heading: "Four pillars, every day",
          columns: 4,
          items: [
            { title: "Strong academics", accent: "navy", image: img.primary, text: `Concepts understood, not memorised, and ${site.board}-ready from the first year to the Grade 10 board exam.`, href: "/auremont/academics/" },
            { title: "Indian roots", accent: "orange", image: img.passage, text: "Indian thinkers, Karnataka examples, Kannada and values in every subject.", href: "/auremont/academics/" },
            { title: "Fit body, sharp mind", accent: "teal", image: img.courtyard, text: "Sport and fitness for every child, with coaching and competition for those who shine.", href: "/auremont/student-life/sports/" },
            { title: "Learning for life", accent: "gold", image: img.music, text: "A skill every week, a hobby every week and a life skill every month.", href: "/auremont/student-life/" },
          ],
        }}
      />

      <BlockView
        block={{
          type: "gallery",
          tone: "cream",
          eyebrow: "Campus and facilities",
          heading: "A colourful world of learning",
          lead: "Classrooms, creative studios and room to play.",
          note: "Campus design visualisations. Facilities subject to final confirmation.",
          items: [
            { image: img.nursery, title: "Nursery & kindergarten", caption: "Reading corners and child-sized activity tables" },
            { image: img.primary, title: "Grades 3–5", caption: "Project work and group learning" },
            { image: img.courtyard, title: "Sports courtyard", caption: "Two badminton courts and a volleyball court" },
            { image: img.music, title: "Music studio" },
            { image: img.dance, title: "Dance & movement studio" },
            { image: img.dining, title: "Kitchen & dining" },
          ],
        }}
      />
      <div className="bg-cream pb-14 lg:pb-20">
        <div className="container-x">
          <Link href={`${base}facilities/`} className="link-arrow">All facilities and the full gallery <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>

      <BlockView
        block={{
          type: "subnav",
          eyebrow: "Grades at this campus",
          heading: campus.grades,
          items: [
            { title: "Foundational", tag: "Nursery–Grade 2", image: img.toddler, href: "/auremont/academics/foundational/", text: "Learning through play, stories and wonder.", accent: "gold" },
            { title: "Preparatory", tag: "Grades 3–5", image: img.primary, href: "/auremont/academics/preparatory/", text: "From play to purposeful learning.", accent: "orange" },
            { title: "Middle & Secondary", tag: "Grades 6–10", image: img.senior, href: "/auremont/academics/middle/", text: "Thinking like mathematicians, scientists and historians, then board-ready.", accent: "teal" },
          ],
        }}
      />

      <BlockView
        block={{
          type: "steps",
          tone: "cream",
          eyebrow: `Admissions${site.admissionsYear ? ` ${site.admissionsYear}` : ""}`,
          heading: "Five simple steps to join",
          items: [
            { title: "Enquire", text: "Enquire online or call our admissions team." },
            { title: "Visit", text: `Visit the ${campus.locality} campus and meet our academic team.` },
            { title: "Meet", text: "A relaxed, age-appropriate interaction with your child." },
            { title: "Confirm", text: "Confirm admission and complete documents." },
            { title: "Orientation", text: "Orientation for you and your child before the year begins." },
          ],
        }}
      />

      <BlockView block={{ type: "faq", eyebrow: `About the ${campus.locality} campus`, heading: "Questions parents ask", items: localFaqs }} />

      <BlockView
        block={{
          type: "cta",
          image: img.arrival,
          heading: `See ${site.name}, ${campus.locality} for yourself`,
          text: "Visit any working day by appointment. Meet our teachers and watch learning in action.",
          primary: { label: "Book a campus visit", href: "/auremont/admissions/visit/" },
          secondary: { label: "Get directions", href: directionsUrl() },
        }}
      />
    </>
  );
}
