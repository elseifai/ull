import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone, PenLine } from "lucide-react";
import { site } from "@/content/site";

// Sticky action bar on phones: the four things parents do most.
export function MobileBar() {
  const items = [
    site.phone && { label: "Call", href: `tel:${site.phone.replace(/\s/g, "")}`, icon: Phone, external: true },
    site.whatsapp && { label: "WhatsApp", href: `https://wa.me/${site.whatsapp}`, icon: MessageCircle, external: true },
    { label: "Visit", href: "/admissions/visit/", icon: CalendarCheck },
    { label: "Enquire", href: "/admissions/enquire/", icon: PenLine },
  ].filter(Boolean) as { label: string; href: string; icon: typeof Phone; external?: boolean }[];

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map(({ label, href, icon: Icon, external }) => {
          const cls = "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium text-navy active:bg-navy-50";
          return (
            <li key={label}>
              {external ? (
                <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                  <Icon className="h-5 w-5 text-orange" aria-hidden />
                  {label}
                </a>
              ) : (
                <Link href={href} className={cls}>
                  <Icon className="h-5 w-5 text-orange" aria-hidden />
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
