# Ambak — User Feedback & Review Research (Worldwide Scan)

**Prepared:** 2026-09-13
**Subject:** Ambak (home-loan marketplace) — operated by **TENB Fintech Pvt Ltd**, Gurugram, India
**Purpose:** Scan Google Play, Apple App Store, and other public review venues **worldwide** for real user feedback on Ambak, classified by geography, as competitive/market context for DhanIQ.

---

## TL;DR

- **Geographic scope: Ambak is India-only.** A worldwide scan found **no presence, availability, or reviews outside India.** Ambak Saathi returns **HTTP 404 in the US App Store** (lives only in the India store); no listings in US/UK/Singapore/UAE or on international review platforms. The only non-India "Ambak" on app stores is an **unrelated game** (name collision — see below).
- **Ambak has almost no consumer app-store footprint even in India.** It is a **website-led** business. Its mobile apps (**Ambak Saathi**, **Ambak Yoddha**) are **partner/agent-facing (B2B2C)**, not consumer apps — so app-store reviews reflect DSAs/brokers, not home-loan borrowers.
- The richest *consumer* feedback found is a **JustDial listing (Gurgaon): 4.4/5 from 61 reviews** — mostly positive on process and staff, with a recurring complaint about **persistent sales calls**.
- **Apple App Store (India) — Ambak Saathi: 4.5/5 from just 8 ratings.** Very low volume; no written reviews shown.
- **Google Play (India) — now scraped** (via `research/scrape/`): **Ambak Saathi 4.68/5, 62 ratings, 24 reviews, 10,000+ installs**; **Ambak Yoddha 5/5, 15 ratings, 1 review, 1,000+ installs**. Reviews are short and mostly 5★ from partners; one 4★ flags an **"insecure" warning before installation**, and the one Yoddha review is a **feature request** (add banker contact/policy in-app).
- **No Trustpilot page** exists for ambak.com (404). **Employee-review sites (Glassdoor/AmbitionBox/Indeed)** block automated fetching and did not surface Ambak-specific ratings in search.
- Notable tension: Ambak markets **"no pushy calls, no sales pressure"** on its site, yet runs a **telesales operation** (active Naukri job listing) and draws a **"persistent calls"** complaint on JustDial.

> Honesty note: I could not run a bulk scraper against the app stores. Every figure below is attributed to the source it came from and dated. Where a source was blocked or a figure was unavailable, that is stated explicitly. Nothing here is invented.

---

## Geographic scope & classification

**Bottom line: all genuine Ambak feedback is Indian.** There is no worldwide review base to classify because Ambak does not operate outside India. The classification below therefore runs **Region → Market → Platform → Audience**, and records the worldwide venues checked that returned nothing.

### By region

| Region / Country | Ambak presence? | Reviews found | Evidence |
|---|---|---|---|
| **India** | ✅ Full operations (Gurgaon HQ, 8+ cities) | ✅ Yes (see below) | ambak.com, JustDial, India App Store |
| United States | ❌ None | — | Ambak Saathi **404 in US App Store** |
| UK / Europe | ❌ None | — | No listings or reviews found |
| Singapore / SE Asia | ❌ None | — | No listings or reviews found |
| UAE / Middle East | ❌ None | — | No listings or reviews found |
| Rest of world | ❌ None | — | No listings or reviews found |

### India feedback, classified by platform × audience

| Platform | Market | Audience | Rating | # reviews | Review text |
|---|---|---|---|---|---|
| JustDial (Gurgaon listing) | India | **Consumer** (borrowers) | **4.4/5** | **61** | Themes only (403 on raw text) |
| Apple App Store — Ambak Saathi | India | **Partner** (DSA/agent) | **4.5/5** | **8** | None on listing |
| Google Play — Ambak Saathi | India | **Partner** (DSA/agent) | **4.68/5** | **62 ratings / 24 reviews** | ✅ Scraped (10,000+ installs) |
| Google Play — Ambak Yoddha | India | **Partner/internal** | **5.0/5** | **15 ratings / 1 review** | ✅ Scraped (1,000+ installs) |
| Trustpilot (ambak.com) | Global | Consumer | — | — | No page (404) |
| Glassdoor / AmbitionBox / Indeed | India | **Employee** | — | — | Blocked / not found |

### Name-collision note (worldwide "Ambak" that is NOT this company)
- **"Ambak" by TreberTGames** — a mobile **game** on Google Play (US). Unrelated to the fintech.
- Generic look-alikes that polluted searches: **Ambac** (US bond insurer), **Ambank** (Malaysian bank), **Ambab**. None are the home-loan marketplace. Any review of those is **out of scope** and excluded here.

---

## Company snapshot (context)

| Item | Detail | Source |
|---|---|---|
| Legal entity | TENB Fintech Pvt Ltd | Tracxn |
| Founded | Jan 2024 (some sources say 2023) | Entrepreneur / Tracxn |
| Model | Home-loan & LAP marketplace; matches borrowers to 50–70+ lenders via a "Bank Rule Engine" | ambak.com / Inc42 |
| Founders | Ex-Policybazaar, Paisabazaar, Freecharge, CarDekho | Entrepreneur |
| Funding | ~$18.1M total (Seed + Pre-Series A/Series A); Peak XV (Surge), Z47, Advantedge, DeVC | Entrepreneur / Tracxn |
| Headcount | ~529 employees (as of May 2026) | Tracxn |
| Location | Rider House, Sector 44, Gurgaon | JustDial |
| Claimed traction | 15,000+ home buyers, 3,000+ intermediaries, 50+ lenders | Entrepreneur |

---

## Source-by-source findings

### 1. JustDial — Ambak Home Loan, Gurgaon (consumer)
- **Rating: 4.4 / 5 from 61 reviews** (strongest consumer signal found).
- **Positives (paraphrased themes):** smooth/good loan process; supportive and hardworking staff; positive comments on company culture and sales incentives.
- **Negative:** at least one user frustrated by **persistent calls despite indicating disinterest**.
- Raw individual review text could not be pulled — JustDial returns HTTP 403 to automated fetching. Themes above are from search-result summaries.

### 2. Apple App Store (India) — "Ambak Saathi" (partner app)
- **Rating: 4.5 / 5 from 8 ratings.** Category: Finance. Developer: TENB Fintech Pvt Ltd.
- Last updated **Sep 4, 2024 (v2.4.8)**.
- **No individual written reviews** displayed on the listing.
- Very low ratings volume → not statistically meaningful; audience is partners/DSAs, not borrowers.
- No separate consumer-facing "Ambak" iOS app was found.

### 3. Google Play Store — "Ambak Saathi" & "Ambak Yoddha" (partner apps) — SCRAPED 2026-09-13
Pulled programmatically with `research/scrape/` (google-play-scraper, country = IN). Raw data saved to `research/ambak-play-data.json`.

**Ambak Saathi** (`com.ambak.saathi`) — for DSAs, property dealers, builders, financial advisors to source/manage/process leads.
- **Rating: 4.68 / 5 · 62 ratings · 24 written reviews · 10,000+ installs** · last updated 2026-09-04 · developer "Ambak".
- Reviews are short and overwhelmingly 5★ partner praise ("smooth app transition", "better than other portal", "great service"). Representative sample:
  - ★5 (2026-09-09) Ganesh Negi — "smooth aap transition"
  - ★5 (2024-12-05) Dinesh Kumar — "Better than other portel"
  - **★4 (2026-02-03) santosh kumar dubey — "average, before installation it show insecure"** ← minor trust/security-warning signal
- Takeaway: partners are broadly happy with the tool; volume is modest (10k installs) and feedback is thin/low-detail.

**Ambak Yoddha** (`com.ambak.yoddha`) — for partners/internal team to manage cases, get bank rate confirmations, track stats.
- **Rating: 5.0 / 5 · 15 ratings · 1 written review · 1,000+ installs** · last updated 2026-09-04 · developer "Ambak".
- The single review is a **feature request**: ★5 (2024-09-17) — "If the banker's number and banker's policy are available in this application, it would be even better."
- Takeaway: tiny user base (internal/close-partner tool); rating is not statistically meaningful at 15 ratings.

### 4. Trustpilot
- **No page exists for ambak.com (HTTP 404)** → no Trustpilot reviews to report.

### 5. Employee-review sites (Glassdoor / AmbitionBox / Indeed)
- **Not obtainable.** These sites block automated fetching (403), and searches for "Ambak"/"TENB Fintech" reviews kept returning unrelated look-alikes (Ambac, Ambank, AmbitionBox-the-company, generic "Fintech").
- Corroborating signal that a sales/telesales culture exists: an active **Naukri listing — "Telesales || Home Loan || AMBAK || Sec-44 Gurgaon" (TENB Fintech)**. This is consistent with the JustDial "persistent calls" complaint.

### 6. Ambak's own positioning (for contrast)
- ambak.com markets **"No sales pressure, just straight answers"** and **"No pushy calls."**
- This sits in tension with (a) the telesales hiring and (b) the JustDial calls complaint — a gap worth watching if benchmarking trust/UX.

---

## Coverage map (what we got vs. couldn't)

| Venue | Audience | Rating | # reviews | Review text | Status |
|---|---|---|---|---|---|
| JustDial (Gurgaon) | Consumer | **4.4/5** | **61** | Themes only | ✅ Partial (403 on raw text) |
| Apple App Store — Saathi | Partners | **4.5/5** | **8** | None on listing | ✅ Got numbers |
| Google Play — Saathi | Partners | **4.68/5** | **62 (24 text)** | ✅ Yes | ✅ Scraped |
| Google Play — Yoddha | Partners | **5.0/5** | **15 (1 text)** | ✅ Yes | ✅ Scraped |
| Trustpilot | Consumer | — | — | — | ⛔ No page (404) |
| Glassdoor | Employees | — | — | — | ❌ Blocked / not found |
| AmbitionBox | Employees | — | — | — | ❌ Blocked (403) |
| Indeed | Employees | — | — | — | ❌ Not found |

---

## What the feedback says (synthesis of available signal)

**Positives**
- Consumers report a **smooth, well-supported loan process** and **helpful staff** (JustDial).
- Partner-app ratings, though tiny in volume, are **high (4.5)** — suggests the DSA/agent tooling is at least acceptable to its users.

**Negatives / risks**
- **Aggressive outbound calling** is the one repeated consumer gripe, and it is structurally supported (telesales hiring). For a trust-sensitive finance brand, this is the clearest reputational risk.
- **Thin, young review base overall** — the company is ~1.5 years old, website-led, so there is little durable third-party review history to judge it by. High ratings on tiny samples (8 Apple ratings) should not be over-read.

**Structural observation**
- Ambak's public "review surface" is unusual: **no consumer app**, so no consumer app-store reviews. Feedback lives in **local-listing (JustDial), word-of-mouth, and lender/partner channels** instead. Anyone benchmarking Ambak on app-store sentiment will find almost nothing — that absence is itself the finding.

---

## Implications for DhanIQ (brief)

- **Trust is the wedge.** The one consistent complaint against a well-funded incumbent is *pushy calls*. A finance tool that is genuinely **no-call, on-device, and advice-neutral** (which is DhanIQ/TrueCost's stated posture — "nothing leaves the device," "not financial advice, no recommendations") directly answers that pain.
- **Ambak is a lead-gen marketplace, not a calculator.** It optimises for *matching to a lender* (and then selling). DhanIQ's "which offer is actually cheaper, computed honestly" is a **different, complementary job** — worth positioning against, not copying.
- If DhanIQ ever ships a consumer app, note Ambak's near-zero consumer app-store presence: **there is open space to own consumer app-store sentiment** in this niche.

---

## How to complete this (the gaps)

1. **Play Store numbers — ✅ DONE.** Scraped via `research/scrape/` (`npm install && npm run scrape`). Re-run any time to refresh; raw output in `research/ambak-play-data.json`.
2. **Employee sentiment** — still open. Glassdoor/AmbitionBox/Indeed block automated fetching; open them in a browser and copy the summary rating + a few representative pros/cons. (A scraper here would likely be blocked and may breach their ToS, so manual is safer.)
3. **JustDial raw reviews** — still open (403 on fetch). Open the listing in a browser to read the 61 individual reviews.

### Re-running the Play scraper
```bash
cd research/scrape
npm install      # first time only
npm run scrape   # prints a summary + writes research/ambak-play-data.json
```
Country defaults to `in`; edit `COUNTRY`/`APPS` in `play-reviews.mjs` to change scope.

---

## Sources
- Ambak — About: https://ambak.com/about-us
- Ambak — Home: https://ambak.com/
- Entrepreneur India (USD 7M raise): https://www.entrepreneur.com/en-in/news-and-trends/home-loan-platform-ambak-secures-usd-7-mn-to-scale/486276
- Inc42 (₹80 Cr raise talks): https://inc42.com/buzz/exclusive-home-loan-marketplace-ambak-in-talks-to-raise-%E2%82%B980-cr/
- Tracxn — Ambak profile: https://tracxn.com/d/companies/ambak/__jEkdCYhFJemjwUpObFheTL5gzJjyLEGSGsAtHD27jy4
- Tracxn — TENB Fintech entity: https://tracxn.com/d/legal-entities/india/tenb-fintech-private-limited/__5ByWo5CUsrLHcFN2BYvS9exc3IG9ZU57iUVrdR1b2n8
- JustDial — Ambak Home Loan, Gurgaon (4.4/61): https://www.justdial.com/Gurgaon/Ambak-Home-Loan-Rider-House-Gurgaon-Sector-44/011PXX11-XX11-240326121427-U1R4_BZDET
- Apple App Store — Ambak Saathi (4.5/8): https://apps.apple.com/in/app/ambak-saathi/id6474469003
- Google Play — Ambak Saathi: https://play.google.com/store/apps/details?id=com.ambak.saathi&hl=en_IN
- Google Play — Ambak Yoddha: https://play.google.com/store/apps/details?id=com.ambak.yoddha&hl=en_IN
- Naukri — Telesales/Home Loan/AMBAK (telesales signal): https://www.naukri.com/job-listings-telesales-home-loan-ambak-sec-44-gurgaon-work-from-office-tenb-fintech-gurugram-1-to-5-years-060625012294
