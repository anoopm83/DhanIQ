// Theme analysis — reads the scraped review data, tags each review against a
// keyword lexicon of finance-app themes, and appends a "Theme Analysis" sheet
// to the existing competitor workbook.
//
// Run AFTER compare: `npm run compare && npm run themes`
//
// Method notes (kept honest and visible in the sheet):
//  - Reviews were pulled NEWEST-first, so the SAMPLE skews negative (people
//    review when unhappy). "Overall rating" is the true lifetime average from
//    store metadata; "sample" columns describe only the pulled recent reviews.
//  - Theme tagging is keyword-based and approximate; a review can hit several
//    themes. Treat counts as directional, not exact.

import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "node:fs";

const DATA = JSON.parse(readFileSync(new URL("../ambak-competitor-data.json", import.meta.url)));
const XLSX_PATH = new URL("../ambak-competitor-reviews.xlsx", import.meta.url);

// theme -> keyword list (lowercase substring match)
const THEMES = {
  "App bugs / login": ["login", "log in", "sign up", "signup", "otp", "not open", "does not open", "won't open", "not working", "crash", "error", "technical", "glitch", "hang", "loading", "insecure", "not responding", " bug"],
  "Fast / smooth": ["fast", "quick", "instant", "smooth", "seamless", "hassle", "easy", "prompt", "speedy"],
  "Slow / delays": ["slow", "delay", "waiting", "pending", "dheere", "long time", "takes time", "too long"],
  "Interest / charges": ["interest", " roi", "rate of interest", "charge", " fee", "hidden", "expensive", "costly", "high rate"],
  "Customer service": ["customer care", "service", "support", "staff", "executive", " rm ", "response", "rude", "behaviour", "behavior", "cooperat", "after sales", "helpline"],
  "Spam calls / pressure": ["calls", "calling", "spam", "disturb", "telecaller", "pressure", "repeated call"],
  "Data / trust / fraud": ["data", "privacy", "stealing", "sharing", "fraud", "scam", "cheat", "fake", " loot", "dalal", "misleading", "misinformation", "trust", "frode"],
  "Loan approval / disbursal": ["approv", "sanction", "disburs", "reject", "eligib", "not get loan", "loan nahi"],
  "Paid-service issues": ["paid", "credit report", "credit pro", "credit health", "refund", "charging for", "asking money", "1 1 rps", "waste of"],
  "KYC / onboarding": ["kyc", "document", "verification", "activat", "empanel", "onboard", "registration", "registered"],
  "General praise": ["good", "great", "excellent", "best", "nice", "awesome", "recommend", "thank", "satisfied", "happy", "wonderful", "amazing", "useful", "perfect", "superb", "helpful"],
};

// Analyst summaries — grounded in reading the actual pulled reviews (2026-09-13).
const SUMMARY = {
  "Ambak": "Very thin sample, all positive (partner app): 'smooth', 'better than other portal'. One 4-star flags an 'insecure' warning at install. Too few reviews to judge.",
  "Credit Dharma": "Lowest overall rating in the set. Recent reviews are dominated by app AUTH FAILURES - cannot log in / sign up / app won't open. Product sentiment is masked by a broken first-run experience.",
  "Easiloan": "No adoption on mobile (10+ installs, no ratings/reviews). Nothing to analyse.",
  "Andromeda (OneAndro)": "Agent app, mostly positive, but complaints cluster on KYC/activation taking weeks, a slow-loading app, and unresponsive RMs; a few allege bugs/'not secure'.",
  "Paisabazaar": "Large, mature app (4.58 lifetime). Recent complaints center on PAID services not delivering (Credit Pro / Credit Health Report), data-privacy ('selling my data'), and 'pre-approved then rejected'. Praise is for easy free credit-score checks.",
  "GoCredit": "Overwhelmingly 5-star with short, generic text (possible solicited reviews - read with caution). Rare complaints cite high interest and data concerns.",
  "HomeFirst": "Recent reviews skew angry despite a 4.28 lifetime rating: the loudest themes are HIGH INTEREST RATES and POOR AFTER-SALES / customer care (helpline never connects), plus statement/payment disputes.",
};

const norm = (t) => ` ${(t || "").toLowerCase().replace(/\s+/g, " ")} `;

function tag(text) {
  const s = norm(text);
  const hits = [];
  for (const [theme, kws] of Object.entries(THEMES)) {
    if (kws.some((k) => s.includes(k))) hits.push(theme);
  }
  return hits;
}

function topThemes(reviews, { positive }) {
  const counts = {};
  for (const r of reviews) {
    if (!r.text) continue;
    const isPos = r.score >= 4;
    if (positive !== isPos) continue;
    for (const t of tag(r.text)) counts[t] = (counts[t] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([t, c]) => `${t} (${c})`);
}

function pickQuote(reviews, { negative }) {
  const pool = reviews
    .filter((r) => r.text && r.text.length > 8 && r.text.length < 220)
    .filter((r) => (negative ? r.score <= 2 : r.score >= 4))
    .sort((a, b) => b.text.length - a.text.length);
  return pool[0]?.text || "";
}

const header = [
  "Brand", "Audience", "Overall rating (lifetime)", "Total ratings (lifetime)",
  "Reviews sampled (recent)", "% of sample <=3 stars",
  "Top COMPLAINT themes (sample)", "Top PRAISE themes (sample)",
  "Analyst summary", "Representative complaint", "Representative praise",
];

const rows = DATA.results.map((r) => {
  const all = [...r.play.reviews, ...r.apple.reviews];
  const withText = all.filter((x) => x.text);
  const neg = all.filter((x) => x.score <= 3).length;
  const overall = r.play.rating ?? r.apple.rating;
  const totalRatings = (r.play.ratings || 0) + (r.apple.ratings || 0);
  return [
    r.brand,
    r.audience,
    overall ? Math.round(overall * 100) / 100 : "N/A",
    totalRatings || "N/A",
    all.length,
    all.length ? Math.round((neg / all.length) * 100) + "%" : "N/A",
    topThemes(withText, { positive: false }).slice(0, 4).join("; ") || "-",
    topThemes(withText, { positive: true }).slice(0, 3).join("; ") || "-",
    SUMMARY[r.brand] || "",
    pickQuote(all, { negative: true }),
    pickQuote(all, { negative: false }),
  ];
});

// method note rows below the table
const note = [
  [],
  ["METHOD & CAVEATS"],
  ["Country", "India stores (Google Play + Apple App Store)"],
  ["Sampling", "Reviews pulled NEWEST-first. The sample over-represents recent complaints; the 'Overall rating (lifetime)' column is the true average from store metadata."],
  ["Theme tagging", "Keyword-based and approximate; one review can match several themes. Counts are directional."],
  ["Coverage gaps", "Easiloan: no reviews. Ambak/GoCredit/Credit Dharma: no or empty iOS review feed. GoCredit ratings look solicited (generic 5-star text)."],
  ["Scraped at", DATA.scrapedAt],
];

const aoa = [header, ...rows, ...note];
const ws = XLSX.utils.aoa_to_sheet(aoa);
ws["!cols"] = [
  { wch: 20 }, { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
  { wch: 40 }, { wch: 30 }, { wch: 70 }, { wch: 55 }, { wch: 45 },
];
ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: header.length - 1 } }) };

// append/replace the sheet in the existing workbook
const wb = XLSX.read(readFileSync(XLSX_PATH), { type: "buffer" });
const name = "Theme Analysis";
if (wb.SheetNames.includes(name)) {
  wb.SheetNames = wb.SheetNames.filter((n) => n !== name);
  delete wb.Sheets[name];
}
// put Theme Analysis right after Summary
XLSX.utils.book_append_sheet(wb, ws, name);
wb.SheetNames = ["Summary", "Theme Analysis", ...wb.SheetNames.filter((n) => n !== "Summary" && n !== "Theme Analysis")];

writeFileSync(XLSX_PATH, XLSX.write(wb, { bookType: "xlsx", type: "buffer" }));
console.log(`Added "${name}" sheet for ${rows.length} apps -> research/ambak-competitor-reviews.xlsx`);
for (const row of rows) console.log(`  ${row[0].padEnd(22)} overall ${String(row[2]).padEnd(5)} | complaints: ${row[6]}`);
