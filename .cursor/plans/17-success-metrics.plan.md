---
name: 17 Success metrics for each team
overview: Success metrics, targets and a review cadence for the website team, CMS tech team, digital marketing, social media, offline marketing, ground sales, and the three platforms (Google Search Console, Meta Ads, Google Analytics). Targets are starting points for the 2027-28 season and are reset after four weeks of real data. 2 – 13 Nov 2026, then weekly.
todos:
  - id: baselines
    content: Record baselines for each metric in the first two weeks after launch
    status: pending
  - id: targets
    content: Agree targets with each team lead and the Group admin
    status: pending
  - id: dashboard
    content: Show every metric on the /admin insights dashboard (plan 14) or a shared sheet until it exists
    status: pending
  - id: cadence
    content: Weekly 30-minute review, monthly target reset
    status: pending
isProject: false
---

# 17 · Success metrics for each team

## North star

**Admissions confirmed for 2027-28 at ULL Auremont vs the seat target**, and **ULL Global waitlist size**. Every team metric below should move one of these.

Funnel used by everyone (definitions from plans 08 and 18):

`Website visitor → Lead → Contacted → Visit booked → Visited → Application → Admission confirmed → Enrolled`

## 1. Website building team

| Metric | Target | Source |
|---|---|---|
| Launch on 14 Dec with all pages in plan 16 | 100% of launch pages | Checklist |
| Lighthouse mobile performance (key pages) | ≥ 90 | Lighthouse CI |
| Core Web Vitals (field) | LCP < 2.5s, CLS < 0.1, INP < 200ms for 75% of visits | Search Console CWV report |
| Visitor → lead conversion rate | ≥ 3% (landing pages ≥ 8%) | GA4 + CRM |
| Form completion rate (start → submit) | ≥ 60% | GA4 events |
| Uptime | ≥ 99.9% | Route 53 health check |
| Accessibility | WCAG 2.1 AA, 0 critical issues | axe |
| Broken links / 404s | 0 internal | Crawl |

## 2. CMS tech team

| Metric | Target | Source |
|---|---|---|
| Time from AI draft to published page (no developer) | < 30 min | CMS versions |
| Pages published by content team without dev help | 100% | Audit |
| Publish → live on site | < 5 min | Deploy logs |
| Pages passing SEO validation at publish | 100% (enforced) | Plan 07 |
| CRM lead ingestion latency | < 1 min | Logs |
| Sync failures to external CRM (plan 19) | < 0.5%, retried within 1h | Outbox |
| Deploy success rate | ≥ 95% | GitHub Actions |
| P1 bug fix time | < 24h | Issue tracker |
| Restore drill passed | Monthly | Runbook |

## 3. Digital marketing team

| Metric | Target (start) | Source |
|---|---|---|
| Cost per lead (CPL) | Set after 4 weeks; Bengaluru school CPL is typically several hundred rupees | Ads + CRM |
| Cost per visit | Track; aim ≤ 4× CPL | CRM |
| **Cost per admission** | Main metric; target from budget ÷ seats | Plan 14 |
| Lead → visit rate | ≥ 25% | CRM |
| Share of leads with a valid source | 100% | Plan 18 |
| Search impression share (brand + local terms) | ≥ 70% | Google Ads |
| Landing page conversion | ≥ 8% | GA4 |

## 4. Social media team

| Metric | Target | Source |
|---|---|---|
| Posting plan delivered (plan 04 cadence) | ≥ 90% | Calendar |
| Engagement rate (Instagram) | ≥ 3% | Meta |
| Follower growth | +15% per month during season | Meta, YouTube |
| Reel views (local reach) | Track; grow month on month | Meta |
| Profile → website taps | Track | Instagram |
| Leads with source = organic social | Track; grow month on month | CRM |
| Aftermovie published after an event | ≤ 72h | Calendar |
| Response time to comments and DMs | < 2h in working hours | Meta inbox |

## 5. Offline marketing team

| Metric | Target | Source |
|---|---|---|
| Activations run per month (societies, preschools, workshops) | ≥ 8 | Event log |
| Leads per activation (QR/coupon) | ≥ 15 | CRM |
| Cost per lead by activity (hoarding, stall, insert) | Compare with digital CPL | Spend + CRM |
| QR scans → leads | ≥ 30% | Short links |
| Coupon redemption | Track | CRM |
| Open house attendance vs RSVPs | ≥ 60% | Visitor desk |

## 6. Ground sales team (counsellors, tele-callers, front desk)

| Metric | Target | Source |
|---|---|---|
| First response time | < 15 min in working hours | CRM SLA |
| Contact rate within 24h | ≥ 90% | CRM |
| Lead → visit | ≥ 25% | CRM |
| Visit → application | ≥ 50% | CRM |
| Application → admission | ≥ 60% | CRM |
| Visit no-show rate | < 20% | Plan 06 |
| Average wait time at reception | < 10 min | Plan 06 |
| Follow-ups done on time | ≥ 95% | Tasks |
| Conversation quality score | ≥ 75/100 | Plan 21 |
| Lost reason recorded | 100% | CRM |

## 7. Google Search Console

| Metric | Target | Notes |
|---|---|---|
| Indexed pages vs submitted | ≥ 95% | Pages report |
| Clicks (non-brand) | Grow month on month | Exclude "ULL" queries |
| Average position for target terms ("CBSE school Nagarbhavi", "school near Vijayanagar", "best school RR Nagar") | Top 10 within 3 months, top 3 within 6 | Performance |
| CTR on top pages | ≥ 4% | Improve titles/meta |
| Core Web Vitals "good" URLs | 100% | |
| Rich results valid (FAQ, Breadcrumb, Event) | 0 errors | Enhancements |

## 8. Meta Ads

| Metric | Target | Notes |
|---|---|---|
| CTR (link) | ≥ 1% | |
| CPM | Track | Local radius |
| Lead form completion → valid lead (phone reachable) | ≥ 70% | Use qualifying question |
| CPL and cost per visit | See section 3 | |
| Frequency | ≤ 3 per week | Rotate creatives |
| Conversions API event match quality | ≥ 6/10 | Events Manager |

## 9. Google Analytics (GA4)

| Metric | Target | Notes |
|---|---|---|
| Tracking coverage: `enquiry_submitted`, `visit_booked`, `brochure_download`, `whatsapp_click`, `call_click` | 100% of forms and CTAs | Tag tests |
| Engaged session rate | ≥ 55% | |
| Conversion rate by source/medium | Reported weekly | |
| Consent rate | Track | Consent Mode v2 |
| GA4 vs CRM lead count gap | < 10% | Data quality |

## Review cadence

| When | Who | What |
|---|---|---|
| Daily 10:00 | Counsellors + School admin | Yesterday's leads, SLA breaches, today's visits |
| Weekly, Friday | All team leads | This file's metrics, three actions |
| Monthly | Group admin | Cost per admission by channel, budget shift, target reset |
| End of season | All | What worked, budget for next year |

## Open questions

1. Seat target per grade for 2027-28?
2. Total marketing budget for the season, to set cost-per-admission targets?
