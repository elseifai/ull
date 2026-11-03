// The campaign on the link the visitor opened. Kept for this browser tab so a form
// on a later page still receives it. This is the visit they chose to start, not a cookie.

const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STORAGE = "ull_utm";

export type Campaign = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const field: Record<(typeof PARAMS)[number], keyof Campaign> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
};

export function readUtm(search: string): Campaign {
  const query = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const campaign: Campaign = {};
  for (const key of PARAMS) {
    const value = query.get(key)?.trim().slice(0, 120);
    if (value) campaign[field[key]] = value;
  }
  return campaign;
}

export function rememberUtm(search: string) {
  const found = readUtm(search);
  if (Object.keys(found).length === 0) return found;
  try {
    sessionStorage.setItem(STORAGE, JSON.stringify(found));
  } catch {
    // Private mode can refuse storage. The form still sends the current link.
  }
  return found;
}

export function campaignForEnquiry(): Campaign {
  const fromLink = typeof window === "undefined" ? {} : rememberUtm(window.location.search);
  if (Object.keys(fromLink).length) return fromLink;
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE) || "{}") as Campaign;
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}
