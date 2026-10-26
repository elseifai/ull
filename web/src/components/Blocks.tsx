import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import type { Accent, Block, Card, Tone } from "@/content/types";
import { img } from "@/content/assets";
import { EnquiryForm } from "./EnquiryForm";
import { Img } from "./Img";
import { site } from "@/content/site";

const toneBg: Record<Tone, string> = {
  white: "bg-white",
  cream: "bg-cream",
  navy: "bg-navy text-white",
  teal: "bg-teal-50/60",
  gold: "bg-gold-50/70",
  orange: "bg-orange-50/60",
};

const accentBg: Record<Accent, string> = { navy: "bg-navy", orange: "bg-orange", teal: "bg-teal", gold: "bg-gold" };

function Section({ tone = "white", children, className = "" }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <section className={`section-y ${toneBg[tone]} ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`eyebrow ${light ? "text-gold" : ""}`}>
      <span className="rule-gold" aria-hidden />
      {children}
    </p>
  );
}

// Eyebrow + heading on the left, lead on the right (stacks on phones).
function SectionHead({ eyebrow, heading, lead, light }: { eyebrow?: string; heading?: string; lead?: string; light?: boolean }) {
  if (!eyebrow && !heading && !lead) return null;
  return (
    <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-12 lg:items-end lg:gap-10">
      <div className="lg:col-span-7">
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        {heading && <h2 className={`h2 mt-4 ${light ? "text-white" : ""}`}>{heading}</h2>}
      </div>
      {lead && <p className={`lead lg:col-span-5 ${light ? "text-white/75" : ""}`}>{lead}</p>}
    </div>
  );
}

function Bullets({ items, light }: { items: string[]; light?: boolean }) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((b) => (
        <li key={b} className={`flex gap-4 ${light ? "text-white/85" : "text-ink/85"}`}>
          <span className="mt-[0.8em] h-[2px] w-5 shrink-0 bg-gold" aria-hidden />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function Feature({ card, index, light }: { card: Card; index: number; light?: boolean }) {
  const body = (
    <>
      {card.image && (
        <div className="relative mb-6 aspect-[3/2] overflow-hidden">
          <Img src={card.image} accent={card.accent} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-500 group-hover:scale-[1.03]" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <span className={`h-[3px] w-8 ${accentBg[card.accent ?? (["gold", "orange", "teal", "navy"] as Accent[])[index % 4]]}`} aria-hidden />
        {card.tag && <span className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${light ? "text-white/60" : "text-muted"}`}>{card.tag}</span>}
      </div>
      <h3 className={`h3 mt-4 ${light ? "text-white" : ""}`}>{card.title}</h3>
      {card.text && <p className={`mt-3 ${light ? "text-white/75" : "text-muted"}`}>{card.text}</p>}
      {card.bullets && <Bullets items={card.bullets} light={light} />}
      {card.href && (
        <span className={`mt-5 inline-flex items-center gap-2 text-[15px] font-semibold ${light ? "text-gold" : "text-navy"}`}>
          Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      )}
    </>
  );
  return card.href ? (
    <Link href={card.href} className="group block">{body}</Link>
  ) : (
    <div>{body}</div>
  );
}

const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export function BlockView({ block, index = 0 }: { block: Block; index?: number }) {
  switch (block.type) {
    case "text": {
      const light = block.tone === "navy";
      if (block.image) {
        const imageLeft = (block.imageSide ?? (index % 2 ? "left" : "right")) === "left";
        return (
          <Section tone={block.tone}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <div className={`relative aspect-[4/3] overflow-hidden lg:aspect-[5/6] ${imageLeft ? "" : "lg:order-2"}`}>
                <Img src={block.image} accent="gold" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <div>
                {block.eyebrow && <Eyebrow light={light}>{block.eyebrow}</Eyebrow>}
                {block.heading && <h2 className={`h2 mt-4 ${light ? "text-white" : ""}`}>{block.heading}</h2>}
                {block.lead && <p className="lead mt-6">{block.lead}</p>}
                {block.body?.map((p) => <p key={p} className={`mt-5 ${light ? "text-white/80" : "text-ink/85"}`}>{p}</p>)}
                {block.bullets && <Bullets items={block.bullets} light={light} />}
                {block.link && <Link href={block.link.href} className="link-arrow mt-8">{block.link.label} <ArrowRight className="h-4 w-4" /></Link>}
              </div>
            </div>
          </Section>
        );
      }
      return (
        <Section tone={block.tone}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                {block.eyebrow && <Eyebrow light={light}>{block.eyebrow}</Eyebrow>}
                {block.heading && <h2 className={`h2 mt-4 ${light ? "text-white" : ""}`}>{block.heading}</h2>}
              </div>
            </div>
            <div className="lg:col-span-7">
              {block.lead && <p className="lead">{block.lead}</p>}
              {block.body?.map((p, i) => (
                <p key={p} className={`${i === 0 && !block.lead ? "text-lg leading-relaxed sm:text-xl" : "mt-5"} ${light ? "text-white/80" : "text-ink/85"}`}>{p}</p>
              ))}
              {block.bullets && <Bullets items={block.bullets} light={light} />}
              {block.link && <Link href={block.link.href} className="link-arrow mt-8">{block.link.label} <ArrowRight className="h-4 w-4" /></Link>}
            </div>
          </div>
        </Section>
      );
    }
    case "cards": {
      const light = block.tone === "navy";
      return (
        <Section tone={block.tone}>
          <SectionHead eyebrow={block.eyebrow} heading={block.heading} lead={block.lead} light={light} />
          <div className={`grid gap-x-10 gap-y-12 ${cols[block.columns ?? 3]}`}>
            {block.items.map((c, i) => <Feature key={c.title} card={c} index={i} light={light} />)}
          </div>
        </Section>
      );
    }
    case "subnav":
      return (
        <Section tone={block.tone}>
          <SectionHead eyebrow={block.eyebrow} heading={block.heading} lead={block.lead} />
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((c) => (
              <Link key={c.title} href={c.href ?? "#"} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Img src={c.image} accent={c.accent} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-500 group-hover:scale-[1.04]" />
                  {c.tag && (
                    <span className="absolute left-0 top-0 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy">{c.tag}</span>
                  )}
                </div>
                <h3 className="h3 mt-5 flex items-start justify-between gap-4 group-hover:text-orange-700">
                  {c.title}
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </h3>
                {c.text && <p className="mt-2 text-muted">{c.text}</p>}
              </Link>
            ))}
          </div>
        </Section>
      );
    case "table":
      return (
        <Section tone={block.tone}>
          <SectionHead eyebrow={block.eyebrow} heading={block.heading} lead={block.lead} />
          <dl className="border-t-2 border-navy">
            {block.rows.map(([k, v]) => (
              <div key={k} className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-10">
                <dt className="font-serif text-xl font-semibold text-navy md:col-span-4">{k}</dt>
                <dd className="text-ink/80 md:col-span-8">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="sr-only">{block.columns.join(" and ")}</p>
        </Section>
      );
    case "steps":
      return (
        <Section tone={block.tone}>
          <SectionHead eyebrow={block.eyebrow} heading={block.heading} lead={block.lead} />
          <ol className={`grid gap-10 sm:grid-cols-2 ${block.items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"} lg:gap-8`}>
            {block.items.map((s, i) => (
              <li key={s.title} className="relative border-t border-navy/20 pt-6">
                <span className="absolute -top-px left-0 h-[3px] w-12 bg-gold" aria-hidden />
                <span className="font-serif text-5xl font-semibold leading-none text-orange">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 font-serif text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-[16px] text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </Section>
      );
    case "faq":
      return (
        <Section tone={block.tone}>
          <div id="faq" className="grid scroll-mt-28 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
              {block.heading && <h2 className="h2 mt-4">{block.heading}</h2>}
              <p className="mt-5 text-muted">Can’t find your answer? <Link href="/contact/" className="link-arrow">Ask us</Link></p>
            </div>
            <div className="border-t-2 border-navy lg:col-span-8">
              {block.items.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-lg font-semibold text-navy sm:text-xl [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus className="h-5 w-5 shrink-0 text-orange transition-transform group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="pb-6 pr-10 text-ink/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      );
    case "quote":
      return (
        <Section tone={block.tone ?? "cream"}>
          <figure className="mx-auto max-w-4xl text-center">
            <span className="font-serif text-7xl leading-none text-gold" aria-hidden>“</span>
            <blockquote className="font-serif text-2xl italic leading-snug text-navy sm:text-3xl lg:text-4xl">{block.text}</blockquote>
            {block.cite && <figcaption className="mt-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted">{block.cite}</figcaption>}
          </figure>
        </Section>
      );
    case "cta":
      return (
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[16/10] lg:order-2 lg:aspect-auto lg:min-h-[28rem]">
              <Img src={block.image ?? img.arrival} accent="navy" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="split-text flex items-center py-14 lg:py-20">
              <div>
                <Eyebrow light>{site.name}</Eyebrow>
                <h2 className="h2 mt-4 text-white">{block.heading}</h2>
                {block.text && <p className="mt-5 text-lg text-white/75">{block.text}</p>}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {block.primary && <Link href={block.primary.href} className="btn-accent">{block.primary.label}</Link>}
                  {block.secondary && <Link href={block.secondary.href} className="btn-ghost-light">{block.secondary.label}</Link>}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    case "gallery":
      return (
        <Section tone={block.tone}>
          <SectionHead eyebrow={block.eyebrow} heading={block.heading} lead={block.lead} />
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((g, i) => (
              <figure key={g.image} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
                <div className={`relative overflow-hidden ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-[calc(100%-4.5rem)]" : "aspect-[4/3]"}`}>
                  <Img src={g.image} accent={(["gold", "teal", "orange", "navy"] as Accent[])[i % 4]} sizes={i === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} />
                </div>
                <figcaption className="mt-4">
                  <span className="font-serif text-lg font-semibold text-navy">{g.title}</span>
                  {g.caption && <span className="mt-1 block text-[15px] text-muted">{g.caption}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
          {block.note && <p className="mt-10 text-[13px] text-muted">{block.note}</p>}
        </Section>
      );
    case "enquiry":
      return (
        <Section tone="cream">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>{block.mode === "visit" ? "Book a visit" : "Admissions"}</Eyebrow>
              <h2 className="h2 mt-4">{block.heading ?? (block.mode === "visit" ? "Choose a day to visit" : "Tell us about your child")}</h2>
              {block.lead && <p className="mt-5 text-muted">{block.lead}</p>}
              <ol className="mt-8 space-y-5 border-t border-navy/15 pt-6">
                {["We call or WhatsApp you to confirm", "You visit, meet our teachers and see classrooms", "A relaxed interaction with your child"].map((t, i) => (
                  <li key={t} className="flex gap-4">
                    <span className="font-serif text-2xl font-semibold leading-none text-orange">{i + 1}</span>
                    <span className="text-ink/85">{t}</span>
                  </li>
                ))}
              </ol>
              {site.phone && (
                <p className="mt-8 text-muted">
                  Prefer to talk? Call <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4">{site.phone}</a>
                </p>
              )}
            </div>
            <div className="lg:col-span-8">
              <EnquiryForm mode={block.mode ?? "enquiry"} />
            </div>
          </div>
        </Section>
      );
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => <BlockView key={i} block={b} index={i} />)}</>;
}
