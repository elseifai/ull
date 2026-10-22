# ULL India: School Group Website + Admissions Portal (plan v2)

Status: brainstorm draft, revised after Manish's answers on 2026-10-20 (v2.1). No code yet; the folder started empty.

Reference: https://ull-auremont-school.neonnova2048.chatgpt.site. Its full copy is in `content/site-content.md` and the concept page in `content/reference-concept.html`.

## 0. Decisions so far

- **Client:** a group of schools on **ullindia.com**, launching with **one school** (ULL Auremont School, per the reference link). Built multi-school ready so more can be added from the CMS.
- **Look and structure:** modelled on an American university website and applicant portal (clean, editorial, "Apply / Visit / Request Info" always one click away).
- **Stack:** Next.js + Payload CMS + PostgreSQL (approved).
- **Deployment:** Option A, S3 + CloudFront via AWS CLI, for the public site (approved). See section 4 for how the logged-in parts fit in.
- **CRM = VMS:** one module. Every enquiry, visit and applicant is one person record. Working name: **Admissions & Visitor Desk**.
- **Parent/student portal:** in scope. A family registers once and can submit many applications (several children, schools, grades or years). The portal is minimal: status, documents, messages.
- **Notifications:** email via Amazon SES, SMS via **Gupshup**, WhatsApp via **WATI**, behind one adapter so providers can be swapped.
- **Payments:** no application fee for now; no payment gateway in scope.
- **AWS account:** coming soon.

## 1. Modules

| Module | Who uses it | What it does |
|---|---|---|
| **Group website + CMS** | Public, content editors | Group home page plus a section per school. US-university style navigation (section 2). Editors manage pages, news, events, faculty and FAQs per school. |
| **SEO layer** | Google | Static HTML, per-page meta and Open Graph, JSON-LD (`EducationalOrganization`/`School` per campus, `Event`, `FAQPage`, `BreadcrumbList`), one sitemap per school, clean URLs like `/schools/<school>/admissions`, fast Core Web Vitals. |
| **Admissions & Visitor Desk** (CRM + VMS) | Admissions team, front desk, security | Enquiry → Contacted → Visit booked → Visited → Applied → Under review → Offered → Enrolled / Lost. Visit booking, QR pass, tablet check-in/out, host alerts, live "on campus now", follow-up reminders, counsellor assignment, lead source, filters per school. |
| **Parent/Student Portal** | Families | Register once (email or phone OTP). Add children. Start and save applications to any grade (and any school once more are added), upload documents, track status, book a campus visit, read messages. |
| **Staff login + roles** | Staff | Group admin, School admin, Content editor, Admissions counsellor, Front desk, Security. Staff only see the schools they're assigned to. |

The single **person record** ties it together: a family that enquires, visits and applies shows up as one timeline.

## 2. Website structure (US-university pattern, ULL Auremont content)

ULL Auremont: CBSE, Nursery to Grade 10, Nagarbhavi, Bengaluru. Motto "Rooted deep. Rising high." Brand colours and look: see section 2a (taken from the ULL logo).

Top bar: **Apply · Book a Visit · Enquire · Parent Login**

| Menu | Pages (from site-content.md) |
|---|---|
| **Home** | Hero (Jonty Rhodes ambassador), four pillars, Learning Cycle, sports, Beyond the Classroom, vision/mission, gallery strip, FAQ teaser, visit CTA |
| **About** | Our story, the name Auremont, motto, vision and mission, the Auremont Way (values), what makes us unique, our teachers |
| **Academics** | Our approach and the Learning Cycle; Foundational (Nursery to Grade 2); Preparatory (3 to 5); Middle (6 to 8); Secondary (9 and 10); assessment and progress |
| **Sports & Fitness** | Sports promise, programme by age, sports offered, calendar, week |
| **Beyond the Classroom** | Pulse, Ruchi, Kushala, Aurora Lab and robotics, Summit Pathway (one page each, good for SEO) |
| **Campus** | Facilities, gallery with filters, virtual tour, transport |
| **Parents** | Partnering with parents, a week at ULL Auremont, portal login |
| **Admissions** | 5-step process, enquiry/visit form, FAQs (with FAQPage schema), contact and map |

Each stage, programme and FAQ is its own CMS entry, so editors update them without touching layout and Google sees separate, well-titled pages.

**Content gaps to fill before launch:** our story, campus facility list, phone, email, address and PIN, years served, and real photos (the concept uses AI visualisations and the 17 image files weren't in the upload).

**Enquiry/visit form fields:** parent name, phone, email, child's name, grade sought, current school, preferred visit date, family priority.

**Admissions pipeline (matches their 5 steps):** Enquired → Visit booked → Visited → Child interaction → Documents pending → Admission confirmed → Orientation done → Enrolled, plus Lost / Not now.

## 2a. Look and feel: subtle and light, in the ULL logo colours

Logo file: `content/brand/ull-logo-lockup.jpg` (United Learning League, "Inspiring Generations", ULL Global · ULL Auremont). Colours sampled from it:

| Token | Hex | Use |
|---|---|---|
| Navy (primary) | `#0D3161` | Headings, body text, nav, footer, primary buttons. 12.9:1 on white |
| Orange | `#EB5026` | Accent: CTAs, highlights, ULL Auremont sub-brand. Text use only at large sizes (3.7:1); `#C2410C` for small orange text |
| Teal | `#24B5C5` | Accent: icons, dividers, ULL Global sub-brand. Decorative only (2.5:1); `#0E7C88` if teal text is needed |
| Gold | `#FCAC14` | Thin rules, badges, highlights. Never for text |
| Background | `#FFFFFF` + warm off-white `#FBF8F3` | Light, airy sections |
| Tints | navy 4%, orange 6%, teal 8%, gold 10% | Soft section backgrounds and cards |

"Subtle and light" means mostly white space, navy type, one accent per section, thin gold rules like the logo's underline, soft tinted panels instead of heavy blocks, real photography, and gentle motion only. Fonts: a rounded geometric sans close to the logo (e.g. Lexend or Quicksand) for headings and Inter for body. We'll swap these for the logo's actual font if your designer can share it. All text meets WCAG AA contrast.

## 2b. Google and SEO checklist (built in from day one)

- **Rendering:** every public page is pre-built static HTML on S3 + CloudFront, so Google reads full content without running JavaScript. Fast TTFB from the Mumbai edge.
- **Core Web Vitals:** LCP under 2.5s, CLS under 0.1, INP under 200ms. Images in AVIF/WebP, sized and lazy-loaded; fonts self-hosted; minimal JavaScript on public pages.
- **Mobile-first:** responsive layouts, tap targets of at least 44px, no intrusive pop-ups.
- **On-page:** unique title and meta description per page (editable in CMS), one H1, logical H2/H3, descriptive URLs (`/academics/foundational`), alt text required on every CMS image, internal links between related pages.
- **Structured data (JSON-LD):** `School`/`EducationalOrganization` with address, geo, phone and logo; `BreadcrumbList`; `FAQPage`; `Event`; `NewsArticle`; `Person` for the principal.
- **Indexing:** auto `sitemap.xml` (rebuilt on publish), `robots.txt`, canonical tags, 301 redirects managed in CMS, custom 404, noindex on portal/admin/thank-you pages.
- **Social:** Open Graph and Twitter cards with a share image per page.
- **Local SEO:** Google Business Profile for each school, matching name/address/phone everywhere, map embed, local keywords ("CBSE school in Nagarbhavi").
- **Measurement:** Google Search Console + GA4 with form-submission and visit-booking conversions; consent banner for cookies.
- **Content:** News and Parent Resources sections give Google fresh pages to rank; each programme (Pulse, Ruchi, Kushala, Aurora Lab, Summit Pathway) has its own page.
- **Accessibility:** WCAG 2.1 AA, which also helps SEO.

## 3. Stack

- **Next.js (App Router, TypeScript)**: the public site is exported to static HTML for S3; the portal and staff desk are React pages that call the API.
- **Payload CMS 3**: admin panel, auth, roles, access control. Collections: Schools, Pages, News, Events, Faculty, FAQs, People (families/students/visitors), Applications, Visits, Follow-ups, Messages.
- **PostgreSQL** on RDS (or in Docker on the API server to start).
- **S3** for media and uploaded documents (private bucket with signed URLs for applicant documents).
- **Tailwind CSS + shadcn/ui** for the UI.
- **Notifications:** SES for email, Gupshup for SMS, WATI for WhatsApp, behind one adapter.

## 4. Deployment: Option A, and the part it can't do alone

S3 + CloudFront serves static files only. Login, the portal, the CRM/VMS and the CMS admin all need a running API. The plan keeps Option A for everything public and adds **one small API server** behind the same CloudFront:

```
                 ullindia.com (CloudFront)
                 /                     \
   /*  →  S3 bucket (static site)    /api/*, /admin/*  →  API server (Payload)
                                                          └─ PostgreSQL, S3 media
```

- **Public site:** `next build` (static export) then `aws s3 sync` and a CloudFront invalidation. When an editor publishes, Payload fires a webhook that runs this build-and-sync, so content goes live in a few minutes without a developer.
- **Portal + staff desk:** static pages on S3 too; they call `/api` for data.
- **API server:** a small EC2 with SSH running Docker (Payload + Postgres), or App Runner / ECS if you'd rather not manage a server. Nightly DB backups to S3.
- **One domain, one SSL certificate** (ACM), so cookies and login work cleanly.

## 5. Phased delivery

Each phase ends with something live.

1. **Foundation + Group website**: AWS setup (S3, CloudFront, ACM, Route 53 or DNS, API server, SES), design system in the US-university style, group and school pages in the CMS, SEO layer, sitemaps, Search Console. *Launch the website.*
2. **Admissions & Visitor Desk**: enquiry and visit-booking forms, pipeline board, follow-ups, assignment, QR passes, front-desk check-in tablet, host alerts, SES + WhatsApp/SMS messages.
3. **Parent/Student Portal**: register once, multiple children and applications, document upload, status tracking, messages.
4. **Reports + polish**: conversions by source and school, visits to admissions, exports, audit log, performance and accessibility pass.

## 6. Still open

1. The content gaps listed in section 2 (story, facilities, contact details, real photos, and the logo as a vector/PNG file).
2. Should the site live at ullindia.com directly, or at a school path such as ullindia.com/auremont so more schools can sit beside it later?
3. The logo shows two schools, ULL Global and ULL Auremont. Is ULL Global part of this build?
