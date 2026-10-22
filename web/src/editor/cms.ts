// Talking to the Payload CMS from the browser, signed in with the staff cookie.
// In production the site and CMS share ullindia.com; locally the CMS runs on another port.
export const cmsOrigin = (process.env.NEXT_PUBLIC_CMS_URL ?? "").replace(/\/$/, "");

export type Media = { id: number | string; url: string; alt?: string; filename?: string; sizes?: { card?: { url?: string } } };
export type User = { id: number | string; name?: string; email: string; roles?: string[] };
export type PageDoc = {
  id: number | string;
  title: string;
  slug: string;
  description?: string;
  _status?: "draft" | "published";
  updatedAt?: string;
  hero?: Record<string, unknown>;
  breadcrumb?: { label: string; href: string }[];
  blocks?: Record<string, unknown>[];
};

export class CmsError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function cms<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${cmsOrigin}/api/${path}`, {
    credentials: "include",
    ...init,
    headers: init.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init.headers },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errors = json?.errors as { message?: string; data?: { errors?: { path?: string; message?: string }[] } }[] | undefined;
    const detail = errors?.flatMap((e) => e.data?.errors?.map((f) => `${f.path}: ${f.message}`) ?? [e.message]).filter(Boolean).join("; ");
    throw new CmsError(detail || `Request failed (${res.status})`, res.status);
  }
  return json as T;
}

export const canEditContent = (u?: User | null) => Boolean(u?.roles?.some((r) => ["admin", "schoolAdmin", "editor"].includes(r)));
export const adminUrl = (path = "") => `${cmsOrigin}/admin${path}`;
export const mediaSrc = (m: Media) => (/^https?:/.test(m.url) ? m.url : `${cmsOrigin}${m.url}`);
