import { expect, test } from "@playwright/test";
import { hero, openSheet, rootToken } from "./support";

/**
 * DESIGN.md, Materials: the registration plate is the depth system and `--reg` is
 * user-controllable from 0–12px. Rest is 5px out of register; the slider is the one
 * control that moves every plate on the sheet.
 */
test("the registration slider re-registers every plate", async ({ page }) => {
  await openSheet(page);

  const slider = page.getByRole("slider", { name: "Registration" });
  const boing = hero(page).getByRole("button", { name: "Boing" });
  const plate = () => boing.evaluate((element) => getComputedStyle(element).boxShadow);

  await expect(slider).toHaveAttribute("aria-valuenow", "5");
  expect(await rootToken(page, "--reg")).toBe("5px");
  await expect.poll(plate).toContain("-5px 5px");

  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");

  await expect(slider).toHaveAttribute("aria-valuenow", "7");
  await expect.poll(() => rootToken(page, "--reg")).toBe("7px");

  // The readout and the plate both follow the one variable.
  await expect(page.getByText("7px out")).toBeVisible();
  await expect.poll(plate).toContain("-7px 7px");
});
