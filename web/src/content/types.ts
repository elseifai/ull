// Page content is a list of blocks. The same shapes are used by the Payload CMS
// "Pages" collection, so content can move from these files into the CMS unchanged.
// Images are paths under /public (e.g. "/assets/nursery-space.png") or CMS media URLs.

export type Accent = "navy" | "orange" | "teal" | "gold";
export type Tone = "white" | "cream" | "navy" | "teal" | "gold" | "orange";
export type Link = { label: string; href: string };
export type Card = { title: string; text?: string; href?: string; tag?: string; accent?: Accent; bullets?: string[]; image?: string };
export type GalleryItem = { image: string; title: string; caption?: string };

type Head = { eyebrow?: string; heading?: string; lead?: string; tone?: Tone };

export type Block =
  | ({ type: "text"; body?: string[]; bullets?: string[]; image?: string; imageSide?: "left" | "right"; link?: Link } & Head)
  | ({ type: "cards"; columns?: 2 | 3 | 4; items: Card[] } & Head)
  | ({ type: "table"; columns: [string, string]; rows: [string, string][] } & Head)
  | ({ type: "steps"; items: { title: string; text: string }[] } & Head)
  | ({ type: "faq"; items: { q: string; a: string }[] } & Head)
  | { type: "quote"; text: string; cite?: string; image?: string; tone?: Tone }
  | { type: "cta"; heading: string; text?: string; primary?: Link; secondary?: Link; image?: string }
  | ({ type: "subnav"; items: Card[] } & Head)
  | ({ type: "gallery"; items: GalleryItem[]; note?: string } & Head)
  | { type: "enquiry"; heading?: string; lead?: string; mode?: "enquiry" | "visit" };

export type Page = {
  slug: string; // "" for home, "academics/foundational" etc.
  title: string; // <title>
  description: string; // meta description, 150–160 chars
  hero: { eyebrow?: string; heading: string; lead?: string; accent?: Accent; actions?: Link[]; image?: string };
  blocks: Block[];
  breadcrumb?: { label: string; href: string }[];
};
