---
name: 23 Microsoft 365, subscriptions, security, onboarding, HR, compliance and hiring
overview: Buy and set up Microsoft 365 for the ULL group of schools as the staff identity, mail and device platform, keep one register of every paid service, and run staff onboarding, offboarding, HR, hiring and compliance on it. Unblocks staff sign-in to /admin with Entra ID (plan 09). Start 2 Nov 2026; tenant and security baseline by 27 Nov; mail decision before the 14 Dec launch.
todos:
  - id: edu-eligibility
    content: Apply for Microsoft academic eligibility for the school entity so Microsoft 365 Education licences can be bought (cheaper than business plans)
    status: pending
  - id: licences
    content: Choose licences per staff type (see Licences) and buy through a Microsoft education partner (CSP) with the GSTIN on the invoice
    status: pending
  - id: mail-decision
    content: Decide whether staff mail moves from Gmail to Exchange Online (recommended) or stays on Gmail; plan the cut-over date and DNS changes with the dev team
    status: pending
  - id: tenant-baseline
    content: Set up the tenant with the security baseline (MFA, Conditional Access, admin roles, audit log, DMARC, device management)
    status: pending
  - id: groups
    content: Create the role and campus security groups that drive access in Teams, SharePoint and the ULL portal (plan 09)
    status: pending
  - id: register
    content: Keep the subscription register below current (owner, plan, cost, renewal, GSTIN invoice, admins)
    status: pending
  - id: jml
    content: Write and adopt the joiner, mover and leaver checklists
    status: pending
  - id: hr-hiring
    content: Choose an HRMS and payroll tool, a background-verification vendor and the hiring channels; start police verification for all staff
    status: pending
  - id: compliance
    content: Keep the compliance calendar below with an owner per item; review it monthly
    status: pending
isProject: false
---

# 23 · Microsoft 365, subscriptions, security, onboarding, HR, compliance and hiring

## Why Microsoft 365, and what it replaces

ULL needs one staff identity that controls everything: mail, files, Teams, laptops and phones, and sign-in to the ULL admin portal. Microsoft 365 gives that through **Entra ID**, with Intune for device management and Defender for security. Plan 09 (staff sign-in with Entra ID) waits for this tenant.

Today staff mail runs on Gmail for ullindia.com (MX records kept when DNS moved to Route 53 on 28 Oct).

### Mail decision (before 14 Dec)

| Option | Pros | Cons |
|---|---|---|
| **A. Move mail to Exchange Online (recommended)** | One identity and one password per person; leavers lose everything in one click; Teams, Outlook and the portal share groups | One-off migration of mailboxes and calendars; MX/SPF/DKIM changes |
| B. Keep Gmail, use Microsoft 365 only for Entra ID, Teams and devices | No mail migration | Two accounts per person; offboarding in two places; double cost if both are paid |

If A: keep **one Google account** for the services that need it (Google Cloud, GA4, Google Ads, YouTube, Business Profile; see the setup guide, items 4, 5, 10, 11). Use Google Cloud Identity Free or one Workspace seat for `it@ullindia.com`, so those properties stay company-owned. The dev team changes MX, SPF (include both Microsoft and Amazon SES) and DKIM in Route 53 on cut-over night.

## Licences

Schools qualify for **Microsoft 365 Education** after Microsoft verifies the organisation (academic eligibility). Get quotes from a Microsoft education CSP partner; prices change, so they are not listed here.

| Staff type | Suggested licence | Why |
|---|---|---|
| Group leadership, finance, HR, IT, admissions, counsellors (handle personal data and money) | **A3** (or A5 for IT admins) | Full desktop Office, Intune, Entra ID P1 (Conditional Access); A5 adds Entra ID P2 and Defender for higher-risk admins |
| Teachers | **A1** (free, web and mobile apps) or A3 for those with school laptops | Teams, mail, OneDrive; A3 where the school manages the device |
| Front desk, transport, support staff | A1 or **F-type frontline** licence | Shared or kiosk devices, visitor desk tablets (plan 06) |
| Students | A1 (free), later | Only if students get school accounts (plan 09 open question); not needed for the parent and student portal, which uses phone OTP |

If academic verification is refused for the entity, the fallback is **Microsoft 365 Business Premium** (up to 300 users) for staff who handle data and **Business Basic** for the rest.

## Tenant setup and security baseline

1. Tenant name `ullindia` (admin domain `ullindia.onmicrosoft.com`); add and verify `ullindia.com` (TXT record via the dev team).
2. **Admin roles:** two Global Administrators only (IT admin + one director), both with separate admin accounts (`admin-<name>@`), not their daily mailbox; everyone else gets the least role they need (User, Exchange, Teams, Intune admin).
3. **Break-glass account:** one cloud-only Global Admin with a long password in the vault and excluded from Conditional Access, alerting on every use.
4. **MFA for everyone** with Microsoft Authenticator; block legacy authentication; Conditional Access: require MFA, require a compliant device for admins and for anyone opening finance or HR data, block sign-ins from outside India except for named travellers.
5. **Devices (Intune):** enrol school laptops and staff phones that hold school mail; disk encryption, screen lock, OS updates, remote wipe.
6. **Email security:** Defender for Office 365 safe links and attachments (A3/A5), external-sender banner, DMARC moved from `p=none` to `quarantine` and then `reject` once reports are clean.
7. **Audit and retention:** unified audit log on; retention for mail and Teams per the HR and legal policy; a third-party Microsoft 365 backup for mailboxes, OneDrive and SharePoint.
8. **Sharing:** SharePoint and OneDrive external sharing limited to "specific people"; no "anyone with the link" for folders containing student data.
9. **Quarterly access review:** admin roles, group membership, guest accounts and vendor accounts (see register).

## Groups (drive access everywhere)

Security groups, named `ULL-<Scope>-<Role>`, for example `ULL-Group-Admin`, `ULL-Auremont-Nagarbhavi-SchoolAdmin`, `ULL-Auremont-Nagarbhavi-Counsellor`, `ULL-Auremont-Nagarbhavi-FrontDesk`, `ULL-Auremont-Nagarbhavi-Teacher`. The same groups:
- grant access to the ULL admin portal and its campus scoping (plan 09 maps group claims to roles and campuses);
- own Teams teams and SharePoint sites per campus and department;
- target Intune policies and licences (group-based licensing).

## Subscription register

One sheet (SharePoint list once Microsoft 365 is live), one row per paid or business-critical service. Columns: service, purpose, owner, plan or tier, users or volume, monthly and annual cost, billing entity and GSTIN on invoice, renewal date, admins (at least two), login method (Entra SSO where offered), data held (personal data yes/no), DPA signed (yes/no), linked plan.

| Category | Service (choose where several) | Purpose | Linked plan |
|---|---|---|---|
| Identity and productivity | Microsoft 365 Education | Staff identity, mail, Teams, devices | 09, 23 |
| Identity | Google Cloud Identity Free or one Workspace seat | Owns Google Cloud, GA4, Ads, YouTube, Business Profile | Setup guide 4, 5, 10, 11 |
| Security | Password manager: Bitwarden Teams or 1Password Business | Shared credentials, vendor tokens | All |
| Security | Microsoft 365 backup (third party) | Mailbox and file backup | 23 |
| Infrastructure | AWS (ap-south-1) | Website, CMS, CDN, SES email, backups | 02, 13 |
| Infrastructure | Domain registrar | ullindia.com renewal (auto-renew on, locked) | 02 |
| Messaging | WATI (WhatsApp), Gupshup (SMS), TRAI DLT | Family and staff messages | Setup guide 7, 8 |
| Voice | Telephony partner (Exotel, Ozonetel, Knowlarity or Plivo) + Sarvam AI | Calls and AI voice agents | 22 |
| Payments | Razorpay | Fees and paid assessments (per-transaction fee) | 03, 20 |
| CRM | Zoho CRM or Orggen | External CRM sync | 19 |
| Assessments | Assessment platform vendor | Student tests and reports | 20 |
| Marketing | Meta Ads, Google Ads (spend); Canva for Teams (design) | Campaigns and creatives | 04 |
| AI | Anthropic Claude API (OpenAI optional) | CMS writing help, call and meeting analysis | 07, 21 |
| Data enrichment | Apollo.io | Deferred (not a priority) | 06 |
| School operations | School ERP or LMS (attendance, marks, timetable) | Student dashboard data | 10 |
| Devices | Audio recorders (trial) | Counselling session recordings | 21 |
| HR | HRMS and payroll: Keka, greytHR or Zoho People + Payroll | Staff records, leave, payroll, PF/ESI filings | 23 |
| HR | Background-verification vendor | Identity, education, employment and police checks | 23 |
| Hiring | LinkedIn Jobs, Naukri, Indeed; the ULL careers page | Recruitment | 23, 16 |
| Legal | e-sign: Leegality, Zoho Sign or DocuSign | Offer letters, vendor contracts, admission forms | 23 |

Rules: no service is bought on a personal card; every service gets a company owner and a second admin; anything holding personal data needs a data processing agreement (DPDP Act) before use.

## Joiner, mover, leaver

### Joiner (before day 1)
1. HR creates the employee in the HRMS (offer accepted, background check started).
2. IT creates the Microsoft 365 account, assigns the licence and the role/campus groups, and issues the device enrolled in Intune.
3. Day 1: MFA set up in person, password manager invite, portal access appears automatically through groups (plan 09), Teams channels.
4. Training in week 1: data protection (DPDP), child safeguarding and POCSO, phishing awareness, the admissions CRM for admissions staff.
5. Signed: appointment letter, code of conduct, confidentiality and acceptable-use policy, child safeguarding declaration.

### Mover
Change the role or campus in the HRMS, then IT changes groups (never adds without removing the old ones). Access to the old campus's leads stops automatically.

### Leaver (same day)
1. Disable the Microsoft 365 account and revoke sessions; remove from all groups.
2. Convert the mailbox to shared or forward to the manager; transfer OneDrive files.
3. Remove from vendor admin roles in the register (Meta, Google, WATI, Razorpay, AWS); rotate any shared credential they could see.
4. Wipe or collect devices; disable door and ID access.
5. HR closes the record (full and final settlement, PF transfer, experience letter).

## HR and hiring

| Area | Decision or action | Owner |
|---|---|---|
| HRMS and payroll | Pick one tool (Keka, greytHR or Zoho People) covering records, leave, attendance, payroll, PF/ESI/PT returns, payslips | HR + finance |
| Background checks | Identity, address, education, previous employment and **police verification for every staff member who works with children**, as required by CBSE safety guidelines and child-protection law; renew on the school's schedule | HR |
| Hiring pipeline | Roles approved against a headcount plan; adverts on the ULL careers page, LinkedIn and Naukri; structured interviews with a scoring sheet; demo lesson for teachers; references | HR + principal |
| Offer and onboarding | E-signed offer and appointment letters; joiner checklist above | HR + IT |
| Policies | Leave, attendance, code of conduct, POSH (anti-sexual-harassment), child safeguarding, acceptable use, social media, data protection | HR + legal |

## Compliance calendar

Confirm each item and its frequency with legal and the CA; owners are suggestions.

| Item | What | Frequency | Owner |
|---|---|---|---|
| DPDP Act | Privacy notice, consent records, Grievance Officer, breach response, children's data with verifiable parental consent, vendor DPAs | Ongoing; review yearly | Legal + IT |
| Data breach | Report to the Data Protection Board and to affected people as the DPDP Rules require; incident runbook in `deploy/RUNBOOK.md` (plan 02) | On incident | IT + legal |
| CBSE mandatory public disclosure | Appendix-IX data and documents on the website | Each academic year and on change | Principal |
| Child safeguarding / POCSO | Policy, designated person, staff training, police verification | Yearly + on joining | Principal + HR |
| POSH | Internal Committee constituted, annual report filed | Yearly | HR |
| Labour | PF, ESI, professional tax, shops and establishments or applicable registration, minimum wages | Monthly returns, yearly renewals | Finance + HR |
| GST and TDS | Returns for taxable services (plan 03) | Monthly / quarterly | Finance |
| Safety certificates | Fire, building safety, water and sanitation, transport fitness | As certificates expire | Campus head |
| TRAI DLT | Templates and headers current; consent records | On change | IT |
| Access review | Admin roles, groups, vendor accounts, leavers | Quarterly | IT |

## Timeline

| Week | Work |
|---|---|
| 2 Nov | Academic eligibility application; quotes from two education CSP partners; mail decision |
| 9 Nov | Buy licences; tenant, domain verification, admin roles, break-glass, MFA |
| 16 Nov | Conditional Access, Intune enrolment for leadership and admissions devices, groups; Entra app for the portal (plan 09 resumes) |
| 23 Nov | Password manager rollout; subscription register filled; joiner/leaver checklists adopted |
| 30 Nov – 11 Dec | Mail migration (if option A) on a weekend; DMARC monitoring; staff training |
| Jan | HRMS and background-verification vendor live; compliance calendar reviewed monthly |

## Open questions

1. Which legal entity holds the Microsoft 365 tenant and the licences (plan 03 entity map)?
2. How many staff in each type above, across the group and Nagarbhavi?
3. Mail: option A (Exchange Online) or B (stay on Gmail)?
4. Will students get school Microsoft accounts, or only portal logins?
5. Who is the tenant's second Global Administrator?
