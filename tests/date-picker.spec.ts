import { expect, test } from "@playwright/test";
import { openSheet } from "./support";

const TRIGGER = { name: /press date/i };

/** The specimen lives on the Inputs tab of the parts sheet. */
async function openPicker(page: import("@playwright/test").Page) {
  await openSheet(page);
  await page.getByRole("tab", { name: /inputs/i }).click();
  return page.getByRole("button", TRIGGER);
}

/** DESIGN.md, Motion/Accessibility: the crop mark is on the trigger, Escape is Radix's. */
test("the date picker opens from the keyboard and Escape returns focus", async ({ page }) => {
  const trigger = await openPicker(page);

  await trigger.focus();
  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");
  const grid = page.getByRole("grid");
  await expect(grid).toBeVisible();
  await expect(grid).toHaveAccessibleName(/\d{4}/);

  // The grid is entered on a day, not on an empty panel.
  const landed = await page.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? "",
  );
  expect(landed, "opening the picker did not put focus on a day").toMatch(/\d{4}/);

  await page.keyboard.press("Escape");
  await expect(grid).toBeHidden();
  await expect(trigger).toBeFocused();
});

/**
 * DESIGN.md, Components: selected means printed in the spot ink, and the day is
 * chosen. Date maths here is UTC-only on purpose — a local `new Date("...")` plus
 * toISOString() shifts the day in any timezone east of Greenwich, which would make
 * this spec prove the test's arithmetic rather than the component's.
 */
test("arrow keys move the day and Enter prints the chosen date", async ({ page }) => {
  const trigger = await openPicker(page);

  await trigger.click();
  const grid = page.getByRole("grid");
  await expect(grid).toBeVisible();

  const start = await page.evaluate(
    () => (document.activeElement as HTMLElement | null)?.dataset.day ?? "",
  );
  expect(start).toMatch(/^\d{4}-\d{2}-\d{2}$/);

  const before = await page.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? "",
  );
  await page.keyboard.press("ArrowRight");
  const afterRight = await page.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? "",
  );
  expect(afterRight, "ArrowRight did not move to the next day").not.toBe(before);

  await page.keyboard.press("ArrowDown");
  const landed = await page.evaluate(
    () => (document.activeElement as HTMLElement | null)?.dataset.day ?? "",
  );

  const [y, m, d] = start.split("-").map(Number);
  const plusEight = new Date(Date.UTC(y, m - 1, d) + 8 * 86_400_000).toISOString().slice(0, 10);
  expect(landed, "ArrowRight then ArrowDown did not land a week and a day later").toBe(plusEight);

  await page.keyboard.press("Enter");
  await expect(grid).toBeHidden();

  // Format with the runtime's own locale, the one the component defaults to.
  const printed = await page.evaluate(
    (iso) =>
      new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(`${iso}T12:00:00`)),
    plusEight,
  );
  await expect(trigger).toContainText(printed);
});
