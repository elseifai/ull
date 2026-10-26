---
name: 03 GST, company profile and payment details
overview: Collect the legal entity details for ULL India and each school, show them correctly on the website and invoices, set up a payment gateway for fees and paid services, and make sure AWS and other vendors bill the right GSTIN. 26 Oct – 20 Nov 2026.
todos:
  - id: entity-map
    content: Confirm which legal entity (company or trust/society) runs ULL India, ULL Auremont and ULL Global, with CIN/registration, PAN, GSTIN and registered address
    status: pending
  - id: ca-review
    content: Ask the CA which ULL services are GST-exempt (school tuition) and which are taxable (psychometric tests, events, merchandise, third-party services)
    status: pending
  - id: cms-global
    content: Add a Legal Entities collection in Payload and show the right entity in each school's footer, contact page and invoices
    status: pending
  - id: legal-pages
    content: Publish Privacy Policy (DPDP Act aligned), Terms, Refund & Cancellation, Fee Policy and Grievance Officer pages
    status: pending
  - id: gateway
    content: Choose a payment gateway (Razorpay recommended), submit KYC, connect settlement bank accounts per entity
    status: pending
  - id: vendor-gstin
    content: Add the GSTIN to AWS, Google, Meta, Zoho, Sarvam and other vendor billing so input tax credit can be claimed
    status: pending
isProject: false
---

# 03 · GST, company profile and payment details

> Not tax or legal advice. Every GST rate and exemption below must be confirmed by ULL's CA before it goes into invoices.

## 1. Company profile to collect

One row per legal entity. Schools in India are often run by a trust or society, while marketing, tech or test services may sit in a private limited company.

| Field | ULL India (group) | ULL Auremont School | ULL Global |
|---|---|---|---|
| Legal name | | | |
| Type (Pvt Ltd / Trust / Society / LLP) | | | |
| CIN or registration number | | | |
| PAN | | | |
| GSTIN (if registered) | | | |
| Registered address with PIN | | | |
| Campus address (if different) | | Nagarbhavi, Bengaluru 5600xx | not yet |
| Board affiliation number | – | CBSE affiliation no. (or "applied for") | IB school code (or "candidate / interested") |
| UDISE+ code | – | | |
| Authorised signatory | | | |
| Grievance officer (DPDP) name, email | | | |
| Bank account for settlement | | | |

**Where it goes in the product**

- New Payload collection `legalEntities` (admin only) and a `legalEntity` relation on each School (plan 05).
- Website footer per school: legal name, address, affiliation number, "CBSE Affiliation No. xxxx". CBSE requires schools to publish mandatory public disclosure details on their site; add a `/auremont/mandatory-disclosure` page (plan 16).
- Invoices and receipts (fees, test reports) print the entity, GSTIN and address.
- Structured data: `School` JSON-LD gets `legalName`, `address`, `telephone`, `identifier` (affiliation).

## 2. GST questions for the CA

| Item | Likely treatment to confirm |
|---|---|
| School tuition, admission fee, exam fee (pre-school to higher secondary) | Exempt as services by an educational institution to its students |
| Transport, mid-day meals, security, housekeeping bought **by** the school | Vendor-side exemptions may apply up to higher secondary |
| Psychometric tests / career counselling sold to outsiders (plan 20) | Likely taxable (commonly 18%); check if sold by the school or a separate entity |
| Summer camps, events open to the public, merchandise, uniforms, books | Check each; uniforms/books have their own rates |
| Registration / application fee | Check whether it counts as admission-related |
| Advertising, SaaS and AWS bills received by ULL | Taxable; claim input credit only where the receiving entity makes taxable supplies |

Output: a one-page "tax matrix" from the CA, which the payment module uses to decide whether to add GST to a line item.

## 3. Payment gateway

**Recommended: Razorpay** (wide use in Indian schools, UPI/cards/net-banking/EMI, Payment Links, Smart Collect virtual accounts, subscriptions, good webhooks). Alternatives: PayU, Cashfree, CCAvenue. Pick one; keep the code behind a `payments` adapter like `cms/src/lib/notify.ts`.

| Use case | When | Gateway feature |
|---|---|---|
| Registration / application fee (currently not charged) | Optional for 2027-28 | Checkout on the portal |
| Admission confirmation deposit | P2 | Payment Link sent from CRM |
| Term fees with reminders (voice agent, plan 22) | P3 | Payment Links / UPI AutoPay |
| Paid psychometric tests (plan 20) | P2 | Handled by aptitudetest.in or ULL's gateway (decide) |

KYC documents usually needed: entity PAN, registration certificate/trust deed, GST certificate (if any), cancelled cheque, authorised signatory ID, website with legal pages live. The **legal pages must be live before KYC is approved**, so they are part of the website launch.

Payment data in our database: order id, amount, status, gateway reference, receipt number. Never card or UPI details. Webhooks at `/api/hooks/payments` with signature verification.

## 4. Legal pages (website)

- Privacy Policy aligned to the Digital Personal Data Protection Act 2023 and its Rules: what we collect (enquiries, visitor registration, call recordings, LinkedIn/Apollo enrichment, children's data), purpose, retention, rights, grievance officer, consent withdrawal.
- **Children's data:** the dashboards (plans 10, 11) process data of students under 18. This needs verifiable parental consent and no tracking or targeted ads aimed at children.
- Terms of Use, Refund & Cancellation, Fee Policy, Cookie Policy (consent banner, plan 07).
- Each page is a CMS page so legal can update it without a deploy.

## 5. Vendor billing with GSTIN

| Vendor | Action |
|---|---|
| AWS (bills through Amazon Web Services India Pvt Ltd) | Add GSTIN and legal address in Billing → Tax settings |
| Google Workspace / Ads, Meta Ads | Add GSTIN in billing profile |
| Zoho / Orggen, WATI, Gupshup, Sarvam, Apollo | Ask for GST invoices to the right entity |

## Acceptance

- Entity table filled and signed off by finance.
- Footer and contact pages show correct legal details for each school.
- Legal pages live on prod.
- Gateway account approved with test-mode payments working in UAT.
- CA's tax matrix stored in the project drive and linked here.

## Open questions

1. Which entity collects school fees today, and through which bank or gateway?
2. Does ULL want online fee collection in 2027-28, or only lead capture this season?
3. Is a registration fee planned for 2027-28 admissions?
