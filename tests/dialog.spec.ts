import { expect, test } from "@playwright/test";
import { openSheet } from "./support";

const MARKUP_TRIGGER = "Read the markup for Switch";

/** DESIGN.md, Components: the markup dialog is the shell's own Dialog, so Escape closes it. */
test("a specimen's markup dialog opens with Enter and closes with Escape", async ({ page }) => {
  await openSheet(page);

  const trigger = page.getByRole("button", { name: MARKUP_TRIGGER });
  const dialog = page.getByRole("dialog");

  await trigger.focus();
  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("Switch");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

/** DESIGN.md, Components: focus is trapped inside the dialog, never behind it. */
test("a specimen dialog is focus-trapped and named", async ({ page }) => {
  await openSheet(page);

  const trigger = page.getByRole("button", { name: MARKUP_TRIGGER });
  await trigger.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("Switch");

  const escapes: string[] = [];
  for (let presses = 0; presses < 12; presses += 1) {
    const focus = await page.evaluate(() => {
      const active = document.activeElement;
      const panel = document.querySelector('[role="dialog"]');
      return {
        inside: Boolean(panel && active && panel.contains(active)),
        where: `${active?.tagName.toLowerCase() ?? "nothing"}: ${(active?.textContent ?? "")
          .trim()
          .slice(0, 40)}`,
      };
    });
    if (!focus.inside) escapes.push(focus.where);
    await page.keyboard.press("Tab");
  }

  expect(escapes, `Tab left the dialog for the page behind it: ${escapes.join(" | ")}`).toEqual([]);
});
