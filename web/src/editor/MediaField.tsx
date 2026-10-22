"use client";
import { createContext, useContext, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { cms, mediaSrc, type Media } from "./cms";

type MediaState = { items: Media[]; add: (m: Media) => void };
export const MediaContext = createContext<MediaState>({ items: [], add: () => {} });

// Image picker for the editor's side panel: choose from the CMS media library or upload a new photo.
export function MediaField({ value, onChange, label }: { value?: string; onChange: (v: string | undefined) => void; label: string }) {
  const { items, add } = useContext(MediaContext);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);

  async function upload(f: File) {
    const alt = window.prompt("Describe this photo for Google and screen readers", f.name.replace(/\.\w+$/, "").replace(/[-_]/g, " "));
    if (!alt) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", f);
      form.append("_payload", JSON.stringify({ alt }));
      const { doc } = await cms<{ doc: Media }>("media", { method: "POST", body: form });
      add(doc);
      onChange(mediaSrc(doc));
      setOpen(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ull-media">
      <div className="ull-media__label">{label}</div>
      <div className="ull-media__current">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" />
        ) : (
          <span>No photo: brand artwork is shown</span>
        )}
      </div>
      <div className="ull-media__actions">
        <button type="button" onClick={() => setOpen((o) => !o)}><ImagePlus size={14} /> {open ? "Close library" : "Choose photo"}</button>
        <button type="button" onClick={() => file.current?.click()} disabled={busy}><Upload size={14} /> {busy ? "Uploading…" : "Upload"}</button>
        {value && <button type="button" onClick={() => onChange(undefined)} aria-label="Remove photo"><X size={14} /></button>}
      </div>
      <input ref={file} type="file" accept="image/*" hidden onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) upload(f);
        }} />
      {error && <p className="ull-media__error">{error}</p>}
      {open && (
        <div className="ull-media__grid">
          {items.length === 0 && <p>No photos yet. Upload one.</p>}
          {items.map((m) => {
            const src = mediaSrc(m);
            return (
              <button key={m.id} type="button" title={m.alt} className={src === value ? "is-selected" : ""} onClick={() => { onChange(src); setOpen(false); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.sizes?.card?.url ? mediaSrc({ ...m, url: m.sizes.card.url }) : src} alt={m.alt ?? ""} loading="lazy" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
