import type { Accent } from "@/content/types";

// Placeholder artwork shown where a photo is not yet available: one shape from the ULL mark,
// large and soft on a light tint, so pages stay calm until real photography is added.
const art: Record<Accent, { bg: string; fg: string; shape: React.ReactNode }> = {
  gold: {
    bg: "#FEF6E6",
    fg: "#FCAC14",
    shape: (
      <>
        <rect x="250" y="70" width="300" height="300" />
        <circle cx="400" cy="220" r="78" fill="#FEF6E6" />
      </>
    ),
  },
  orange: {
    bg: "#FDF1EC",
    fg: "#EB5026",
    shape: (
      <>
        <rect x="280" y="40" width="58" height="370" />
        <rect x="368" y="40" width="58" height="370" />
        <rect x="456" y="40" width="58" height="370" />
      </>
    ),
  },
  teal: {
    bg: "#EAF7F8",
    fg: "#24B5C5",
    shape: (
      <>
        <path d="M560 40 V420 A380 380 0 0 1 180 40 Z" />
        <g fill="none" stroke="#EAF7F8" strokeWidth="22">
          <path d="M560 150 A110 110 0 0 1 450 40" />
          <path d="M560 270 A230 230 0 0 1 330 40" />
        </g>
      </>
    ),
  },
  navy: {
    bg: "#EFF3F8",
    fg: "#0D3161",
    shape: <path d="M200 40 H580 A380 380 0 0 1 200 420 Z" />,
  },
};

export function BrandArt({ accent = "navy", className = "" }: { accent?: Accent; className?: string }) {
  const a = art[accent];
  return (
    <svg
      viewBox="0 0 600 450"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
      style={{ background: a.bg }}
    >
      <g fill={a.fg} opacity="0.22">{a.shape}</g>
      <rect x="48" y="392" width="72" height="4" fill="#FCAC14" opacity="0.9" />
    </svg>
  );
}
