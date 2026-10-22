"use client";
import { useEffect, useState } from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";
import { Blocks } from "@/components/Blocks";
import { PageHero } from "@/components/PageHero";
import { toWebPage } from "@/lib/cms-shape.mjs";
import type { Page } from "@/content/types";
import { cms, cmsOrigin, type PageDoc } from "./cms";

export function LivePreview() {
  const [initial, setInitial] = useState<PageDoc | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return setError("Open this preview from a page in the CMS.");
    cms<PageDoc>(`pages/${id}?draft=true&depth=1`)
      .then(setInitial)
      .catch(() => setError("Sign in to the CMS to see the preview."));
  }, []);

  if (error) return <p className="container-x section-y lead">{error}</p>;
  if (!initial) return <p className="container-x section-y lead">Loading preview…</p>;
  return <Live initial={initial} />;
}

function Live({ initial }: { initial: PageDoc }) {
  const { data } = useLivePreview<PageDoc>({ initialData: initial, serverURL: cmsOrigin || window.location.origin, depth: 1 });
  const page = toWebPage(data, cmsOrigin) as Page;
  return (
    <>
      <PageHero page={page} />
      <Blocks blocks={page.blocks} />
    </>
  );
}
