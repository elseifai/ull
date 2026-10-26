---
name: 16 Dedicated pages for ULL Global and ULL Auremont
overview: The full page tree, page templates and content checklist for the two school brands, modelled on what competitors do per school (plan 15) and on the brand rules in plan 05. Auremont (CBSE, live campus at Nagarbhavi) gets a full admissions section; Global (IB, no campus yet) gets a launching-soon section with a waitlist. 9 Nov – 11 Dec 2026.
todos:
  - id: move-auremont
    content: Move the current site pages under /auremont/ with 301 redirects from old paths
    status: pending
  - id: templates
    content: Build brand home, campus, programme, stage and admissions templates in the page builder
    status: pending
  - id: auremont-content
    content: Collect missing Auremont content (story, facilities, fees, faculty, photos, contact, affiliation details)
    status: pending
  - id: global-content
    content: Write ULL Global pages (IB approach, leadership, launch plans) with IB-approved wording
    status: pending
  - id: schema
    content: Add School JSON-LD per campus and Organization/subOrganization for the group
    status: pending
  - id: qa
    content: SEO validation, Lighthouse, mobile and accessibility pass on every page before 11 Dec
    status: pending
isProject: false
---

# 16 · Dedicated pages for ULL Global and ULL Auremont

## What competitors do per school (from plan 15)

- VIBGYOR: each campus at `/school/{city}/{board}/{campus}` with its own enquiry, facilities and gallery.
- Orchids: each campus at `/{city}-branches/{campus}`, plus city admission pages.
- Ryan: board/city search, some schools on subdomains or separate domains.

ULL has one campus and two brands, so we use **brand-level pages for the story and curriculum** and **campus-level pages for local details** (address, fees, transport, visits). This keeps content once per brand and makes a second campus a copy of one page.

## ULL Auremont (`/auremont`)

Accent: orange. CBSE, Nursery – Grade 10. Motto "Rooted deep. Rising high."

```
/auremont/                              Brand home
/auremont/about/                        Our story, the name, vision & mission
/auremont/about/the-auremont-way/       Values
/auremont/about/leadership/             Principal, academic heads
/auremont/about/our-teachers/           Faculty profiles
/auremont/academics/                    Approach + Learning Cycle
/auremont/academics/foundational/       Nursery – Grade 2
/auremont/academics/preparatory/        Grades 3 – 5
/auremont/academics/middle/             Grades 6 – 8
/auremont/academics/secondary/          Grades 9 – 10
/auremont/academics/assessment/         Assessment and progress (HPC)
/auremont/sports/                       Sports & fitness (Jonty Rhodes)
/auremont/beyond-the-classroom/         Hub
/auremont/beyond-the-classroom/pulse/  
/auremont/beyond-the-classroom/ruchi/
/auremont/beyond-the-classroom/kushala/
/auremont/beyond-the-classroom/aurora-lab/
/auremont/beyond-the-classroom/summit-pathway/
/auremont/safety-and-care/              CCTV, transport, health, counselling, POCSO policy
/auremont/parents/                      Partnering with parents, a week at Auremont, portal
/auremont/news/  /auremont/events/
/auremont/nagarbhavi/                   Campus page (below)
/auremont/nagarbhavi/facilities/
/auremont/nagarbhavi/gallery/
/auremont/nagarbhavi/virtual-tour/
/auremont/nagarbhavi/transport/         Routes and areas served
/auremont/nagarbhavi/fees/              Fee range per grade band (if approved)
/auremont/nagarbhavi/mandatory-disclosure/  CBSE public disclosure
/auremont/admissions/                   5-step process, timeline, eligibility by age
/auremont/admissions/enquire/
/auremont/admissions/book-a-visit/
/auremont/admissions/faq/
/auremont/admissions/documents/         Documents checklist
/auremont/admissions/brochure/          Download (gated)
```

### Auremont brand home sections

1. Hero video (walkthrough cut) + "Admissions open 2027-28" + Book a visit / Enquire.
2. Proof strip: CBSE, Nursery – Grade 10, teacher-student ratio, Jonty Rhodes sports partnership, campus area.
3. Four pillars.
4. Learning Cycle.
5. Stages (4 cards → stage pages).
6. Sports.
7. Beyond the classroom (5 programme cards).
8. Safety and care.
9. Campus tour (video + gallery strip).
10. Parent stories (video testimonials).
11. Teachers (3 profiles + link).
12. News and events.
13. FAQ (FAQPage schema).
14. Visit CTA + map + WhatsApp.

### Campus page `/auremont/nagarbhavi/`

Address and map, phone/WhatsApp, visiting hours, grades offered, facilities summary, transport areas, fee range, admissions timeline, counsellor contact, Google rating (plan 12), "Book a visit" slot picker. JSON-LD `School` with address, geo, opening hours, `parentOrganization: ULL India`.

### Auremont content to collect (gaps from `PLAN.md` and `ULL-Auremont-Content-Map.xlsx`)

- [ ] Our story, founding year, founders/leadership bios and photos
- [ ] Facilities list with photos (classrooms, labs, library, sports, transport, infirmary)
- [ ] Phone, email, full address and PIN, map pin
- [ ] CBSE affiliation number or status; mandatory disclosure documents
- [ ] Fee ranges by grade band (or decision to hide)
- [ ] Faculty list and photos (with consent)
- [ ] Real photos to replace AI visuals; walkthrough video (plan 04)
- [ ] Transport routes and areas
- [ ] Admission timeline and age eligibility for 2027-28
- [ ] Brochure PDF

## ULL Global (`/global`)

Accent: teal. IB. **No campus yet**, so status `launching`.

```
/global/                         Brand home (launching)
/global/why-ib/                  IB philosophy, learner profile, PYP/MYP/DP explained for parents
/global/our-approach/            How ULL Global will teach (inquiry, languages, global citizenship)
/global/leadership/              Founding head, advisors
/global/faq/                     When, where, fees range expectation, IB status
/global/register-interest/       Waitlist form → CRM (brand=global, intent=waitlist)
/global/news/                    Milestones (site, construction, IB candidacy)
```

### Global brand home sections

1. Hero: "ULL Global, an IB school by ULL India, coming to <city> in <year>" (only once confirmed).
2. What IB means for your child (3 cards: PYP, MYP, DP).
3. Learner profile (10 attributes).
4. Our approach.
5. Founding leadership.
6. Timeline to opening.
7. FAQ.
8. Register interest form + "visit ULL Auremont meanwhile" cross-link.

**IB wording:** until authorised, use only the wording IB allows for interested or candidate schools; do not say "IB World School". Do not use the IB logo without permission.

When a campus is confirmed, add `/global/<campus>/` using the same campus template as Nagarbhavi.

## Shared templates (page builder)

| Template | Used by |
|---|---|
| Brand home | `/auremont/`, `/global/` |
| Campus | `/auremont/nagarbhavi/`, future campuses |
| Stage | 4 Auremont stages, future Global programmes |
| Programme | 5 Beyond the classroom pages |
| Admissions step | admissions sub-pages |
| Landing (ads) | campaign pages (no nav, one form) |

New blocks needed: `video-hero`, `stats-strip`, `faculty-grid`, `testimonial-video`, `map-contact`, `fee-table`, `timeline`, `download-gate`, `news-list`, `event-list`, `brand-switcher`.

## Acceptance

- Every page in both trees exists, passes SEO validation (plan 07), and has a CTA.
- Old root URLs redirect to `/auremont/...`.
- Lighthouse mobile ≥ 90 on brand homes and the campus page.
- Global pages make no claims about IB authorisation, fees or opening dates that are not confirmed.

## Open questions

1. ULL Global city and target opening year?
2. Show Auremont fees publicly (range) or on request?
3. Who signs off copy for each brand?
