---
name: 04 Marketing, online and offline
overview: A season plan for the 2027-28 admissions cycle covering brand presence, social media, digital ads (Meta, Google, YouTube), video (campus walkthrough, parent and alumni stories, event aftermovies), the gallery, and offline activity around Nagarbhavi. Every channel feeds tracked leads into the CRM (plan 18). 2 Nov 2026 onward, peak Dec–Mar.
todos:
  - id: positioning
    content: Write one positioning line and three proof points each for ULL India, ULL Auremont and ULL Global
    status: pending
  - id: assets
    content: Shoot the campus walkthrough, a 60s brand film, 6 parent/teacher stories and a photo library before 11 Dec
    status: pending
  - id: accounts
    content: Set up or claim Instagram, Facebook, YouTube, LinkedIn and Google Business Profile for each brand, all owned by a company Business Manager
    status: pending
  - id: tracking
    content: Install GA4, Meta Pixel + Conversions API, Google Ads conversion tags, and the UTM convention before any spend
    status: pending
  - id: paid-launch
    content: Launch Meta (lead + traffic) and Google Search campaigns on 14 Dec with the budget split below
    status: pending
  - id: offline
    content: Book offline activations near Nagarbhavi (societies, preschools, hoardings, events) with unique QR codes and coupon codes
    status: pending
  - id: calendar
    content: Publish a 12-week content calendar and review it weekly against plan 17
    status: pending
isProject: false
---

# 04 · Marketing, online and offline

## Goal for the season

Fill the 2027-28 intake at ULL Auremont (Nursery to Grade 10, CBSE) and build a waitlist for ULL Global (IB). Everything is measured as **campus visits booked** and **admissions confirmed**, not likes.

## 1. Brand presence (foundations, Nov)

| Item | ULL India | ULL Auremont | ULL Global |
|---|---|---|---|
| Website section | `ullindia.com` | `ullindia.com/auremont` | `ullindia.com/global` |
| Instagram | @ullindia | @ullauremont | @ullglobal (reserve now) |
| Facebook page | yes | yes | reserve |
| YouTube | one channel, playlists per school | | |
| LinkedIn | company page (hiring, leadership, partnerships) | showcase page | showcase page |
| Google Business Profile | – | Nagarbhavi campus (plan 12) | when a campus exists |
| WhatsApp Business | one number per school via WATI | | |
| Listings | Edustoke, SchoolMyKids, Justdial, Sulekha, Google Maps | | |

Keep name, address and phone identical everywhere (local SEO).

## 2. Content pillars

1. **Learning that shows:** the Learning Cycle, classroom moments, Aurora Lab and robotics, project work.
2. **Sport and fitness:** the Jonty Rhodes association, coaching, sports week.
3. **Beyond the classroom:** Pulse, Ruchi, Kushala, Summit Pathway.
4. **Safety and care:** CCTV, transport, nurse, counsellor, teacher-student ratio. Competitors (VIBGYOR) put safety on the homepage; parents ask about it first.
5. **People:** teachers, the principal, parents' stories.
6. **Results and recognition:** as they arrive (Auremont is new, so lead with teacher credentials and partnerships rather than toppers).

## 3. Video plan

| Video | Length | Use | When |
|---|---|---|---|
| Campus walkthrough (gimbal + drone) | 2–3 min + 30s cut | Website hero, YouTube, Google Business Profile, WhatsApp follow-up | by 11 Dec |
| Brand film "Rooted deep. Rising high." | 60s + 15s + 6s bumpers | YouTube ads, Meta Reels | by 11 Dec |
| Principal's welcome | 90s | Admissions page, follow-up messages | by 11 Dec |
| Parent stories | 6 × 45s | Reels, Shorts, testimonials block | Dec–Jan |
| Teacher spotlights | 6 × 30s | Social, "our teachers" page | Jan |
| A day at ULL Auremont | 90s | Social, portal | Jan |
| Event aftermovies (sports day, annual day, Pulse) | 60–90s within 72 hours of each event | Social, gallery, alumni/parent groups | each event |
| Alumni stories | 60s | Brand recall | **Auremont is a new school with no alumni yet.** Use ULL leadership's previous schools, or switch this to "founding family" stories |
| ULL Global explainer (IB approach) | 90s animated | Global page, waitlist ads | Jan |

Every video gets: captions (English + Kannada subtitles for Reels), a vertical cut, and a CTA to book a visit with a tracked link.

## 4. Gallery

- CMS gallery (existing `gallery` block) with albums: Campus, Classrooms, Sports, Events, Labs. Filters on the Campus page.
- Upload rules: real photos only (the concept site uses AI visuals; replace them before launch), alt text required, faces of children only with photo consent recorded.
- Event albums published within 48 hours of the event, linked from the aftermovie.

## 5. Digital paid media

Starting monthly split (adjust after 4 weeks of data):

| Channel | Share | Objective | Notes |
|---|---|---|---|
| Google Search | 35% | Visits booked | Keywords: "CBSE school Nagarbhavi", "best school near Vijayanagar", "school admission 2027-28 Bengaluru", competitor-adjacent terms; geo 8–10 km radius |
| Meta (Instagram + Facebook) | 35% | Leads + visits | Instant Forms with a qualifying question (grade), plus traffic to the visit page; parents 26–45, 8 km radius |
| YouTube | 15% | Reach + recall | In-stream skippable with the 15s/60s films; retarget site visitors |
| Performance Max / Discovery | 10% | Extra reach | Only after conversions are tracked |
| Retargeting | 5% | Return visitors | Website visitors who did not book |

Rules:
- Every ad URL uses the UTM convention from plan 18 (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`).
- Meta Lead Ads and Google lead forms post straight into the CRM via webhooks (plan 18), so leads are called in minutes.
- Conversion events: `enquiry_submitted`, `visit_booked`, `visit_attended` (offline conversion upload from the CRM).

## 6. Organic social cadence

| Platform | Frequency | Format |
|---|---|---|
| Instagram | 5 posts + daily stories | 3 Reels, 2 carousels |
| Facebook | 3 posts | Cross-post + parent community events |
| YouTube | 1 long + 3 Shorts | Walkthrough, stories |
| LinkedIn | 2 posts | Leadership, hiring, partnerships |
| Google Business Profile | 1 post | Events and offers (plan 12) |

## 7. Offline marketing (Nagarbhavi and around)

| Activity | Tracking |
|---|---|
| Hoardings and bus-shelter ads on main roads (Nagarbhavi, Vijayanagar, Rajarajeshwari Nagar, Chandra Layout) | Unique QR → `/auremont/visit?src=hoarding-<id>` |
| Apartment society activations (weekend stalls, kids' activity) | QR + coupon code per society |
| Preschool tie-ups (Grade 1 feeders) | Referral code per preschool |
| Open houses and campus tours every Saturday | Visit bookings in CRM |
| Workshops (parenting, robotics, sports clinic with coaches) | Event registration form |
| Newspaper inserts / pamphlets in local editions | QR + call-tracking number |
| Parent referral programme | Referral code per family |
| Brochure (print + PDF) | QR on back page |
| Radio / cinema (optional, if budget) | Vanity URL |

Ground sales team logs every walk-in in the visitor desk (plan 06) so offline is measured too.

## 8. Season calendar

| Weeks | Focus |
|---|---|
| 2 Nov – 13 Dec | Shoot, accounts, tracking, listings, brochure, hoarding booking |
| 14 Dec – 10 Jan | Launch: paid + organic, open houses every Saturday |
| 11 Jan – 28 Feb | Peak: workshops, society activations, referral push |
| Mar | Last-seat urgency, admission confirmed stories |
| Apr–Jun | Orientation content, first-day aftermovie, ULL Global waitlist |

## Acceptance

- All accounts owned by the company, not personal profiles.
- Tracking verified with test leads from every channel before spend.
- Walkthrough and brand film live by 14 Dec.
- Weekly report (plan 17) from week 1 of spend.

## Open questions

1. Monthly media budget for Dec–Mar?
2. Is the Jonty Rhodes association cleared for ads (image rights, duration)?
3. Does ULL Global have a launch year and city yet?
