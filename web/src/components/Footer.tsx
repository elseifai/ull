"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./Logo";
import { site } from "@/content/site";
import { brandOf, brands, campusAddress, campuses, group, navFor } from "@/content/brands";

export function Footer() {
  const brand = brandOf(usePathname());
  const { nav, primary, secondary } = navFor(brand);
  const social = Object.entries(site.social).filter(([, url]) => url);
  const head = "text-[12px] font-semibold uppercase tracking-[0.2em] text-gold";

  return (
    <footer className="mt-auto bg-navy-900 pb-20 text-white lg:pb-0">
      <div className="container-x border-b border-white/10 py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <BrandLogo brand={brand} light />
            <p className="mt-8 max-w-md font-serif text-3xl leading-snug text-white">{brand?.motto ?? group.tagline}</p>
            <p className="mt-3 text-white/65">{brand ? brand.tagline : group.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={primary.href} className="btn-accent">{primary.label}</Link>
              <Link href={secondary.href} className="btn-ghost-light">{secondary.label}</Link>
            </div>
          </div>
          <div className="lg:col-span-2 lg:col-start-6">
            <h2 className={head}>Explore</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[15px] text-white/75 lg:grid-cols-1">
              {nav.map((n) => (
                <li key={n.href}><Link href={n.href} className="hover:text-white">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className={head}>Our schools</h2>
            <ul className="mt-5 space-y-3 text-[15px] text-white/75">
              <li><Link href="/" className="hover:text-white">{group.name}</Link></li>
              {Object.values(brands).map((b) => (
                <li key={b.slug}>
                  <Link href={b.href} className="hover:text-white">{b.name}</Link>
                  <span className="block text-[13px] text-white/50">{b.board}{b.status === "launching" ? " · launching soon" : ""}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h2 className={head}>Visit us</h2>
            <address className="mt-5 space-y-2 text-[15px] not-italic leading-relaxed text-white/75">
              <p className="font-semibold text-white"><Link href={campuses[0].href} className="hover:text-gold">{campuses[0].name}</Link></p>
              <p>{campusAddress()}</p>
              {site.phone && <p><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a></p>}
              {site.email && <p><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></p>}
              <p>{site.hours}</p>
            </address>
            {social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-white/75">
                {social.map(([name, url]) => (
                  <li key={name}><a href={url} className="capitalize hover:text-white" rel="noopener" target="_blank">{name}</a></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="container-x flex flex-col gap-3 py-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {group.name} · {group.fullName}
          {brand && ` · ${brand.name} is a ${group.name} school`}
          {brand?.slug === "auremont" && site.affiliation ? ` · ${site.affiliation}` : ""}
        </p>
        <ul className="flex gap-5">
          <li><Link href="/privacy/" className="hover:text-white">Privacy</Link></li>
          <li><Link href="/contact/" className="hover:text-white">Contact</Link></li>
          <li><Link href="/portal/" className="hover:text-white">Parent login</Link></li>
        </ul>
      </div>
    </footer>
  );
}
