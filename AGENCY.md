# AGENCY — Master Reference

**Owner:** Dakotah Jennifer, DakJen Creative LLC
**Repo:** github.com/Badjr-Tech/invoicing
**Status:** Pre-launch. Zero registered businesses. Every decision can still be made correctly the first time.

> Working copy: **`~/agency-work`** — not the Desktop folder. See [Known environment issue](#known-environment-issue).

---

## 1. What AGENCY is

A small-business incubator delivered as software. Members register their business, take classes, run their books, invoice their clients, and get paid — all in one place. AGENCY earns a percentage of what flows through it.

Conventional software charges the same whether the member made ten thousand dollars or nothing. **AGENCY earns when they earn.**

### The differentiator

Most SMB tools are neutral containers. AGENCY is opinionated: the DJC Studio methodology is encoded as features, not help articles.

| DJC framework | Feature in AGENCY |
|---|---|
| Six-Month Audit | Onboarding meeting diagnostic |
| Bird's Eye View | Home dashboard: three numbers |
| Anchor Client Method | Revenue concentration widget |
| Bad Month Protocol | Triggered playbook on revenue decline |
| 20% buffer salary rule | Owner pay calculator |
| The five monthly numbers | Monthly review screen |
| Scope of Work 101 | SOW generator with mandatory hours cap |
| Pricing progression | Rate review prompts at renewal |

A competitor can build invoicing. A competitor cannot build the Bad Month Protocol, because it is a point of view about how a business should behave.

---

## 2. Revenue model

### Bands — flat, not marginal

The member's entire trailing-twelve-month revenue bills at the single rate their total lands in.

| Trailing 12-month revenue | Platform fee |
|---|---|
| $0 – $100,000 | 7% |
| $100,000 – $500,000 | 5% |
| Above $500,000 | 3% |

Bands are automatic. No member chooses one.

### The boundary floor

Flat bands create a cliff: a member at $100K pays $7,000, but at $120K would pay $6,000. Their revenue grew and AGENCY's income fell.

**Rule: never charge less than the previous band's ceiling.**

```
fee = max(band_rate × revenue, previous_band_ceiling)

previous_band_ceiling =
  $0       band 1
  $7,000   band 2   (7% × $100,000)
  $25,000  band 3   (5% × $500,000)
```

The member's fee plateaus at each boundary instead of dropping. **The pricing page still says 7 / 5 / 3. The member never sees this rule and never receives a bill that went down.**

### Payment method

| Method | Member pays | Who absorbs processing |
|---|---|---|
| ACH | Band rate only | AGENCY, fully |
| Card | Band rate + 1.5% | AGENCY pays Stripe, member contributes 1.5% |

At the entry band: **7% ACH, 8.5% card.** Card is **off by default** — a member must deliberately enable it and confirm the rate change.

ACH is better for both parties at every level: cheaper for the member, higher net for AGENCY.

### Managed engagement tier *(Dakotah's addition — not in the original spec)*

When a member's business advances past a threshold, AGENCY offers **a formal agreement to manage them more directly** — not just serve them through the app. The platform fee prices software plus access; a grown member needs hands-on management, which is a different service at a different price.

Open: threshold, pricing model (retainer vs. higher band vs. equity), whether it replaces or stacks on the band.

---

## 3. Member experience

### Access model

- **7 days of full access** from signup. Every tool, no card required.
- **After 7 days, tools lock** until onboarding is complete.
- Onboarding = business registered + Stripe connected + onboarding meeting booked.
- Admins can grant a per-account exemption (`gateExemptUntil`).

### Onboarding walkthrough

Six steps, click-through:

1. **A business incubator, built into software** — what AGENCY is
2. **We earn when you earn. Not before** — the 7/5/3 model, stated plainly
3. **Your client pays you. We take our share at the source** — how money moves
4. **Three numbers, every time you log in** — the Bird's Eye View
5. **The tools, and who they are for** — what's included
6. **Two things, and you are running** — what's required next

### Dashboard — the Bird's Eye View

Three numbers, large, above the fold:

1. What you need to get paid
2. What your expenses actually are
3. What is available for growth

Below: the five monthly numbers, and a revenue concentration widget flagging any client above 50% of trailing revenue.

---

## 4. Money architecture

- **Express connected accounts.** Stripe handles KYC and compliance.
- **`controller.fees.payer = 'application'`** — set at creation, **not changeable afterward**. The whole fee model depends on it.
- **Direct charges** with `application_fee_amount`. The member business is merchant of record; dispute liability sits with them, not AGENCY.
- Store the account ID **immediately on creation**, before onboarding completes, so an abandoned flow resumes rather than orphans.
- A business cannot send an invoice until `stripe_charges_enabled = true`.
- **AGENCY never holds, pools, or disburses member funds.** Departing from this triggers money transmitter licensing in most states — a fifty-state problem and effectively a different company.

### Bookkeeping rules

- **Single-entry with typed transactions.** No journal entries, no debits/credits, no balance sheet.
- **Stripe payouts must classify as `transfer`, never `income`** — otherwise the same $500 is counted twice and the tax estimate is wrong.
- **Record gross, never net.** Stripe's 1099-K reports gross volume. Books showing net would not tie to the form the member receives in January.
- Transfers carry no category and never appear in the P&L.

What one $500 ACH payment generates automatically:

| Type | Amount | Category |
|---|---|---|
| income | $500.00 | *member picks* |
| expense | $35.00 | Professional Fees (AGENCY) |
| transfer (on payout) | $465.00 | — |

---

## 5. What has been built

All of the following is committed and pushed (`c550b7f`), builds clean, 37 tests passing.

### Security — 8 holes closed

| Issue | Was | Now |
|---|---|---|
| Six API routes | Hardcoded `userId = 1`, auth commented out | Real session user, ownership verified before every write |
| Two upload routes | No auth, any filename, public storage | Auth required, extension allowlist, size cap, server-generated keys |
| Admin section | Gated only by hiding a sidebar link | Enforced in middleware + server-side role checks |
| Session token | Contained the bcrypt **password hash** | Password and volatile fields excluded |
| `encrypt()` | Exported from `"use server"` — a public token-forgery endpoint | Removed from the action surface |
| `getAllUsers()` | Returned **every user's password hash** to any signed-in member | Role-checked, explicit column list |
| Budget upload | Path traversal via filename | `basename` + allowlist + generated name |
| Session cookie | No `secure`, no `sameSite`; expiry threw a 500 | Both set; expired sessions redirect |

### Features

- **Trial + gate** — 7 days, then locked until onboarded
- **Onboarding** — 6-step walkthrough, hub, payments step, meeting step
- **Dashboard** — rebuilt as the Bird's Eye View on real invoice/transaction data
- **Fee module** — bands, boundary floor, ACH vs card, integer cents, 37 tests
- **Password reset** — *was a stub that logged to console and told users an email was sent.* Now real: hashed tokens, 1hr expiry, single use, no account enumeration
- **Email on Brevo** — branded HTML per business palette, per-send sender name, reply-to the member
- **Contracts** — *were sent to a fake Ethereal test inbox; no client ever received one.* Now real Brevo delivery with attachments

### Design

Sage / ember / clay system drawn from the logo. Applied to login, signup, dashboard, sidebar, onboarding, password reset. Legacy color names remapped so untouched screens re-theme without edits.

Also fixed: a Tailwind v4 `@theme` block that was dead in a v3 pipeline, and a global `button` rule that overrode every utility class.

---

## 6. What is next

In dependency order. **Hard gate: no live charges until 2, 3, and 4 have passing tests.**

1. **Stripe Connect onboarding** — flow is built and gated; needs a `sk_test_` key
2. **Webhook subsystem** — persist every event before processing, keyed on Stripe's event ID; handle duplicates and out-of-order delivery
3. **Automatic bookkeeping rows** — payment → income + fee; payout → transfer
4. **ACH return handling** — reverse income row, fee row, and fee record together
5. **Card toggle** — with the rate-change confirmation
6. **Payout detail view** — show what the member invoiced vs. what landed
7. **Admin revenue dashboard, request queue, resource library**
8. **Onboarding meeting diagnostic** — structured fields, not freeform notes
9. **Service funnel** — visibility rules driven by real Stripe revenue
10. **Managed engagement tier**

---

## 7. Open decisions

| # | Decision | Blocks |
|---|---|---|
| 1 | Boundary floor: annual effective rate, or per-transaction | Implemented as annual effective rate — confirm |
| 2 | Monthly minimum: amount and grace period | Launch pricing |
| 3 | Referral fee: percentage and duration | Contract, launch |
| 4 | Revenue threshold unlocking meeting booking | Meeting build |
| 5 | Service-readiness thresholds per DJC service | Funnel build |
| 6 | Confirm 1099-K filing sits with the member, not AGENCY | Before first January — **ask an accountant** |
| 7 | Terms language on data visibility | Launch |
| 8 | Managed engagement: threshold, pricing, stacking | That tier |

---

## 8. Environment

### Required variables

```
DATABASE_URL=            # Neon
JWT_SECRET=              # session signing
BREVO_API_KEY=           # transactional email
BREVO_FROM_EMAIL=        # verified sender
BREVO_FROM_NAME=AGENCY
STRIPE_SECRET_KEY=       # sk_test_ until the webhook + bookkeeping tests pass
NEXT_PUBLIC_APP_URL=
BLOB_READ_WRITE_TOKEN=   # Vercel Blob
```

### Commands

```bash
npm run dev      # dev server
npm run build    # production build
npx vitest run   # tests
npx tsc --noEmit # typecheck
```

### Known environment issue

The original folder at `~/Desktop/Randomprojects/Badjr/AGENCY` is inside **iCloud Drive**. 71 source files became cloud-only placeholders that cannot be read, which makes `git status`, `git commit`, and builds hang indefinitely — load average reached 291. Apple removed `brctl download` in Sonoma 14+, so there is no supported way to force materialization.

**Do not work in the Desktop copy.** Use `~/agency-work`. Never put a project with `node_modules` in an iCloud-synced folder.

### Caveats

- `next.config.js` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`. **A green build does not mean the types are sound.** Run `tsc` separately.
- 118 pre-existing type errors remain, nearly all `useFormState` misuse in admin pages. None are in files touched by this work.
- **Nothing has been verified in a browser.** It compiles and the logic is tested, but no one has clicked through the onboarding flow.
- The live Stripe key that was briefly placed in `.env.local` **should be rotated.**

---

*Last updated: August 2026*
