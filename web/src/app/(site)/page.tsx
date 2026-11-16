import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { BlockView } from "@/components/Blocks";
import { Img } from "@/components/Img";
import { img } from "@/content/assets";
import { brands, campusAddress, campuses, directionsUrl, group, type Brand } from "@/content/brands";
import { site } from "@/content/site";
import { pageUrl } from "@/lib/seo";

export const metadata = { alternates: { canonical: pageUrl("") } };

// ULL India: the umbrella home for the group's schools (plan 05). Each brand card leads to its
// own section (/auremont/, /global/); each campus to its page (/auremont/bengaluru/nagarbhavi/).

const accent = {
  orange: { bar: "bg-orange", text: "text-orange-700", btn: "btn-accent" },
  teal: { bar: "bg-teal", text: "text-teal-700", btn: "btn btn-primary" },
} as const;

function BrandPanel({ brand, image, points, links }: { brand: Brand; image: string; points: string[]; links: { label: string; href: string }[] }) {
  const a = accent[brand.accent === "teal" ? "teal" : "orange"];
  return (
    <article className="flex flex-col bg-white shadow-sm">
      <div className="relative aspect-[16/10]">
        <Img src={image} accent={brand.accent} sizes="(min-width: 1024px) 50vw, 100vw" />
        <span className={`absolute left-0 top-0 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white ${brand.status === "live" ? "bg-navy" : "bg-teal-700"}`}>
          {brand.status === "live" ? `Admissions open${site.admissionsYear ? ` ${site.admissionsYear}` : ""}` : "Launching soon"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <span className={`h-[3px] w-8 ${a.bar}`} aria-hidden />
          <span className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${a.text}`}>{brand.board}{brand.grades ? ` · ${brand.grades}` : ""}</span>
        </div>
        <h3 className="h2 mt-4">{brand.name}</h3>
        <p className="lead mt-4">{brand.tagline}</p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex gap-4 text-ink/85">
              <span className="mt-[0.8em] h-[2px] w-5 shrink-0 bg-gold" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} className={i === 0 ? a.btn : "btn-outline"}>{l.label}</Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function GroupHome() {
  const cities = [...new Set(campuses.map((c) => c.city))];
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="grid lg:min-h-[calc(100dvh-7.5rem)] lg:grid-cols-[1.05fr_1fr]">
          <div className="split-text flex items-center py-14 sm:py-20">
            <div>
              <p className="eyebrow"><span className="rule-gold" aria-hidden />{group.fullName} · {group.tagline}</p>
              <h1 className="display mt-6">
                One family of schools. <em className="font-normal italic text-orange">Inspiring generations.</em>
              </h1>
              <p className="lead mt-7 max-w-xl">{group.description}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="#schools" className="btn-accent">Explore our schools</Link>
                <Link href={campuses[0].href} className="btn-outline">Find a campus</Link>
              </div>
            </div>
          </div>
          <figure className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto">
            <Img src={img.courtyard} accent="gold" priority />
          </figure>
        </div>
      </section>

      {/* Schools */}
      <section id="schools" className="section-y scroll-mt-28 bg-white">
        <div className="container-x">
          <div className="mb-10 max-w-3xl lg:mb-14">
            <p className="eyebrow"><span className="rule-gold" aria-hidden />Our schools</p>
            <h2 className="h2 mt-4">Choose the school that fits your child</h2>
            <p className="lead mt-5">Each ULL school has its own curriculum and character. Explore a school, then find the campus nearest you.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <BrandPanel
              brand={brands.auremont}
              image={img.arrival}
              points={[
                `${brands.auremont.board} curriculum shaped by NCF 2023, ${brands.auremont.grades}`,
                "Strong academics, Indian roots, sport for every child and learning for life",
                `Campus in ${campuses[0].locality}, ${campuses[0].city}`,
              ]}
              links={[
                { label: "Explore ULL Auremont", href: brands.auremont.href },
                { label: `${campuses[0].locality} campus`, href: campuses[0].href },
              ]}
            />
            <BrandPanel
              brand={brands.global}
              image={img.senior}
              points={["Inquiry-led, globally minded learning", "Rooted in India, like every ULL school", "Campus, grades and opening date to be announced"]}
              links={[
                { label: "Register interest", href: "/global/#enquire" },
                { label: "About ULL Global", href: brands.global.href },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Campus finder, by city (like competitors' "schools in <city>" pages) */}
      <section className="section-y bg-cream">
        <div className="container-x">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow"><span className="rule-gold" aria-hidden />Find a campus</p>
            <h2 className="h2 mt-4">ULL schools near you</h2>
          </div>
          {cities.map((city) => (
            <div key={city} className="border-t-2 border-navy">
              <h3 className="h3 py-5">{city}</h3>
              <ul className="divide-y divide-line border-t border-line">
                {campuses.filter((c) => c.city === city).map((c) => (
                  <li key={c.href} className="grid gap-4 py-6 md:grid-cols-12 md:items-center">
                    <div className="md:col-span-5">
                      <Link href={c.href} className="font-serif text-xl font-semibold text-navy hover:text-orange-700">{c.name}</Link>
                      <p className="mt-1 text-[15px] text-muted">{brands[c.brand].board} · {c.grades}</p>
                    </div>
                    <p className="flex gap-3 text-[15px] text-ink/85 md:col-span-4">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden />
                      {campusAddress()}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-3 md:justify-end">
                      <Link href={c.href} className="link-arrow">View campus <ArrowRight className="h-4 w-4" aria-hidden /></Link>
                      <a href={directionsUrl()} target="_blank" rel="noopener" className="link-arrow">Directions</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-8 text-[15px] text-muted">
            {brands.global.name}: campus to be announced. <Link href="/global/#enquire" className="link-arrow">Register interest</Link>
          </p>
        </div>
      </section>

      <BlockView
        block={{
          type: "cards",
          eyebrow: "For parents",
          heading: "One ULL account for your family",
          columns: 3,
          items: [
            { title: "One parent portal", accent: "teal", text: "Register once, add your children and follow every application in one place.", href: "/portal/" },
            { title: "Visit before you decide", accent: "orange", text: "See classrooms, meet teachers and watch learning in action, any working day by appointment.", href: "/auremont/admissions/visit/" },
            { title: "Talk to us", accent: "gold", text: "Call, WhatsApp or write to our admissions team with any question.", href: "/contact/" },
          ],
        }}
      />

      <BlockView
        block={{
          type: "cta",
          image: img.arrival,
          heading: "Ready to see a ULL school for yourself?",
          text: `Book a visit to ${campuses[0].name}, or tell us what you are looking for.`,
          primary: { label: "Book a campus visit", href: "/auremont/admissions/visit/" },
          secondary: { label: "Contact us", href: "/contact/" },
        }}
      />
    </>
  );
}
