"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { parentExpectationQuestions } from "@/content/parent-expectations";
import { site } from "@/content/site";
import { brandOf, brands } from "@/content/brands";
import { grades } from "@/components/EnquiryForm";
import { campaignForEnquiry } from "@/lib/utm";

type Status = "idle" | "sending" | "done" | "error";

const field =
  "mt-2 block min-h-12 w-full rounded-[3px] border border-navy/15 bg-white px-4 text-base text-navy placeholder:text-muted/60 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal/30";
const label = "block text-sm font-medium text-navy";

const validPhone = (value: string) => /^\+?\d{10,15}$/.test(value.replace(/[^\d+]/g, ""));

function trackSubmit() {
  const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag === "function") {
    w.gtag("event", "parent_expectations_submit", { form_name: "parent_expectations" });
    return;
  }
  w.dataLayer.push({ event: "parent_expectations_submit", form_name: "parent_expectations" });
}

export function ParentExpectationsForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [missing, setMissing] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const school = (brandOf(usePathname()) ?? brands.auremont).name;
  const id = (name: string) => `${uid}-${name}`;

  useEffect(() => {
    if (status !== "done") return;
    const panel = doneRef.current;
    if (!panel) return;
    // The form is much taller than the thank-you, and scroll anchoring keeps the footer
    // on screen unless we move the window ourselves after layout.
    const show = () => {
      const top = panel.getBoundingClientRect().top + window.scrollY - 112;
      window.scrollTo(0, Math.max(0, top));
      const heading = panel.querySelector("h3");
      if (heading instanceof HTMLElement) heading.focus({ preventScroll: true });
    };
    show();
    requestAnimationFrame(show);
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (data.website) return; // honeypot: bots fill hidden fields

    const answers: Record<string, string[]> = {};
    const unanswered = parentExpectationQuestions
      .filter((question) => {
        const values = formData.getAll(question.name).map(String).filter(Boolean);
        answers[question.name] = values;
        return values.length === 0;
      })
      .map((question) => question.name);
    const phone = String(data.phone ?? "");
    const phoneOk = validPhone(phone);
    setMissing(unanswered);
    setPhoneError(!phoneOk);
    if (!phoneOk || unanswered.length) {
      const target = !phoneOk ? id("phone") : id(unanswered[0]);
      const node = document.getElementById(target);
      node?.focus();
      node?.scrollIntoView({ block: "center" });
      return;
    }

    setStatus("sending");
    const email = String(data.email ?? "").trim();
    const childName = String(data.childName ?? "").trim();
    const grade = String(data.grade ?? "");
    try {
      const res = await fetch(`${site.apiUrl}/parent-expectations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: data.parentName,
          phone,
          ...(email ? { email } : {}),
          ...(childName ? { childName } : {}),
          ...(grade ? { grade } : {}),
          ...answers,
          ...campaignForEnquiry(),
          consent: data.consent === "on",
          pageUrl: `${window.location.pathname}${window.location.search}`,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackSubmit();
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div ref={doneRef} role="status" className="scroll-mt-28 border-t-4 border-teal bg-white p-8 text-center [overflow-anchor:none] sm:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-700" aria-hidden />
        <h3 tabIndex={-1} className="h3 mt-4 outline-none">
          Thank you, we’ve got it
        </h3>
        <p className="mt-2 text-muted">Our admissions team will read your answers and be in touch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-label="Parent Expectation Form" className="border-t-4 border-navy bg-white p-6 shadow-sm sm:p-10">
      <fieldset>
        <legend className="sr-only">Contact details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={id("parentName")} className={label}>
              Parent or guardian name
            </label>
            <input id={id("parentName")} name="parentName" required autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor={id("phone")} className={label}>
              Mobile number
            </label>
            <input
              id={id("phone")}
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
              pattern="[0-9+ ]{10,15}"
              placeholder="10-digit mobile"
              aria-invalid={phoneError || undefined}
              aria-describedby={phoneError ? id("phone-error") : undefined}
              onChange={() => setPhoneError(false)}
              className={field}
            />
            {phoneError && (
              <p id={id("phone-error")} role="alert" className="mt-2 text-sm text-orange-700">
                Enter a valid mobile number.
              </p>
            )}
          </div>
          <div>
            <label htmlFor={id("email")} className={label}>
              Email <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" className={field} />
          </div>
          <div>
            <label htmlFor={id("childName")} className={label}>
              Child’s name <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id={id("childName")} name="childName" autoComplete="off" className={field} />
          </div>
          <div>
            <label htmlFor={id("grade")} className={label}>
              Grade applying for <span className="font-normal text-muted">(optional)</span>
            </label>
            <select id={id("grade")} name="grade" defaultValue="" className={field}>
              <option value="">Select a grade (optional)</option>
              {grades.map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <div className="mt-8 space-y-8 border-t border-navy/15 pt-8">
        {parentExpectationQuestions.map((question, index) => {
          const invalid = missing.includes(question.name);
          return (
            <fieldset
              key={question.name}
              id={id(question.name)}
              tabIndex={-1}
              aria-required="true"
              aria-invalid={invalid || undefined}
              aria-describedby={`${id(question.name)}-hint${invalid ? ` ${id(question.name)}-error` : ""}`}
              className="scroll-mt-28 outline-none"
            >
              <legend className="text-base font-semibold text-navy">
                <span className="font-serif text-2xl leading-none text-orange" aria-hidden>
                  {index + 1}
                </span>
                <span className="mt-2 block">{question.label}</span>
              </legend>
              <p id={`${id(question.name)}-hint`} className="mt-1 text-sm text-muted">
                Choose at least one. You can select more than one.
              </p>
              <div className="mt-3 grid gap-2">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className="flex min-h-12 cursor-pointer items-center gap-3 border border-navy/15 bg-white px-4 py-3 text-base leading-snug text-navy has-[:checked]:border-teal-700 has-[:checked]:bg-teal-50"
                  >
                    <input
                      type="checkbox"
                      name={question.name}
                      value={option}
                      className="h-6 w-6 shrink-0 accent-navy"
                      onChange={() => setMissing((current) => current.filter((name) => name !== question.name))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {invalid && (
                <p id={`${id(question.name)}-error`} role="alert" className="mt-2 text-sm text-orange-700">
                  Please choose at least one option.
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="mt-8 flex min-h-12 items-start gap-3 text-base text-navy">
        <input type="checkbox" name="consent" required className="mt-1 h-6 w-6 shrink-0 accent-navy" />
        <span>
          I agree to be contacted by {school} by phone, WhatsApp, SMS and email about admissions. See our{" "}
          <a href="/privacy/" className="underline">
            privacy policy
          </a>
          .
        </span>
      </label>

      {status === "error" && (
        <p role="alert" className="mt-5 bg-orange-50 p-4 text-sm text-orange-700">
          Sorry, we couldn’t send that just now. Please try again
          {site.phone ? (
            <>
              {" "}
              or call us on <a className="underline" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
            </>
          ) : null}
          .
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-accent mt-6 w-full sm:w-auto">
        {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Send my expectations
      </button>
    </form>
  );
}
