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

/**
 * DESIGN.md, Motion: the dialog's authored moment is a 14px rise into register —
 * it must arrive centered, not fly in from a corner. Regression guard for a
 * centering translate being overridden by the entrance animation.
 */
test("the dialog is centered on its first painted frame", async ({ page }) => {
  await openSheet(page);

  await page.getByRole("button", { name: MARKUP_TRIGGER }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  const first = await dialog.boundingBox();
  await page.waitForTimeout(600);
  const settled = await dialog.boundingBox();
  const viewport = page.viewportSize();

  expect(first, "the dialog has no box while it is open").not.toBeNull();
  expect(settled).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!first || !settled || !viewport) return;

  // Horizontal position is fixed by the layout, never by the animation.
  expect(Math.abs(first.x - settled.x), "the dialog slides sideways as it enters").toBeLessThan(1);
  expect(settled.x + settled.width / 2).toBeCloseTo(viewport.width / 2, 0);
  expect(settled.y + settled.height / 2).toBeCloseTo(viewport.height / 2, 0);

  // The authored motion is a short rise, not a scramble from the top of the page.
  expect(first.y - settled.y).toBeGreaterThan(-1);
  expect(first.y - settled.y).toBeLessThan(24);

  // A short specimen prints a short panel: inset-0 must not stretch it to the viewport.
  expect(settled.height, "the dialog stretched to fill the viewport").toBeLessThan(
    viewport.height * 0.85,
  );
});
