// The ULL mark, redrawn from the logo. When the school logo file is in /public/assets it is used instead.
export function Mark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="0" y="0" width="46" height="46" fill="#FCAC14" />
      <circle cx="23" cy="23" r="12" fill="#fff" />
      <rect x="54" y="0" width="11" height="46" fill="#EB5026" />
      <rect x="71.5" y="0" width="11" height="46" fill="#EB5026" />
      <rect x="89" y="0" width="11" height="46" fill="#EB5026" />
      <path d="M46 54 V100 A46 46 0 0 1 0 54 Z" fill="#24B5C5" />
      <g fill="none" stroke="#fff" strokeWidth="4">
        <path d="M46 70 A16 16 0 0 1 30 54" />
        <path d="M46 84 A30 30 0 0 1 16 54" />
      </g>
      <path d="M54 54 H100 A46 46 0 0 1 54 100 Z" fill="#0D3161" />
    </svg>
  );
}

export function Logo({ light = false, src }: { light?: boolean; src?: string }) {
  if (src && !light) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="ULL Auremont School" width={1536} height={1024} className="h-12 w-auto sm:h-16" />;
  }
  return (
    <span className="flex items-center gap-3">
      <Mark className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
      <span className="leading-none">
        <span className={`block font-sans text-[19px] font-bold tracking-tight sm:text-[22px] ${light ? "text-white" : "text-navy"}`}>
          ULL <span className={light ? "text-gold" : "text-orange"}>AUREMONT</span>
        </span>
        <span className={`mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/65" : "text-muted"}`}>
          United Learning League
        </span>
      </span>
    </span>
  );
}
