import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Page } from "@/content/types";
import { Img } from "./Img";

export function PageHero({ page }: { page: Page }) {
  const { hero, breadcrumb } = page;
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="grid lg:min-h-[34rem] lg:grid-cols-2">
        <div className="split-text flex items-center py-12 sm:py-16 lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
                <li><Link href="/" className="hover:text-navy">Home</Link></li>
                {breadcrumb?.map((b) => (
                  <li key={b.href} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    <Link href={b.href} className="hover:text-navy">{b.label}</Link>
                  </li>
                ))}
              </ol>
            </nav>
            {hero.eyebrow && (
              <p className="eyebrow"><span className="rule-gold" aria-hidden />{hero.eyebrow}</p>
            )}
            <h1 className="h1 mt-5">{hero.heading}</h1>
            {hero.lead && <p className="lead mt-6">{hero.lead}</p>}
            {hero.actions && (
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {hero.actions.map((a, i) => (
                  <Link key={a.href} href={a.href} className={i === 0 ? "btn-accent" : "btn-outline"}>{a.label}</Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative aspect-[16/11] lg:aspect-auto">
          <Img src={hero.image} accent={hero.accent} priority />
        </div>
      </div>
    </section>
  );
}
