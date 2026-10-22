import type { Data } from "@puckeditor/core";
import { clean, toWebBlock } from "@/lib/cms-shape.mjs";
import type { Block, Page } from "@/content/types";
import { cmsOrigin, type PageDoc } from "./cms";

// The editor keeps each block's props in the CMS shape (blockType fields), with images as URLs.
// Loading strips Payload ids; saving turns image URLs back into media ids.

export type RootProps = {
  title: string;
  slug: string;
  description: string;
  hero: { eyebrow?: string; heading: string; lead?: string; accent?: string; image?: string; actions?: { label: string; href: string }[] };
  breadcrumb?: { label: string; href: string }[];
};

let n = 0;
const newId = (type: string) => `${type}-${Date.now().toString(36)}-${(n++).toString(36)}`;

export function docToPuck(doc: PageDoc): Data {
  const p = clean(doc, cmsOrigin) as PageDoc;
  const data = {
    root: {
      props: {
        title: p.title ?? "",
        slug: p.slug ?? "",
        description: p.description ?? "",
        hero: { heading: "", ...(p.hero ?? {}) },
        breadcrumb: p.breadcrumb ?? [],
      },
    },
    content: (p.blocks ?? []).map((b) => {
      const { blockType, ...props } = b as { blockType: string };
      return { type: blockType, props: { id: newId(blockType), ...props } };
    }),
  };
  return data as Data;
}

// Props Puck adds for its own use; never stored.
const internal = new Set(["id", "puck", "editMode", "children"]);

function withMediaIds(v: unknown, ids: Map<string, number | string>, missing: string[]): unknown {
  if (Array.isArray(v)) return v.map((x) => withMediaIds(x, ids, missing));
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      if (k === "image") {
        const id = typeof x === "string" && x ? ids.get(x) : undefined;
        if (typeof x === "string" && x && id === undefined) missing.push(x);
        o[k] = id ?? null;
      } else if (!internal.has(k)) o[k] = withMediaIds(x, ids, missing);
    }
    return o;
  }
  return v;
}

/** Puck data to the body of a PATCH /api/pages/:id. */
export function puckToDoc(data: Data, ids: Map<string, number | string>) {
  const missing: string[] = [];
  const root = (data.root.props ?? {}) as RootProps;
  const body = {
    title: root.title,
    slug: root.slug,
    description: root.description,
    hero: withMediaIds(root.hero ?? {}, ids, missing),
    breadcrumb: withMediaIds(root.breadcrumb ?? [], ids, missing),
    blocks: data.content.map((c) => ({ blockType: c.type, ...(withMediaIds(c.props, ids, missing) as object) })),
  };
  return { body, missing };
}

/** Block props as the site's components expect them. */
export function propsToBlock(type: string, props: Record<string, unknown>): Block {
  const own = Object.fromEntries(Object.entries(props).filter(([k]) => !internal.has(k)));
  return toWebBlock(clean({ blockType: type, ...own })) as Block;
}

export function rootToPage(root: Partial<RootProps>): Page {
  const hero = (clean(root.hero ?? {}) ?? {}) as Page["hero"];
  return {
    slug: root.slug ?? "",
    title: root.title ?? "",
    description: root.description ?? "",
    hero: { ...hero, heading: hero.heading ?? "", actions: hero.actions?.length ? hero.actions : undefined },
    breadcrumb: root.breadcrumb?.length ? root.breadcrumb : undefined,
    blocks: [],
  };
}
