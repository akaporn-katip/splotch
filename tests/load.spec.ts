import { expect, test } from "@playwright/test";
import { openSheet } from "./support";

/**
 * scripts/shoot.mjs already proves the sheet can load without console or page
 * errors; the suite holds it to that, at both ends of the responsive range.
 */
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
] as const;

for (const viewport of VIEWPORTS) {
  test(`the sheet loads clean at ${viewport.name} width`, async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") problems.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => problems.push(`page: ${String(error)}`));

    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openSheet(page);

    // The hero has printed by now, so hydration and the first frame are behind us.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Press\s*the\s*paper/);

    expect(problems).toEqual([]);
  });
}
