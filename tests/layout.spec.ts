import { test } from "@playwright/test";
import { expectNoHorizontalOverflow, openSheet, WIDTHS } from "./support";

/** DESIGN.md, Layout and responsive: "No horizontal overflow at 390, 768, 1024, 1280, 1440." */
for (const width of WIDTHS) {
  test(`nothing prints past the sheet at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openSheet(page);

    await expectNoHorizontalOverflow(page);
  });
}
