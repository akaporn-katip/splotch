import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.env.URL ?? "http://localhost:4173";
mkdirSync(".impeccable/review", { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome" });
const sizes = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
];

for (const [name, viewport] of sizes) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
  await page.screenshot({ path: `.impeccable/review/${name}-hero.png` });
  if (errors.length) console.log(`[${name}] console errors:\n` + errors.join("\n"));
  await page.close();
}

await browser.close();
console.log("shots ok");
