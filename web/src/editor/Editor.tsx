"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Puck, useGetPuck, type Data } from "@puckeditor/core";
import { adminUrl, canEditContent, cms, CmsError, mediaSrc, type Media, type PageDoc, type User } from "./cms";
import { config } from "./config";
import { docToPuck, puckToDoc } from "./convert";
import { MediaContext } from "./MediaField";

type Status = { tone: "info" | "ok" | "error"; text: string } | null;

export function Editor() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [error, setError] = useState("");
  const id = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    cms<{ user: User | null }>("users/me")
      .then((r) => setUser(r.user))
      .catch((e) => {
        setUser(null);
        setError(e instanceof CmsError ? "" : "Cannot reach the CMS. Is it running?");
      });
  }, []);

  if (user === undefined) return <Screen title="Opening the page builder…" />;
  if (!user)
    return (
      <Screen title="Sign in to edit the website" text={error || "Use your ULL staff account, then open the page builder again."}>
        <a className="ull-btn" href={adminUrl("/login")}>Sign in to the CMS</a>
      </Screen>
    );
  if (!canEditContent(user))
    return (
      <Screen title="Your role cannot edit the website" text="Ask the group admin to add the Content editor or School admin role to your account.">
        <a className="ull-btn" href={adminUrl()}>Back to the CMS</a>
      </Screen>
    );
  return id ? <PageEditor id={id} /> : <PageList />;
}

function Screen({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="ull-screen">
      <div>
        <p className="eyebrow"><span className="rule-gold" aria-hidden />ULL page builder</p>
        <h1 className="h2 mt-4">{title}</h1>
        {text && <p className="lead mt-4">{text}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </div>
  );
}

function PageList() {
  const [pages, setPages] = useState<PageDoc[] | null>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    cms<{ docs: PageDoc[] }>("pages?limit=300&depth=0&draft=true&sort=slug")
      .then((r) => setPages(r.docs))
      .catch((e) => setError(e.message));
  }, []);

  async function create(form: FormData) {
    const title = String(form.get("title") ?? "").trim();
    const slug = String(form.get("slug") ?? "").trim().replace(/^\/+|\/+$/g, "").toLowerCase();
    if (!title || !slug) return;
    setCreating(true);
    try {
      const { doc } = await cms<{ doc: PageDoc }>("pages?draft=true", {
        method: "POST",
        body: JSON.stringify({ title, slug, description: title, hero: { heading: title }, blocks: [], _status: "draft" }),
      });
      window.location.href = `?id=${doc.id}`;
    } catch (e) {
      setError((e as Error).message);
      setCreating(false);
    }
  }

  return (
    <div className="ull-list">
      <header className="ull-list__head">
        <div>
          <p className="eyebrow"><span className="rule-gold" aria-hidden />ULL page builder</p>
          <h1 className="h2 mt-3">Website pages</h1>
        </div>
        <a className="ull-btn ull-btn--ghost" href={adminUrl()}>Back to the CMS</a>
      </header>
      {error && <p className="ull-alert">{error}</p>}
      <form className="ull-new" action={create}>
        <input name="title" placeholder="New page title, e.g. Transport" required />
        <input name="slug" placeholder="Web address, e.g. parents/transport" required />
        <button className="ull-btn" disabled={creating}>{creating ? "Creating…" : "Create page"}</button>
      </form>
      {!pages && !error && <p className="text-muted">Loading pages…</p>}
      <ul className="ull-list__items">
        {pages?.map((p) => (
          <li key={p.id}>
            <a href={`?id=${p.id}`}>
              <span className="ull-list__title">{p.title}</span>
              <span className="ull-list__slug">/{p.slug}{p.slug ? "/" : ""}</span>
              <span className={`ull-pill ull-pill--${p._status ?? "draft"}`}>{p._status === "published" ? "Published" : "Draft"}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageEditor({ id }: { id: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [doc, setDoc] = useState<PageDoc | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const dirty = useRef(false);

  useEffect(() => {
    Promise.all([cms<PageDoc>(`pages/${id}?draft=true&depth=1`), cms<{ docs: Media[] }>("media?limit=500&depth=0&sort=-createdAt")])
      .then(([d, m]) => {
        setDoc(d);
        setData(docToPuck(d));
        setMedia(m.docs);
      })
      .catch((e) => setError(e.message));
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [id]);

  const mediaIds = useMemo(() => new Map(media.map((m) => [mediaSrc(m), m.id] as const)), [media]);
  const mediaState = useMemo(() => ({ items: media, add: (m: Media) => setMedia((xs) => [m, ...xs]) }), [media]);

  const save = useCallback(
    async (current: Data, publish: boolean) => {
      setStatus({ tone: "info", text: publish ? "Publishing…" : "Saving draft…" });
      const { body, missing } = puckToDoc(current, mediaIds);
      try {
        const saved = await cms<{ doc: PageDoc }>(`pages/${id}${publish ? "" : "?draft=true"}`, {
          method: "PATCH",
          body: JSON.stringify({ ...body, _status: publish ? "published" : "draft" }),
        });
        setDoc(saved.doc);
        dirty.current = false;
        const note = missing.length ? ` ${missing.length} photo(s) are not in the media library and were left out.` : "";
        setStatus({ tone: "ok", text: (publish ? "Published. The website updates in a few minutes." : "Draft saved. Visitors still see the published page.") + note });
      } catch (e) {
        setStatus({ tone: "error", text: `Not saved: ${(e as Error).message}` });
      }
    },
    [id, mediaIds],
  );

  const overrides = useMemo(
    () => ({
      headerActions: () => <Actions doc={doc} onSave={save} />,
      drawerItem: ({ children, name }: { children: React.ReactNode; name: string }) => (
        <div className="ull-drawer-item">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/blocks/${name}.png`} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
          {children}
        </div>
      ),
    }),
    [doc, save],
  );

  if (error) return <Screen title="This page could not be opened" text={error}><a className="ull-btn" href="?">All pages</a></Screen>;
  if (!data) return <Screen title="Loading the page…" />;

  return (
    <MediaContext.Provider value={mediaState}>
      <Puck
        config={config}
        data={data}
        headerTitle={doc?.title ?? "Page"}
        headerPath={`/${doc?.slug ? `${doc.slug}/` : ""}`}
        onChange={() => (dirty.current = true)}
        overrides={overrides}
        iframe={{ enabled: true }}
      />
      {status && (
        <div className={`ull-toast ull-toast--${status.tone}`} role="status">
          {status.text}
          <button type="button" onClick={() => setStatus(null)} aria-label="Dismiss">×</button>
        </div>
      )}
    </MediaContext.Provider>
  );
}

function Actions({ doc, onSave }: { doc: PageDoc | null; onSave: (d: Data, publish: boolean) => void }) {
  const getPuck = useGetPuck();
  const current = () => getPuck().appState.data;
  return (
    <div className="ull-actions">
      <a href="?" className="ull-btn ull-btn--ghost">All pages</a>
      {doc && <a href={adminUrl(`/collections/pages/${doc.id}`)} className="ull-btn ull-btn--ghost">Form view</a>}
      <button type="button" className="ull-btn ull-btn--ghost" onClick={() => onSave(current(), false)}>Save draft</button>
      <button type="button" className="ull-btn ull-btn--accent" onClick={() => onSave(current(), true)}>Publish</button>
    </div>
  );
}
