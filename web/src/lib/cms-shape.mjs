// Converts Payload CMS documents into the site's content shapes (src/content/types.ts).
// Shared by the build-time pull (scripts/pull-cms.mjs), the visual editor and live preview.

/** Payload adds ids and nulls, and uploads arrive as media documents; keep only what the site uses. */
export function clean(v, base = "") {
  if (Array.isArray(v)) return v.map((x) => clean(x, base));
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, x] of Object.entries(v)) {
      if (x === null || x === undefined || k === "id" || k === "blockName") continue;
      if (k === "image" && typeof x === "object") {
        if (x.url) o[k] = mediaUrl(x.url, base);
        continue;
      }
      o[k] = clean(x, base);
    }
    return o;
  }
  return v;
}

export const mediaUrl = (url, base = "") => (/^https?:/.test(url) ? url : `${base}${url}`);

const texts = (xs) => (xs?.length ? xs.map((x) => x.text).filter(Boolean) : undefined);
const link = (l) => (l?.label && l?.href ? l : undefined);

/** One Payload block ({ blockType, ... }, already cleaned) to a site block ({ type, ... }). */
export function toWebBlock(b) {
  const { blockType: type, ...rest } = b;
  switch (type) {
    case "text":
      return { type, ...rest, body: texts(rest.body), bullets: texts(rest.bullets), link: link(rest.link) };
    case "cards":
    case "subnav":
      return {
        type,
        ...rest,
        ...(rest.columns ? { columns: Number(rest.columns) } : {}),
        items: (rest.items ?? []).map((c) => ({ ...c, bullets: texts(c.bullets) })),
      };
    case "table":
      return { type, ...rest, columns: [rest.col1 ?? "", rest.col2 ?? ""], rows: (rest.rows ?? []).map((r) => [r.label ?? "", r.value ?? ""]) };
    case "cta":
      return { type, ...rest, primary: link(rest.primary), secondary: link(rest.secondary) };
    default:
      return { type, ...rest, items: rest.items ?? (["steps", "faq", "gallery"].includes(type) ? [] : undefined) };
  }
}

/** A Payload page document to a site page. */
export function toWebPage(doc, base = "") {
  const p = clean(doc, base);
  return {
    slug: p.slug ?? "",
    title: p.title ?? "",
    description: p.description ?? "",
    hero: { heading: "", ...p.hero, actions: p.hero?.actions?.length ? p.hero.actions : undefined },
    breadcrumb: p.breadcrumb?.length ? p.breadcrumb : undefined,
    blocks: (p.blocks ?? []).map(toWebBlock),
  };
}
