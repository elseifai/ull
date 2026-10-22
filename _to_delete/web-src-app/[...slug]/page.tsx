import { notFound } from "next/navigation";
import { pages, getPage } from "@/content";
import { PageHero } from "@/components/PageHero";
import { Blocks } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.slug.split("/") }));
}

export async function generateMetadata({ params }: Props) {
  const page = getPage((await params).slug.join("/"));
  return page ? pageMetadata(page) : {};
}

export default async function ContentPage({ params }: Props) {
  const page = getPage((await params).slug.join("/"));
  if (!page) notFound();
  const faq = page.blocks.find((b) => b.type === "faq");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(page)} />
      {faq?.type === "faq" && <JsonLd data={faqJsonLd(faq.items)} />}
      <PageHero page={page} />
      <Blocks blocks={page.blocks} />
    </>
  );
}
