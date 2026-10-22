import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlockView } from "@/components/Blocks";
import { Img } from "@/components/Img";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/content/pages-more";
import { img } from "@/content/assets";
import { site } from "@/content/site";
import { faqJsonLd } from "@/lib/seo";

const paths = [
  { label: "Academics", href: "/academics/" },
  { label: "Student life", href: "/student-life/" },
  { label: "Admissions", href: "/admissions/" },
  { label: "Book a visit", href: "/admissions/visit/" },
];

const facts = [
  { value: "CBSE", label: "Curriculum shaped by NCF 2023" },
  { value: "Nursery–10", label: "Every stage on one campus" },
  { value: "11", label: "Sports for every child" },
  { value: "5", label: "Steps in every lesson" },
];

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs.slice(0, 5))} />

      {/* Hero */}
      <section className="bg-cream">
        <div className="grid lg:min-h-[calc(100dvh-7.5rem)] lg:grid-cols-[1.05fr_1fr]">
          <div className="split-text flex items-center py-14 sm:py-20">
            <div>
              <p className="eyebrow"><span className="rule-gold" aria-hidden />{site.board} school · {site.address.locality}, {site.address.city}</p>
              <h1 className="display mt-6">
                Every lesson connects. <em className="font-normal italic text-orange">Every child rises.</em>
              </h1>
              <p className="lead mt-7 max-w-xl">
                {site.name} is a {site.board} school for children from {site.grades}. {site.tagline}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/admissions/visit/" className="btn-accent">Book a campus visit</Link>
                <Link href="/admissions/enquire/" className="btn-outline">Enquire now</Link>
              </div>
            </div>
          </div>
          <figure className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto">
            <Img src={img.jonty} accent="gold" priority />
            <figcaption className="absolute bottom-0 left-0 bg-navy px-5 py-4 text-white sm:px-6">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{site.ambassador.role}</span>
              <span className="mt-1 block font-serif text-xl">{site.ambassador.name}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Quick paths */}
      <nav aria-label="Start here" className="bg-navy text-white">
        <ul className="container-x grid grid-cols-2 lg:grid-cols-4">
          {paths.map((p, i) => (
            <li key={p.href} className={`border-white/15 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <Link href={p.href} className="group flex min-h-16 items-center justify-between gap-3 px-1 py-5 font-serif text-lg sm:px-6 lg:text-xl">
                {p.label}
                <ArrowRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Promise */}
      <section className="section-y bg-white">
        <div className="container-x">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow justify-center"><span className="rule-gold" aria-hidden />Our promise<span className="rule-gold" aria-hidden /></p>
            <h2 className="h1 mt-6">{site.promise}</h2>
            <p className="lead mx-auto mt-7 max-w-3xl">
              At {site.name}, children learn deeply, play hard, stay rooted in India and grow ready for life. Every part of the week is planned with care, from the first lesson to the last whistle on the sports field.
            </p>
          </div>
        </div>
      </section>

      <BlockView
        block={{
          type: "cards",
          tone: "cream",
          eyebrow: "Four pillars",
          heading: "Everything we do stands on four pillars",
          lead: "Drawn from our founders’ brief, they shape every lesson, every week and every report.",
          columns: 4,
          items: [
            { title: "Strong academics", accent: "navy", image: img.primary, text: "Concepts understood, not memorised, and CBSE-ready from the first year to the Grade 10 board exam.", href: "/academics/" },
            { title: "Indian roots", accent: "orange", image: img.passage, text: "Indian thinkers, Karnataka examples, Kannada and values in every subject.", href: "/academics/" },
            { title: "Fit body, sharp mind", accent: "teal", image: img.courtyard, text: "Sport and fitness for every child, with coaching and competition for those who shine.", href: "/student-life/sports/" },
            { title: "Learning for life", accent: "gold", image: img.music, text: "A skill every week, a hobby every week and a life skill every month.", href: "/student-life/" },
          ],
        }}
      />

      <BlockView
        index={1}
        block={{
          type: "text",
          image: img.nursery,
          imageSide: "left",
          eyebrow: "Academics",
          heading: "The Auremont Learning Cycle",
          lead: "Every lesson, in every subject and grade, follows five steps. Children think, talk and do before they write, and every lesson ends with reflection.",
          bullets: [
            "Connect: a question, story or puzzle sparks curiosity.",
            "Experience: children explore hands-on, in groups.",
            "Clarify: children explain; the teacher builds the concept.",
            "Apply: they use it to solve something new.",
            "Reflect: what did I learn, and what is still unclear?",
          ],
          link: { label: "Our approach to learning", href: "/academics/" },
        }}
      />

      {/* Facts */}
      <section className="bg-navy text-white">
        <dl className="container-x grid grid-cols-2 gap-y-10 py-14 lg:grid-cols-4 lg:py-16">
          {facts.map((f, i) => (
            <div key={f.label} className={`pr-4 ${i ? "lg:border-l lg:border-white/15 lg:pl-8" : ""}`}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-serif text-4xl font-semibold text-white sm:text-5xl">{f.value}</dd>
              <dd className="mt-2 text-[15px] text-white/70">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <BlockView
        block={{
          type: "subnav",
          eyebrow: "Beyond the classroom",
          heading: "A week full of discovery",
          lead: "Skills and interests are part of the learning journey, planned every week for every child.",
          items: [
            { title: "Sports & Fitness", tag: "Every child plays", image: img.courtyard, accent: "orange", href: "/student-life/sports/", text: "Fitness measured and reported, house competitions and school teams." },
            { title: "Pulse", tag: "A skill every week", image: img.primary, accent: "teal", href: "/student-life/pulse/", text: "One named skill a week, linked to the chapter being studied." },
            { title: "Ruchi", tag: "A hobby every week", image: img.dance, accent: "gold", href: "/student-life/ruchi/", text: "From Kathak to kitchen gardening to robotics, Grades 1–8." },
            { title: "Kushala", tag: "A life skill every month", image: img.dining, accent: "navy", href: "/student-life/kushala/", text: "Practical independence, practised at school and at home." },
            { title: "Aurora Lab & robotics", tag: "Grades 1–8", image: img.senior, accent: "teal", href: "/student-life/aurora-lab/", text: "Predict, test, get it wrong, think again and understand." },
            { title: "Summit Pathway", tag: "Grades 6–10", image: img.vocal, accent: "orange", href: "/student-life/summit-pathway/", text: "Olympiads, debate, current affairs and career guidance." },
          ],
        }}
      />

      <BlockView
        block={{
          type: "quote",
          tone: "cream",
          text: "Every child at ULL Auremont discovers the gold within and rises to lead a life of purpose: strong in knowledge, fit in body and mind, rooted in India and ready to serve the world.",
          cite: "Our vision",
        }}
      />

      <BlockView
        block={{
          type: "subnav",
          eyebrow: "Admissions open",
          heading: "Nursery to Grade 10",
          items: [
            { title: "Foundational", tag: "Nursery–Grade 2", image: img.toddler, href: "/academics/foundational/", text: "Learning through play, stories and wonder.", accent: "gold" },
            { title: "Preparatory", tag: "Grades 3–5", image: img.primary, href: "/academics/preparatory/", text: "From play to purposeful learning.", accent: "orange" },
            { title: "Middle & Secondary", tag: "Grades 6–10", image: img.senior, href: "/academics/middle/", text: "Thinking like mathematicians, scientists and historians, then board-ready.", accent: "teal" },
          ],
        }}
      />

      <BlockView block={{ type: "faq", tone: "cream", eyebrow: "Questions parents ask", heading: "A little more clarity", items: faqs.slice(0, 5) }} />

      <BlockView
        block={{
          type: "cta",
          image: img.arrival,
          heading: "Ready to see it for yourself?",
          text: "Visit any working day by appointment. Meet our teachers and watch learning in action.",
          primary: { label: "Book a campus visit", href: "/admissions/visit/" },
          secondary: { label: "Enquire now", href: "/admissions/enquire/" },
        }}
      />
    </>
  );
}
