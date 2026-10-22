"use client";
import type { ComponentConfig, Config, Field } from "@puckeditor/core";
import { BlockView } from "@/components/Blocks";
import { PageHero } from "@/components/PageHero";
import { MediaField } from "./MediaField";
import { propsToBlock, rootToPage, type RootProps } from "./convert";

// Every website block as a drag-and-drop component. Props use the CMS field names, so what is
// saved here is the same content the CMS forms edit, and the site renders it with its own components.

type Props = Record<string, unknown>;
const words = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const text = (label: string): Field => ({ type: "text", label });
const area = (label: string): Field => ({ type: "textarea", label });
const select = (label: string, options: string[]): Field => ({ type: "select", label, options: options.map((value) => ({ label: words(value), value })) });
const tone = select("Background", ["white", "cream", "navy", "teal", "gold", "orange"]);
const accent = select("Colour accent", ["navy", "orange", "teal", "gold"]);
const image = (label = "Photo"): Field => ({
  type: "custom",
  label,
  render: ({ value, onChange, field }: { value?: string; onChange: (v?: string) => void; field: { label?: string } }) => <MediaField value={value} onChange={onChange} label={field.label ?? label} />,
});
const link = (label: string): Field => ({ type: "object", label, objectFields: { label: text("Button text"), href: text("Link, e.g. /admissions/") } });
const strings = (label: string, item: string): Field => ({
  type: "array",
  label,
  arrayFields: { text: area(item) },
  defaultItemProps: { text: "" },
  getItemSummary: (i: { text?: string }, n = 0) => i.text?.slice(0, 48) || `${item} ${n + 1}`,
});
const head = { eyebrow: text("Small label above the heading"), heading: text("Heading"), lead: area("Introduction") };
const card = (withColumns = false): Record<string, Field> => ({
  ...head,
  ...(withColumns ? { columns: select("Cards per row", ["2", "3", "4"]) } : {}),
  items: {
    type: "array",
    label: "Cards",
    getItemSummary: (c: { title?: string }, n = 0) => c.title || `Card ${n + 1}`,
    defaultItemProps: { title: "New card", text: "A short description." },
    arrayFields: {
      title: text("Title"),
      tag: text("Tag"),
      text: area("Text"),
      href: text("Link, e.g. /academics/"),
      accent,
      image: image(),
      bullets: strings("Bullet points", "Point"),
    },
  },
  tone,
});

function block(type: string, label: string, fields: Record<string, Field>, defaultProps: Props): ComponentConfig<Props> {
  return {
    label,
    fields,
    defaultProps,
    render: (props) => <BlockView block={propsToBlock(type, props)} />,
  };
}

export const components: Record<string, ComponentConfig<Props>> = {
  text: block(
    "text",
    "Text with photo",
    {
      ...head,
      body: strings("Paragraphs", "Paragraph"),
      bullets: strings("Bullet points", "Point"),
      image: image(),
      imageSide: select("Photo side", ["right", "left"]),
      link: link("Link below the text"),
      tone,
    },
    {
      eyebrow: "Our approach",
      heading: "A clear heading for this section",
      lead: "One or two sentences that tell parents what this section is about.",
      body: [{ text: "Write the detail here. Keep paragraphs short and specific." }],
      imageSide: "right",
      tone: "white",
    },
  ),
  cards: block("cards", "Cards", card(true), {
    eyebrow: "Highlights",
    heading: "Three things to know",
    columns: "3",
    tone: "cream",
    items: [
      { title: "Strong academics", text: "Concepts understood, not memorised.", accent: "navy" },
      { title: "Indian roots", text: "Indian thinkers and Karnataka examples in every subject.", accent: "orange" },
      { title: "Fit body, sharp mind", text: "Sport and fitness for every child.", accent: "teal" },
    ],
  }),
  subnav: block("subnav", "Link cards with photos", card(), {
    eyebrow: "Explore",
    heading: "Where to next",
    tone: "white",
    items: [
      { title: "Academics", tag: "Nursery–Grade 10", text: "How children learn at every stage.", href: "/academics/", accent: "navy" },
      { title: "Student life", tag: "Every week", text: "Sport, skills, hobbies and life skills.", href: "/student-life/", accent: "orange" },
      { title: "Admissions", tag: "Open now", text: "Steps, dates and a campus visit.", href: "/admissions/", accent: "teal" },
    ],
  }),
  steps: block(
    "steps",
    "Numbered steps",
    { ...head, items: { type: "array", label: "Steps", getItemSummary: (s: { title?: string }, n = 0) => s.title || `Step ${n + 1}`, defaultItemProps: { title: "Step", text: "" }, arrayFields: { title: text("Title"), text: area("Text") } }, tone },
    {
      eyebrow: "How it works",
      heading: "Admission in four steps",
      tone: "white",
      items: [
        { title: "Enquire", text: "Tell us about your child." },
        { title: "Visit", text: "See the campus and meet our teachers." },
        { title: "Interact", text: "A relaxed conversation with your child." },
        { title: "Confirm", text: "Complete the documents and fees." },
      ],
    },
  ),
  table: block(
    "table",
    "Two-column table",
    {
      ...head,
      col1: text("Column 1 title"),
      col2: text("Column 2 title"),
      rows: { type: "array", label: "Rows", getItemSummary: (r: { label?: string }, n = 0) => r.label || `Row ${n + 1}`, defaultItemProps: { label: "", value: "" }, arrayFields: { label: text("Left"), value: area("Right") } },
      tone,
    },
    { heading: "At a glance", col1: "Item", col2: "Detail", tone: "white", rows: [{ label: "Curriculum", value: "CBSE" }, { label: "Grades", value: "Nursery to Grade 10" }] },
  ),
  faq: block(
    "faq",
    "Questions and answers",
    { eyebrow: head.eyebrow, heading: head.heading, items: { type: "array", label: "Questions", getItemSummary: (q: { q?: string }, n = 0) => q.q || `Question ${n + 1}`, defaultItemProps: { q: "New question?", a: "" }, arrayFields: { q: text("Question"), a: area("Answer") } }, tone },
    { eyebrow: "Questions parents ask", heading: "A little more clarity", tone: "cream", items: [{ q: "Which board do you follow?", a: "CBSE, shaped by NCF 2023." }] },
  ),
  quote: block("quote", "Quote", { text: area("Quote"), cite: text("Who said it"), tone }, { text: "Every child discovers the gold within and rises to lead a life of purpose.", cite: "Our vision", tone: "cream" }),
  gallery: block(
    "gallery",
    "Photo gallery",
    {
      ...head,
      items: { type: "array", label: "Photos", getItemSummary: (g: { title?: string }, n = 0) => g.title || `Photo ${n + 1}`, defaultItemProps: { title: "New photo" }, arrayFields: { image: image(), title: text("Title"), caption: text("Caption") } },
      note: text("Note below the gallery"),
      tone,
    },
    { eyebrow: "Campus", heading: "Spaces designed for children", tone: "white", items: [{ title: "Nursery" }, { title: "Courtyard" }, { title: "Music room" }] },
  ),
  cta: block(
    "cta",
    "Call to action",
    { heading: text("Heading"), text: area("Text"), primary: link("Main button"), secondary: link("Second button"), image: image("Background photo") },
    {
      heading: "Ready to see it for yourself?",
      text: "Visit any working day by appointment.",
      primary: { label: "Book a campus visit", href: "/admissions/visit/" },
      secondary: { label: "Enquire now", href: "/admissions/enquire/" },
    },
  ),
  enquiry: block(
    "enquiry",
    "Enquiry or visit form",
    { heading: text("Heading"), lead: area("Introduction"), mode: { type: "radio", label: "Form", options: [{ label: "Enquiry", value: "enquiry" }, { label: "Visit booking", value: "visit" }] } },
    { heading: "Tell us about your child", lead: "Our admissions team will call you within one working day.", mode: "enquiry" },
  ),
};

export const config: Config = {
  categories: {
    text: { title: "Text", components: ["text", "steps", "table", "faq", "quote"] },
    cards: { title: "Cards and photos", components: ["cards", "subnav", "gallery"] },
    actions: { title: "Actions", components: ["cta", "enquiry"] },
  },
  components,
  root: {
    fields: {
      title: text("Page title (browser tab and Google)"),
      slug: text("Web address, e.g. academics/foundational"),
      description: area("Google description (150–160 characters)"),
      hero: {
        type: "object",
        label: "Top banner",
        objectFields: {
          eyebrow: text("Small label"),
          heading: text("Heading"),
          lead: area("Introduction"),
          accent,
          image: image(),
          actions: { type: "array", label: "Buttons (up to 2)", max: 2, getItemSummary: (a: { label?: string }) => a.label || "Button", arrayFields: { label: text("Button text"), href: text("Link") } },
        },
      },
      breadcrumb: { type: "array", label: "Breadcrumb", getItemSummary: (b: { label?: string }) => b.label || "Link", arrayFields: { label: text("Label"), href: text("Link") } },
    },
    render: ({ children, ...props }: { children?: React.ReactNode } & Props) => (
      <>
        <PageHero page={rootToPage(props as Partial<RootProps>)} />
        {children}
      </>
    ),
  },
};
