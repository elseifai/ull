---
name: 15 Competitor deep study and gap report
overview: A study of Orchids The International School, Ryan Group and VIBGYOR High covering page structure, layout, forms, verification, communication, brochures, offerings, mobile apps and notifications, with a gap report and a must-have feature list for ULL. First pass done from the live homepages on 23 Oct 2026; deeper pass (campus pages, forms end-to-end, apps, mystery-shopping) 26 Oct – 6 Nov.
todos:
  - id: deep-pass
    content: Visit 3 campus pages, the admission form, fee page and parent app listing of each competitor; record screenshots in screenshots/competitors
    status: pending
  - id: mystery-shop
    content: Submit a test enquiry on each site and log every call, WhatsApp, SMS and email received for 14 days (speed and quality)
    status: pending
  - id: seo-audit
    content: Run Lighthouse and a crawl (titles, meta, schema, sitemap, Core Web Vitals) on each homepage and one campus page
    status: pending
  - id: bengaluru-local
    content: Add 2–3 local competitors near Nagarbhavi to the study (same grade range, CBSE)
    status: pending
  - id: signoff
    content: Review the must-have list with ULL and lock the launch scope for plans 07, 08 and 16
    status: pending
isProject: false
---

# 15 · Competitor deep study and gap report

Sources: homepages of `orchidsinternationalschool.com`, `ryangroup.org`, `vibgyorhigh.com`, read on 23 Oct 2026. Items marked "not seen" may be loaded by scripts and need a live check in the deep pass.

## 1. Snapshot

| | Orchids | Ryan Group | VIBGYOR High |
|---|---|---|---|
| Scale claimed | 150+ campuses, 20+ cities | 150+ schools, 40+ cities, 8 boards, 50+ years | 41 schools, 15 cities, since 2004 |
| Boards | CBSE, ICSE | CBSE, ICSE, IGCSE, IB | CBSE, CISCE, Cambridge (CIE) |
| Site structure | Paths: `/{city}-branches/{campus}`, `/school-admission-in-{city}` | Mixed: paths (`/search-result/...`, `/site/<campus>/`), subdomains (`ryaninternationalacademy.ryangroup.org`), separate domain (`ryanglobalschools.com`) | Paths: `/school/{city}/{board}/{campus}`; sister brands on separate domains |
| Main nav | Day & Boarding Schools, Admission, Study Materials, Blogs, Helpdesk, About, More | About, Academics, Admissions, Student Life, Parents Corner, Alumni Connect, Guidance Program | About, Curriculum, Schools, Beyond Academics, Teaching & Learning, Admissions, Locate Us |
| Utility bar | Admissions 2027-28, phone, email, hiring | Phone, "Enquire for Early Bird Benefits", socials | Enquiry Form, Parent Login |
| Enquiry form | Parent, child, mobile (country code), email, city, branch (~130 options), grade | Separate enquiry page; online registration; document list | Academic year, school, first/last name, relation, email, country code, phone, grade, query, **math captcha** |
| Verification | None seen | Not seen | Math captcha only |
| School locator | City lists + branch dropdown, no map | Board → City → School dropdowns | Map image + locator page |
| Brochure | Not seen | Document list only | Not seen |
| Fees | "Fee Structure" link | Not seen | Not seen |
| Chat / WhatsApp | Not seen | Click-to-call only | Click-to-call only |
| Parent app | Orchids School Connect / Eduvate (footer badges) | Parent portal app (MyClassboard-based) | Parent login on Hubblehox; no app |
| Content hub / SEO play | Very large: NCERT solutions, syllabus, worksheets, calculators, poems | Blog, media, guidance programme | Blog, results |
| Social proof | Toppers, awards, achievers grid | Stats band, award logo wall, roll of honour | Awards carousel, results banners, gallery |
| Alumni | – | Strong: Ryan Connect, notable alumni, diaries | – |
| Virtual tour | Not seen | Video embed | None |
| Title tag | "ORCHIDS The International School \| Best CBSE and ICSE Schools in India" | "Top 10 International Schools in India - Ryan Group" (body doesn't deliver a top-10 list) | "Top CBSE, CISCE and CIE Schools in Karnataka, Maharashtra, Gujarat…" |
| Visible issues | Mixed year labels (2026-27 vs 2027-28), unfiltered 130-option branch list | Duplicate menu markup, mismatched app badge alt text, inconsistent `/about` vs `/about-us` links, "8 boards" claim with 4 named | Inconsistent footer links (city hub vs single campus), math captcha friction |

## 2. What they do well (copy the idea, not the execution)

1. **Admissions CTA everywhere** with the academic year in the label (all three).
2. **Find a school by board → city → campus** (Ryan) and city landing pages for local SEO (Orchids `/school-admission-in-{city}`).
3. **Proof up front:** results, toppers, awards, stats band (all).
4. **Content hub for organic traffic** (Orchids' study materials attract parents searching NCERT help).
5. **Parent life sections:** Parents Corner, testimonials, engagement events, refer-a-parent (Ryan).
6. **Alumni network** (Ryan).
7. **Safety as a selling point** on the homepage (VIBGYOR "The VIBGYOR Edge").
8. **Campus pages with a consistent URL pattern** (VIBGYOR).

## 3. Gaps across all three (ULL's opportunity)

| Gap | ULL response | Plan |
|---|---|---|
| No phone verification on enquiry forms → junk leads, slow follow-up | Phone OTP (WhatsApp) on visit booking; light forms stay one step | 06, 08 |
| No instant WhatsApp / chat | WhatsApp click-to-chat with source tagging + AI assistant on the site with human handover | 18, 22 |
| No visible brochure or fee transparency | Downloadable brochure per brand; fee range per grade band on the campus page | 07, 16 |
| No virtual tour | Campus walkthrough video + 360° photos | 04, 16 |
| No visit booking with a slot picker | Book a visit with real slots and a digital pass | 06 |
| Admission status invisible to parents | Applicant view in the parent portal | 11 |
| Parent apps are third-party white labels | Branded PWA portal with weekly reports | 11 |
| Testimonials thin or missing | Parent video stories and quotes per campus | 04, 07 |
| Teachers invisible | Faculty profiles | 07, 16 |
| Mixed domain strategies (Ryan) | One domain with brand paths | 05 |
| Generic SEO titles, missing meta descriptions | Enforced SEO validation per page | 07 |
| No career guidance tools in admissions (only Ryan mentions guidance) | Psychometric tests on ullindia.aptitudetest.in as a lead magnet and student service | 20 |
| Data inconsistency (years, counts) | CMS facts sheet + validation | 07 |

## 4. Must-have features for ULL (launch, 14 Dec)

**Page structure**
- Group home → brand homes (`/auremont`, `/global`) → campus page → admissions.
- Sticky top bar: Admissions 2027-28 · Book a Visit · Enquire · WhatsApp · Parent Login.
- Mega-menu limited to 6 groups (Ryan's 7 deep groups are too much).

**Layout (homepage of each brand)**
Hero with video → proof strip (stats/awards/ambassador) → why us (4 pillars) → academics by stage → sports → beyond the classroom → safety and care → campus tour → parent stories → faculty → news/events → FAQ → visit CTA with map.

**Forms**
- Enquiry: parent name, phone (+91 default, country code), child name, grade, campus (pre-selected from page), consent. Email optional. Under 30 seconds.
- Visit booking: + date/slot picker, phone OTP, WhatsApp confirmation with pass.
- Brochure download: name + phone, then instant PDF.
- Register interest (ULL Global).
- Hidden fields: UTM, gclid/fbclid, landing page, referrer (plan 18).

**Verification**
- OTP on visit booking and portal login; honeypot + rate limiting on forms (no captcha friction); duplicate detection in CRM.

**Communications**
- Instant WhatsApp + email acknowledgement; counsellor call within 15 min (plan 08 SLA); visit reminders; post-visit sequence (plan 06).

**Brochures and offerings**
- Brand brochure, grade-band fee sheet, transport routes PDF, programme one-pagers (Pulse, Ruchi, Kushala, Aurora Lab, Summit Pathway).

**Mobile app and notifications**
- PWA portal with web push now; native app only after usage is proven.

**After launch (P2)**
- City/area landing pages ("CBSE school in Vijayanagar", "school near Rajarajeshwari Nagar"), a parent resources hub (light version of Orchids' study content), alumni/founding families section.

## 5. Deep-pass checklist (26 Oct – 6 Nov)

For each competitor:
- [ ] Homepage, a campus page, admissions page, fee page, contact page: screenshots (desktop + mobile)
- [ ] Full form submission with a test number; record verification, thank-you page, redirects
- [ ] Response log for 14 days: first call time, WhatsApp, SMS, email, number of touches, quality
- [ ] Lighthouse mobile: performance, LCP, CLS, accessibility
- [ ] Schema types present (view source / Rich Results Test)
- [ ] Sitemap size and structure
- [ ] Parent app: store rating, reviews, features
- [ ] Social: followers and posting frequency per platform; YouTube top videos
- [ ] Google Business Profile rating and review count for the nearest campus to Nagarbhavi

## Open questions

1. Which local Bengaluru schools near Nagarbhavi does ULL lose families to? Add them to the study.
2. Is ULL comfortable showing fee ranges publicly?
