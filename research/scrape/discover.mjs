// Discovery step — search Google Play + Apple App Store (country: IN) for each
// competitor brand and print candidate apps (id, title, developer) so we can
// pick the correct app IDs before scraping reviews.

import gplayImport from "google-play-scraper";
import storeImport from "app-store-scraper";

const gplay = gplayImport.default ?? gplayImport;
const store = storeImport.default ?? storeImport;

const TERMS = [
  "Ambak",
  "Credit Dharma",
  "Easiloan",
  "Andromeda loan",
  "Paisabazaar",
  "GoCredit",
  "HomeFirst Finance",
];

const COUNTRY = "in";

for (const term of TERMS) {
  console.log(`\n================ ${term} ================`);

  // ---- Google Play ----
  console.log("--- Google Play ---");
  try {
    const res = await gplay.search({ term, num: 5, country: COUNTRY, lang: "en" });
    if (!res.length) console.log("  (no results)");
    for (const a of res) {
      console.log(`  ${a.appId}  |  ${a.title}  |  dev: ${a.developer}  |  ${a.score ?? "—"}★`);
    }
  } catch (e) {
    console.log(`  ERROR: ${e?.message || e}`);
  }

  // ---- Apple App Store ----
  console.log("--- Apple App Store ---");
  try {
    const res = await store.search({ term, num: 5, country: COUNTRY });
    if (!res.length) console.log("  (no results)");
    for (const a of res) {
      console.log(`  id=${a.id}  |  ${a.title}  |  dev: ${a.developer}  |  ${a.appId}`);
    }
  } catch (e) {
    console.log(`  ERROR: ${e?.message || e}`);
  }
}
console.log("\nDone.");
