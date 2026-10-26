---
name: 14 Social media and metrics dashboard for the group admin
overview: One dashboard in /admin where the Group admin sees social media performance (Instagram, Facebook, YouTube, LinkedIn), paid ads (Meta, Google), web analytics (GA4, Search Console) and Google Business Profile next to CRM outcomes, by brand and campaign. Data is pulled daily through the platforms' APIs. 11 Jan – 5 Feb 2027.
todos:
  - id: access
    content: Get API access for Meta (Business Manager system user), YouTube Analytics, LinkedIn Community Management, GA4 Data API, Search Console API and Google Ads API
    status: pending
  - id: build-vs-buy
    content: Decide to build (recommended) or to use a third-party tool and embed it
    status: pending
  - id: collectors
    content: Write daily collectors per platform into a metrics table
    status: pending
  - id: dashboard
    content: Build the Group admin dashboard with brand and date filters, and a weekly PDF/email
    status: pending
  - id: joins
    content: Join spend and clicks to CRM leads, visits and admissions through UTM campaign (plan 18)
    status: pending
isProject: false
---

# 14 · Social media and metrics for the group admin

## Build or buy

| Option | Pros | Cons |
|---|---|---|
| **Build in `/admin` (recommended)** | Joins social and ad data with CRM outcomes (cost per admission), one login, no per-seat fees | API approvals and maintenance |
| Tool (Metricool, Sprout Social, Hootsuite, Zoho Social) | Fast, includes scheduling | Can't see admissions; extra cost; data in another place |

Recommendation: **build the reporting**, and use a scheduling tool only if the social team wants one (Meta Business Suite is free for FB/IG scheduling).

## Sources and metrics

| Source | API | Daily metrics |
|---|---|---|
| Instagram (per brand) | Instagram Graph API via Meta Business Manager | Followers, reach, impressions, profile visits, website taps, per-post reach, saves, shares, Reel plays, engagement rate |
| Facebook page | Graph API Page Insights | Followers, reach, engagement, video views |
| YouTube channel | YouTube Analytics API + Data API | Subscribers, views, watch time, average view duration, CTR, top videos, traffic sources |
| LinkedIn page | LinkedIn Community Management API (needs app review) | Followers, impressions, clicks, engagement |
| Meta Ads | Marketing API (Insights) | Spend, impressions, reach, CPM, clicks, CTR, leads (Lead Ads), cost per lead, by campaign/ad set/ad |
| Google Ads | Google Ads API (developer token) | Spend, clicks, CPC, conversions, cost per conversion, search terms |
| GA4 | Analytics Data API | Users, sessions, engaged sessions, conversions (`enquiry_submitted`, `visit_booked`) by source/medium/campaign, landing pages |
| Search Console | Search Console API | Clicks, impressions, CTR, average position, top queries and pages |
| Google Business Profile | Plan 12 | Calls, directions, website clicks, rating |
| CRM | Plan 08 / 18 | Leads, visits, applications, admissions by source/campaign |

Access setup: a Meta **system user** in ULL's Business Manager with a long-lived token; a Google service account added to GA4 and Search Console; OAuth for YouTube, LinkedIn and Google Ads. All tokens in Secrets Manager.

## Storage

One narrow table: `metricsDaily(date, source, account, brand, campaign, entity, metric, value)` + `posts(source, id, brand, publishedAt, type, url, caption)` for content performance. Collectors run at 05:00 IST on the SQS worker (plan 02) and backfill 30 days on first run.

## Dashboard (`/admin/insights`)

Filters: date range, brand (Group, Auremont, Global), channel.

1. **Outcome strip:** leads, visits, admissions, cost per lead, cost per visit, **cost per admission** (spend ÷ admissions with that source).
2. **Paid:** spend vs budget, CPL by campaign, best and worst ads.
3. **Social:** follower growth per platform, reach, engagement rate, top 10 posts by engagement and by leads generated.
4. **YouTube:** views, watch time, top videos, average view duration for the walkthrough.
5. **Website:** sessions by source, conversion rate, top landing pages.
6. **Search:** clicks and impressions trend, top queries, average position for target keywords ("CBSE school Nagarbhavi").
7. **Local:** GBP calls, directions, rating.
8. **Weekly email** to the Group admin every Monday 08:00 with the strip, three wins and three issues (AI-written from the numbers, same guardrails as plan 11).

## Acceptance

- Numbers for the last 30 days match each platform's own UI within 5% (platforms restate data for a few days).
- Cost per admission by channel is visible for the season.
- The Monday email arrives with correct numbers.

## Open questions

1. Who owns each social account today (personal profiles must move to Business Manager)?
2. Is a scheduling tool wanted for the social team?
