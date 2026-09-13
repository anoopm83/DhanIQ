// One-off research tool — pulls Google Play ratings + recent reviews for the
// Ambak apps. Not part of the DhanIQ app. Run: `npm install && npm run scrape`.
//
// Writes two things to ../ :
//   - ambak-play-data.json   (raw structured data, for the record)
//   - prints a human summary to stdout (paste-ready for the report)

import gplayImport from "google-play-scraper";
import { writeFile } from "node:fs/promises";

// v10 is ESM with a default export; be defensive across versions.
const gplay = gplayImport.default ?? gplayImport;

const APPS = [
  { key: "saathi", appId: "com.ambak.saathi", label: "Ambak Saathi" },
  { key: "yoddha", appId: "com.ambak.yoddha", label: "Ambak Yoddha" },
];

const COUNTRY = "in"; // Ambak is India-only
const LANG = "en";
const REVIEWS_PER_APP = 40;

async function scrapeOne({ key, appId, label }) {
  const out = { key, appId, label, ok: false };
  try {
    const app = await gplay.app({ appId, country: COUNTRY, lang: LANG });
    out.ok = true;
    out.title = app.title;
    out.score = app.score; // avg star rating
    out.ratings = app.ratings; // number of ratings
    out.reviewsCount = app.reviews; // number of written reviews
    out.installs = app.installs;
    out.minInstalls = app.minInstalls;
    out.updated = app.updated ? new Date(app.updated).toISOString().slice(0, 10) : null;
    out.developer = app.developer;
    out.histogram = app.histogram; // {1:.., 2:.., ...}

    // Recent reviews (best-effort; may be empty for low-traffic apps)
    try {
      const res = await gplay.reviews({
        appId,
        country: COUNTRY,
        lang: LANG,
        sort: gplay.sort.NEWEST,
        num: REVIEWS_PER_APP,
      });
      const data = Array.isArray(res) ? res : res?.data ?? [];
      out.reviews = data.map((r) => ({
        user: r.userName,
        score: r.score,
        date: r.date ? String(r.date).slice(0, 10) : null,
        text: (r.text || "").replace(/\s+/g, " ").trim(),
        thumbsUp: r.thumbsUp,
      }));
    } catch (e) {
      out.reviewsError = String(e?.message || e);
      out.reviews = [];
    }
  } catch (e) {
    out.error = String(e?.message || e);
  }
  return out;
}

function fmt(v) {
  return v === undefined || v === null ? "—" : v;
}

const results = [];
for (const app of APPS) {
  // sequential to be polite to Play
  // eslint-disable-next-line no-await-in-loop
  results.push(await scrapeOne(app));
}

await writeFile(
  new URL("../ambak-play-data.json", import.meta.url),
  JSON.stringify({ scrapedAt: new Date().toISOString(), country: COUNTRY, results }, null, 2),
);

// Human summary
console.log("\n=== Ambak — Google Play (country: IN) ===\n");
for (const r of results) {
  console.log(`## ${r.label} (${r.appId})`);
  if (!r.ok) {
    console.log(`  ERROR: ${r.error}\n`);
    continue;
  }
  console.log(`  Rating:        ${fmt(r.score)} / 5`);
  console.log(`  # ratings:     ${fmt(r.ratings)}`);
  console.log(`  # reviews:     ${fmt(r.reviewsCount)}`);
  console.log(`  Installs:      ${fmt(r.installs)} (min ${fmt(r.minInstalls)})`);
  console.log(`  Last updated:  ${fmt(r.updated)}`);
  console.log(`  Developer:     ${fmt(r.developer)}`);
  const revs = r.reviews || [];
  console.log(`  Pulled ${revs.length} recent review(s):`);
  for (const rv of revs.slice(0, 10)) {
    console.log(`    - [${fmt(rv.score)}★ ${fmt(rv.date)}] ${rv.user}: ${rv.text || "(no text)"}`);
  }
  console.log("");
}
console.log("Raw data written to research/ambak-play-data.json\n");
