// Competitor review scraper — pulls Google Play + Apple App Store ratings and
// reviews for Ambak and its peers, and writes a comparable Excel workbook.
//
// Run: `npm install && npm run compare`
// Output (in ../):
//   - ambak-competitor-reviews.xlsx   (Summary sheet + All Reviews sheet)
//   - ambak-competitor-data.json      (raw structured data, for the record)

import gplayImport from "google-play-scraper";
import storeImport from "app-store-scraper";
import * as XLSX from "xlsx";
import { writeFileSync } from "node:fs";

const gplay = gplayImport.default ?? gplayImport;
const store = storeImport.default ?? storeImport;

const COUNTRY = "in";
const LANG = "en";
const PLAY_REVIEWS = 60; // recent reviews to pull per Play app
const APPLE_PAGES = 3; // Apple: ~50 reviews/page

// Chosen apps (see discover.mjs output). appleId = null when no IN iOS app found.
const APPS = [
  { brand: "Ambak", audience: "Partner/DSA", playId: "com.ambak.saathi", appleId: 6474469003 },
  { brand: "Credit Dharma", audience: "Consumer (home loan)", playId: "com.tresscommas.threedots", appleId: null },
  { brand: "Easiloan", audience: "Consumer (home loan)", playId: "com.easiloan.app", appleId: null },
  { brand: "Andromeda (OneAndro)", audience: "Loan agent/DSA", playId: "com.oneandro", appleId: 6478778926 },
  { brand: "Paisabazaar", audience: "Consumer (credit/loans)", playId: "com.paisabazaar", appleId: 1029403201 },
  { brand: "GoCredit", audience: "Consumer (personal loan)", playId: "money.gocredit.ai", appleId: null },
  { brand: "HomeFirst", audience: "Consumer (home loan)", playId: "com.homefirstindia.customer", appleId: 1444845347 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrapePlay(app) {
  const out = { rating: null, ratings: null, reviewsCount: null, installs: null, updated: null, developer: null, reviews: [] };
  try {
    const d = await gplay.app({ appId: app.playId, country: COUNTRY, lang: LANG });
    out.rating = d.score;
    out.ratings = d.ratings;
    out.reviewsCount = d.reviews;
    out.installs = d.installs;
    out.updated = d.updated ? new Date(d.updated).toISOString().slice(0, 10) : null;
    out.developer = d.developer;
  } catch (e) {
    out.error = `app: ${e?.message || e}`;
  }
  try {
    const res = await gplay.reviews({ appId: app.playId, country: COUNTRY, lang: LANG, sort: gplay.sort.NEWEST, num: PLAY_REVIEWS });
    const data = Array.isArray(res) ? res : res?.data ?? [];
    out.reviews = data.map((r) => ({
      user: r.userName,
      score: r.score,
      date: r.date ? String(r.date).slice(0, 10) : null,
      text: (r.text || "").replace(/\s+/g, " ").trim(),
      thumbsUp: r.thumbsUp ?? null,
    }));
  } catch (e) {
    out.reviewsError = `reviews: ${e?.message || e}`;
  }
  return out;
}

async function scrapeApple(app) {
  const out = { rating: null, ratings: null, updated: null, developer: null, reviews: [] };
  if (!app.appleId) return out;
  try {
    const d = await store.app({ id: app.appleId, country: COUNTRY });
    out.rating = d.score;
    out.ratings = d.reviews; // app-store-scraper exposes ratings count as `reviews`
    out.updated = d.updated ? String(d.updated).slice(0, 10) : null;
    out.developer = d.developer;
  } catch (e) {
    out.error = `app: ${e?.message || e}`;
  }
  const seen = new Set();
  for (let page = 1; page <= APPLE_PAGES; page++) {
    try {
      const res = await store.reviews({ id: app.appleId, country: COUNTRY, sort: store.sort.RECENT, page });
      if (!res?.length) break;
      for (const r of res) {
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        out.reviews.push({
          user: r.userName,
          score: r.score,
          date: r.updated ? String(r.updated).slice(0, 10) : null,
          text: `${r.title ? r.title + " — " : ""}${(r.text || "").replace(/\s+/g, " ").trim()}`,
          thumbsUp: null,
        });
      }
      await sleep(400);
    } catch (e) {
      out.reviewsError = `reviews p${page}: ${e?.message || e}`;
      break;
    }
  }
  return out;
}

// ---- run ----
const results = [];
for (const app of APPS) {
  process.stdout.write(`Scraping ${app.brand} ... `);
  const play = await scrapePlay(app);
  const apple = await scrapeApple(app);
  results.push({ ...app, play, apple });
  console.log(`Play ${play.reviews.length} rev, Apple ${apple.reviews.length} rev`);
  await sleep(500);
}

// ---- raw json ----
writeFileSync(
  new URL("../ambak-competitor-data.json", import.meta.url),
  JSON.stringify({ scrapedAt: new Date().toISOString(), country: COUNTRY, results }, null, 2),
);

// ---- build workbook ----
const wb = XLSX.utils.book_new();

// Summary sheet (one row per brand, both platforms side by side)
const summaryHeader = [
  "Brand", "Audience / app type",
  "Play app ID", "Play rating", "Play # ratings", "Play # text reviews", "Play installs", "Play last updated",
  "Apple app ID", "Apple rating", "Apple # ratings", "Apple last updated",
  "Reviews pulled (Play/Apple)", "Notes",
];
const summaryRows = results.map((r) => {
  const notes = [];
  if (!r.appleId) notes.push("No iOS app found in IN App Store (Android-only)");
  if (r.play.error) notes.push(`Play: ${r.play.error}`);
  if (r.apple.error) notes.push(`Apple: ${r.apple.error}`);
  return [
    r.brand, r.audience,
    r.playId, round(r.play.rating), r.play.ratings ?? "", r.play.reviewsCount ?? "", r.play.installs ?? "", r.play.updated ?? "",
    r.appleId ?? "N/A", round(r.apple.rating), r.apple.ratings ?? "", r.apple.updated ?? "",
    `${r.play.reviews.length} / ${r.apple.reviews.length}`, notes.join("; "),
  ];
});
const wsSummary = XLSX.utils.aoa_to_sheet([summaryHeader, ...summaryRows]);
wsSummary["!cols"] = [
  { wch: 20 }, { wch: 22 }, { wch: 26 }, { wch: 11 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 14 },
  { wch: 12 }, { wch: 11 }, { wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 45 },
];
wsSummary["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: summaryRows.length, c: summaryHeader.length - 1 } }) };
XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

// All Reviews sheet (every pulled review, filterable)
const reviewRows = [["Brand", "Platform", "Rating (stars)", "Date", "User", "Review", "Helpful votes"]];
for (const r of results) {
  for (const rv of r.play.reviews) reviewRows.push([r.brand, "Google Play", rv.score ?? "", rv.date ?? "", rv.user ?? "", rv.text ?? "", rv.thumbsUp ?? ""]);
  for (const rv of r.apple.reviews) reviewRows.push([r.brand, "Apple App Store", rv.score ?? "", rv.date ?? "", rv.user ?? "", rv.text ?? "", ""]);
}
const wsReviews = XLSX.utils.aoa_to_sheet(reviewRows);
wsReviews["!cols"] = [{ wch: 20 }, { wch: 16 }, { wch: 13 }, { wch: 12 }, { wch: 22 }, { wch: 90 }, { wch: 12 }];
wsReviews["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: reviewRows.length - 1, c: 6 } }) };
XLSX.utils.book_append_sheet(wb, wsReviews, "All Reviews");

const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
writeFileSync(new URL("../ambak-competitor-reviews.xlsx", import.meta.url), buf);

console.log(`\nWrote ${reviewRows.length - 1} reviews across ${results.length} apps.`);
console.log("-> research/ambak-competitor-reviews.xlsx");
console.log("-> research/ambak-competitor-data.json");

function round(v) {
  return typeof v === "number" ? Math.round(v * 100) / 100 : "";
}
