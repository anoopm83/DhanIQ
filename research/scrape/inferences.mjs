// Adds an "Inferences" sheet (executive synthesis) to the competitor workbook.
// Curated from the home-loan-filtered review research. Run: `npm run inferences`
// (run AFTER compare + themes so the workbook exists).

import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "node:fs";

const XLSX_PATH = new URL("../ambak-competitor-reviews.xlsx", import.meta.url);

const positives = [
  ["1", "Demand for honest home-loan comparison is proven",
    "Credit Dharma's home-loan users praise exactly DhanIQ's concept: 'find lowest home loan rates across banks', 'very accurate home-loan calculation', 'better than other EMI calculator apps'. Direct validation of the core idea."],
  ["2", "Borrowers research months before they apply",
    "Paisabazaar home-loan reviews show a 'prepare first' audience checking credit score/report 6-7 months ahead of applying. A real top-of-funnel window for a no-pressure tool to earn trust early."],
  ["3", "Good human support is a genuine differentiator",
    "Where it shows up it is loved: Ambak (JustDial 4.4, 'smooth process, supportive staff'), Paisabazaar ('seamless home-loan support/disbursal'). Service quality, not just rates, moves sentiment."],
  ["4", "The partner / agent (DSA) channel works",
    "Ambak Saathi (4.68) and OneAndro cross-sell mentions show the B2B2C distribution model has satisfied users on the supply side."],
];

const negatives = [
  ["1", "App reliability kills otherwise-great products",
    "Credit Dharma has the best concept but the LOWEST rating (3.79), dragged down by ~48 mentions of login failures / 'app won't open' / broken sign-up. The idea lands; execution leaks. Reliability beats features."],
  ["2", "Interest rates & hidden cost are a raw nerve",
    "HomeFirst draws furious home-loan reviews: 'rate of interest bahut zyada', 'heavy ROI, avoid this'. Cost opacity generates real anger - precisely DhanIQ's 'true cost' wedge."],
  ["3", "After-sales service is a black hole",
    "HomeFirst's loudest theme (~25 mentions) is unreachable customer care plus statement/payment disputes ('paid Rs.20,000, statement shows Rs.12,000'). Post-disbursal neglect destroys hard-won trust."],
  ["4", "Trust erodes on bait-and-switch and data misuse",
    "Adjacent signal (Paisabazaar): 'pre-approved then rejected - felt cheated', 'selling my data'. Ambak markets 'no pushy calls' yet gets a persistent-calls complaint. Marketing that contradicts lived experience is punished."],
  ["5", "Onboarding friction loses people",
    "Andromeda's negatives cluster on KYC / activation stuck for weeks. Slow verification is an early drop-off point."],
  ["6", "High star-ratings can be manufactured",
    "GoCredit's near-perfect 4.75 is built on generic one-word 5-star text - reads as solicited. Don't benchmark against inflated ratings."],
];

const mapping = [
  ["Opaque / high cost, 'hidden' rates", "True-cost / effective-APR computation"],
  ["Pushy calls, data selling", "On-device; nothing leaves the device; no calls"],
  ["Bait 'pre-approved' then rejected", "Advice-neutral; no lead-gen; no recommendations"],
  ["App won't open / login bugs", "Opportunity: win on reliability (Credit Dharma's weak spot)"],
];

const aoa = [
  ["Ambak & Home-Loan Competitor Reviews - Inferences"],
  ["Scope: home-loan reviews only (India Google Play + Apple App Store). See 'Theme Analysis' for method & caveats."],
  [`Generated: ${new Date().toISOString().slice(0, 10)}`],
  [],
  ["POSITIVE INFERENCES (what the market rewards)"],
  ["#", "Inference", "Evidence / basis"],
  ...positives,
  [],
  ["NEGATIVE INFERENCES (recurring pain - avoid / exploit)"],
  ["#", "Inference", "Evidence / basis"],
  ...negatives,
  [],
  ["IMPLICATIONS FOR DHANIQ"],
  ["Competitor pain", "DhanIQ's answer"],
  ...mapping,
  [],
  ["BOTTOM LINE"],
  ["", "Demand for the product is validated; market leaders lose on trust, transparency, and app reliability - the exact axes DhanIQ is built to win. Caution: a great concept dies on a broken first-run, so reliability and a frictionless first use matter as much as the finance engine."],
];

const ws = XLSX.utils.aoa_to_sheet(aoa);
ws["!cols"] = [{ wch: 5 }, { wch: 52 }, { wch: 95 }];
// merge the section/title banner cells across the 3 columns for readability
const wide = new Set([0, 1, 2, 4, 8, 14, 19]); // 0-based row indexes of banner/full-width lines
ws["!merges"] = [...wide].map((r) => ({ s: { r, c: 0 }, e: { r, c: 2 } }));

const wb = XLSX.read(readFileSync(XLSX_PATH), { type: "buffer" });
const name = "Inferences";
if (wb.SheetNames.includes(name)) {
  wb.SheetNames = wb.SheetNames.filter((n) => n !== name);
  delete wb.Sheets[name];
}
XLSX.utils.book_append_sheet(wb, ws, name);
// order: Summary, Inferences, Theme Analysis, All Reviews
const order = ["Summary", "Inferences", "Theme Analysis", "All Reviews"];
wb.SheetNames = [...order.filter((n) => wb.SheetNames.includes(n)), ...wb.SheetNames.filter((n) => !order.includes(n))];

writeFileSync(XLSX_PATH, XLSX.write(wb, { bookType: "xlsx", type: "buffer" }));
console.log(`Added "${name}" sheet -> research/ambak-competitor-reviews.xlsx`);
console.log("Sheets now:", wb.SheetNames.join(", "));
