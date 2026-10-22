"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { nav, utilityLinks, site } from "@/content/site";

export function Header({ logoSrc }: { logoSrc?: string }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur">
      {/* Utility bar (desktop) */}
      <div className="hidden bg-navy text-white lg:block">
        <div className="container-x flex h-10 items-center justify-between text-[13px]">
          <p className="text-white/80">
            {site.board} · {site.grades} · {site.address.locality}, {site.address.city}
          </p>
          <nav aria-label="Quick links" className="flex items-center gap-5">
            {utilityLinks.map((l) => (
              <Link key={l.href} href={l.href} className="font-semibold tracking-wide text-white/90 hover:text-gold">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[5.5rem]">
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Logo src={logoSrc} />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-1 px-3 py-2 text-[14px] font-semibold tracking-wide transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100 ${
                    isActive(item.href) ? "text-navy after:scale-x-100" : "text-navy/85 hover:text-navy"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="w-72 border-t-2 border-gold bg-white py-3 shadow-xl shadow-navy/10">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block px-5 py-2.5 text-[15px] text-navy hover:bg-cream hover:text-orange-700">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/admissions/visit/" className="btn-accent hidden min-h-11 px-5 sm:inline-flex">
            Book a visit
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-navy hover:bg-navy-50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

    </header>

      {/* Mobile menu: rendered outside the header, whose backdrop blur would trap a fixed child */}
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white lg:hidden">
          <nav aria-label="Main" className="container-x pb-28 pt-2">
            <ul className="divide-y divide-line">
              {nav.map((item) => (
                <li key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        className="flex min-h-14 w-full items-center justify-between text-left font-serif text-xl font-semibold text-navy"
                        aria-expanded={expanded === item.href}
                        onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                      >
                        {item.label}
                        <ChevronDown className={`h-5 w-5 transition-transform ${expanded === item.href ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                      {expanded === item.href && (
                        <ul className="pb-3">
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link href={c.href} className="flex min-h-11 items-center px-3 text-base text-muted hover:bg-cream">
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} className="flex min-h-14 items-center font-serif text-xl font-semibold text-navy">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <Link href="/admissions/visit/" className="btn-primary">Book a campus visit</Link>
              <Link href="/portal/" className="btn-outline">Parent login</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
