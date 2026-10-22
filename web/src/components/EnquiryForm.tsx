"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { site } from "@/content/site";

export const grades = ["Nursery", "LKG", "UKG", ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)];
const priorities = ["Strong academics", "Indian roots", "Sports and fitness", "Skills and hobbies", "All of these"];
const sources = ["Google search", "Instagram or Facebook", "Friend or family", "Hoarding or newspaper", "Walked past the school", "Other"];

type Status = "idle" | "sending" | "done" | "error";

const field = "mt-2 block min-h-12 w-full rounded-[3px] border border-navy/15 bg-white px-4 text-base text-navy placeholder:text-muted/60 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal/30";
const label = "block text-sm font-medium text-navy";

export function EnquiryForm({ mode = "enquiry" }: { mode?: "enquiry" | "visit" }) {
  const [status, setStatus] = useState<Status>("idle");
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return; // honeypot: bots fill hidden fields
    delete data.website;
    setStatus("sending");
    try {
      const res = await fetch(`${site.apiUrl}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: mode, consent: data.consent === "on", pageUrl: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="border-t-4 border-teal bg-white p-8 sm:p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-700" aria-hidden />
        <h3 className="h3 mt-4">Thank you, we’ve got it</h3>
        <p className="mt-2 text-muted">
          {mode === "visit"
            ? "We’ll confirm your visit on WhatsApp and email shortly."
            : "Our admissions team will call you back soon."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border-t-4 border-navy bg-white p-6 shadow-sm sm:p-10" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="parentName" className={label}>Parent or guardian name</label>
          <input id="parentName" name="parentName" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>Mobile number</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" pattern="[0-9+ ]{10,15}" placeholder="10-digit mobile" className={field} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="childName" className={label}>Child’s name</label>
          <input id="childName" name="childName" required className={field} />
        </div>
        <div>
          <label htmlFor="grade" className={label}>Grade sought</label>
          <select id="grade" name="grade" required defaultValue="" className={field}>
            <option value="" disabled>Select a grade</option>
            {grades.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="currentSchool" className={label}>Current school <span className="font-normal text-muted">(optional)</span></label>
          <input id="currentSchool" name="currentSchool" className={field} />
        </div>
        <div>
          <label htmlFor="preferredDate" className={label}>
            Preferred visit date {mode === "enquiry" && <span className="font-normal text-muted">(optional)</span>}
          </label>
          <input id="preferredDate" name="preferredDate" type="date" min={today} required={mode === "visit"} className={field} />
        </div>
        <div>
          <label htmlFor="priority" className={label}>What matters most to you?</label>
          <select id="priority" name="priority" defaultValue="" className={field}>
            <option value="">Choose one (optional)</option>
            {priorities.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="source" className={label}>How did you hear about us?</label>
          <select id="source" name="source" defaultValue="" className={field}>
            <option value="">Choose one (optional)</option>
            {sources.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>Anything you’d like us to know? <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="message" name="message" rows={3} className={`${field} py-3`} />
        </div>
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <label className="flex gap-3 text-sm text-muted sm:col-span-2">
          <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-navy" />
          <span>I agree to be contacted by ULL Auremont by phone, WhatsApp, SMS and email about admissions. See our <a href="/privacy/" className="underline">privacy policy</a>.</span>
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 bg-orange-50 p-4 text-sm text-orange-700">
          Sorry, we couldn’t send that just now. Please try again
          {site.phone ? <> or call us on <a className="underline" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></> : null}.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-accent mt-6 w-full sm:w-auto">
        {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {mode === "visit" ? "Request my visit" : "Send enquiry"}
      </button>
    </form>
  );
}
