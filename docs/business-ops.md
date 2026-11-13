# ULL India — business and operations guide

For leadership, admissions, marketing, content, and school operations. This is the current picture of the public website and the staff admissions desk. Technical detail lives in `docs/it-support.md`.

Checked against this repository and the GitHub issues on 2026-11-13. No GitHub issue is closed. The website and the staff desk described below are already in the project; the roadmap is the work still listed.

## What families and staff have today

**The public website** is the school site families browse. They can read the pages, send an enquiry, and ask for a campus visit. An enquiry or visit request is accepted only after the family confirms their mobile number. The form stores the campaign link they opened, so admissions can see where the family came from. Public pages include a Google tag so marketing can count visits.

The "Parent login" link goes to a holding page. That page says the parent portal opens with the next admissions cycle. Families cannot register, add a child, upload documents, or follow an application there yet.

**The staff desk** is the sign-in area for employees (the address ends in `/admin`). Admissions and the front desk use it as the Admissions & Visitor Desk: one record per family enquiry, visit, walk-in, or phone call. Staff move a family through these stages: Enquired, Visit booked, Visited, Child interaction, Documents pending, Admission confirmed, Orientation done, Enrolled, or Lost / not now. They can assign a follow-up, write notes, and record a visit time and a visitor pass code.

People who look after the website can edit pages and photos in the same sign-in area, including a visual page editor. Saving a draft keeps it off the public site. Publishing a page asks the site to rebuild, when that automatic rebuild has been switched on for the environment.

Staff roles in the desk today:

| Who | What they can do |
|---|---|
| Group admin | Everything, including staff accounts and deleting an enquiry. |
| School admin | Admissions records, private family files, and website pages. They cannot delete an enquiry or create staff accounts. |
| Content editor | Website pages and settings. They cannot open the enquiry list. |
| Admissions counsellor | Enquiry list, follow-ups, and private family files. They cannot edit the website. |
| Front desk | Enquiry list and follow-ups. They cannot edit the website or open private family files. |

There is no separate parent account, and there is no security-guard role, in the product today.

## How to ask for a change or report a bug

Open a GitHub issue on this project: [new issue](https://github.com/elseifai/ull/issues/new).

Write in ordinary language:

- what should change, or what went wrong
- where it is (which page, or which part of the admissions desk)
- who asked
- how urgent it is
- a screenshot, if you have one

Ready-made forms for those requests are not set up yet ([#194](https://github.com/elseifai/ull/issues/194)). Until they are, a normal issue is the request.

The content team does not publish to the website or type records straight into the live desk. See the next section.

## Content checks

This is the working rule, from [#195](https://github.com/elseifai/ull/issues/195) and [#196](https://github.com/elseifai/ull/issues/196). The automatic checker is not built yet, so a person does the check before anything is entered.

The content team never publishes directly. What they send is checked first.

Check phone numbers, email addresses, campus addresses, fees, and names (ULL India, ULL Auremont, ULL Global). If a check fails, send it back to the person who submitted it.

Where a checked item goes:

- Family contact details and new enquiries go into the admissions desk.
- Page wording and photos go in as a draft for review. They do not go straight onto the public site.
- Anything unclear goes to the WhatsApp group **353 ULL CRM**. Do not guess.

The software will still let a content editor press publish. Until the automatic check exists, follow this rule by hand.

## Roadmap

Twenty-four epics, the issues titled `[Epic]`, from [#4](https://github.com/elseifai/ull/issues/4) to [#192](https://github.com/elseifai/ull/issues/192). The names in the table are the GitHub titles. Progress is how many of that epic's tasks were closed on 2026-11-13. Every epic is open, and none of those tasks are closed. "Backlog" means the epic also has the backlog label.

| Epic | Issue | Phase | Progress |
|---|---|---|---|
| 01 Timeline for all workstreams | [#4](https://github.com/elseifai/ull/issues/4) | P0 Foundation | 0 of 4 closed |
| 02 AWS deployment (infra, CDK, domain, DNS, SSL, CDN, backups) | [#9](https://github.com/elseifai/ull/issues/9) | P0 Foundation | 0 of 13 closed |
| 03 GST, company profile and payment details | [#23](https://github.com/elseifai/ull/issues/23) | P0 Foundation | 0 of 8 closed |
| 04 Marketing, online and offline | [#24](https://github.com/elseifai/ull/issues/24) | P1 Launch | 0 of 9 closed |
| 05 Brand architecture (ULL India, ULL Global, ULL Auremont) | [#45](https://github.com/elseifai/ull/issues/45) | P0 Foundation | 0 of 5 closed |
| 06 Visitor management dashboard and operational intelligence | [#25](https://github.com/elseifai/ull/issues/25) | P2 Operate · backlog | 0 of 8 closed |
| 07 Website with CMS, AI content intake and SEO validation | [#59](https://github.com/elseifai/ull/issues/59) | P1 Launch | 0 of 13 closed |
| 08 In-house CRM for group admins, school admins and counsellors | [#73](https://github.com/elseifai/ull/issues/73) | P1 Launch | 0 of 13 closed |
| 09 SSO for admins (Microsoft Entra ID) and for parents and students | [#87](https://github.com/elseifai/ull/issues/87) | P1 Launch | 0 of 5 closed |
| 10 Student dashboard | [#27](https://github.com/elseifai/ull/issues/27) | P4 Learn · backlog | 0 of 6 closed |
| 11 Parent dashboard | [#99](https://github.com/elseifai/ull/issues/99) | P4 Learn · backlog | 0 of 8 closed |
| 12 Google Business Profile connector in the admin portal | [#108](https://github.com/elseifai/ull/issues/108) | P2 Operate · backlog | 0 of 7 closed |
| 13 CDN for all media uploads and references | [#116](https://github.com/elseifai/ull/issues/116) | P0 Foundation | 0 of 1 closed |
| 14 Social media and metrics dashboard for the group admin | [#118](https://github.com/elseifai/ull/issues/118) | P2 Operate · backlog | 0 of 5 closed |
| 15 Competitor deep study and gap report | [#124](https://github.com/elseifai/ull/issues/124) | P0 Foundation | 0 of 5 closed |
| 16 Dedicated pages for ULL Global and ULL Auremont | [#130](https://github.com/elseifai/ull/issues/130) | P1 Launch | 0 of 5 closed |
| 17 Success metrics for each team | [#136](https://github.com/elseifai/ull/issues/136) | P0 Foundation | 0 of 4 closed |
| 18 CRM lead source attribution (online, offline, coupons, WhatsApp) | [#141](https://github.com/elseifai/ull/issues/141) | P1 Launch | 0 of 6 closed |
| 19 External CRM sync (Orggen CRM / Zoho CRM) | [#148](https://github.com/elseifai/ull/issues/148) | P2 Operate · backlog | 0 of 8 closed |
| 20 Assessment platform integration (student and parent dashboards) | [#157](https://github.com/elseifai/ull/issues/157) | P2 Operate · backlog | 0 of 10 closed |
| 21 Audio recorder devices and AI success metrics per persona | [#168](https://github.com/elseifai/ull/issues/168) | P2 Operate · backlog | 0 of 6 closed |
| 22 Sarvam AI voice agents (outbound and common inbound with human handover) | [#26](https://github.com/elseifai/ull/issues/26) | P3 Automate · backlog | 0 of 7 closed |
| 23 Microsoft 365, subscriptions, security, onboarding, HR, compliance and hiring | [#182](https://github.com/elseifai/ull/issues/182) | P1 Launch | 0 of 9 closed |
| 24 Delivery workflow: living docs, ops feedback loop and content intake | [#192](https://github.com/elseifai/ull/issues/192) | Unscheduled · backlog | 0 of 8 closed |

Phase names are the GitHub milestones. Epic 24 has no milestone. The milestone windows on GitHub are: P0 Foundation, 26 Oct–13 Nov 2026; P1 Launch, 9 Nov–18 Dec 2026; P2 Operate, 4 Jan–26 Feb 2027; P3 Automate, 1 Feb–26 Mar 2027; P4 Learn, 1 Feb–30 Apr 2027.

The board those issues should sit on is the GitHub Project **ULL India Roadmap**. A link for that board is not available yet.

## Decisions waiting on the owner

These five issues are open and labelled blocked.

| Issue | What is waiting | Blocked on |
|---|---|---|
| [#88](https://github.com/elseifai/ull/issues/88) | Register the Microsoft sign-in app and the security groups for roles and campuses. | Microsoft 365 has not been purchased (epic 23). |
| [#150](https://github.com/elseifai/ull/issues/150) | Get the outside CRM's address, login method, field list, and a test account. The ticket names that CRM Orggen ('Origin'). | Orggen/Origin CRM endpoint and payload not yet provided. |
| [#153](https://github.com/elseifai/ull/issues/153) | Build the connection that sends our admissions records to that CRM. | Same missing Orggen/Origin CRM endpoint and payload. |
| [#198](https://github.com/elseifai/ull/issues/198) | Decide whether business requests stay as GitHub issues only, or also come from Jira. | Answer from Vaibhav: is Jira used, and where. |
| [#200](https://github.com/elseifai/ull/issues/200) | Confirm where the admissions system lives: inside this project's staff desk, or in a separate project. No separate admissions project was found. | Answer from Vaibhav. |

## What changed

| Date | What changed for staff and families |
|---|---|
| 2026-10-22 | The public website and the staff admissions desk were added to the project. |
| 2026-10-26 | Photos on the site, and private family files, were split so private files are not on the public site. Hosting for a trial site and the live site was added in code. |
| 2026-11-03 | A published page is included when the site is updated. Enquiry forms store the campaign link the family opened. Public pages include the Google tag used for visit counts. |
| 2026-11-11 | A family must confirm their mobile number before an enquiry or visit request is accepted. Staff can still type in a walk-in themselves. |
| 2026-11-13 | This guide, the technical guide, and the assistant brief were added. No change to the website or the admissions desk. |
