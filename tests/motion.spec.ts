import { expect, test, type Page } from "@playwright/test";
import { hero, inkCard, openSheet, seconds } from "./support";

const hopDuration = (page: Page) =>
  page.evaluate(() => {
    const mascot = document.querySelector(".animate-hop");
    return mascot ? getComputedStyle(mascot).animationDuration : "missing";
  });

const cardTransition = (page: Page) =>
  inkCard(page, /^Workshop/).evaluate((element) => getComputedStyle(element).transitionDuration);

/** DESIGN.md, Motion: "The character hops once (620ms)"; a card eases in 200ms. */
test("the hop runs for its authored 620ms", async ({ page }) => {
  await openSheet(page);

  expect(seconds(await hopDuration(page))).toBeCloseTo(0.62, 3);
  expect(seconds(await cardTransition(page))).toBeCloseTo(0.2, 3);
});

/** DESIGN.md, Motion: "prefers-reduced-motion collapses all of it." */
test.describe("prefers-reduced-motion: reduce", () => {
  test.use({ reducedMotion: "reduce" });

  test("collapses the hop and the transitions, without losing the answer", async ({ page }) => {
    await openSheet(page);

    expect(seconds(await hopDuration(page))).toBeLessThan(0.01);
    expect(seconds(await cardTransition(page))).toBeLessThan(0.01);

    // Reduced motion shortens the author's moment; it does not remove the reply.
    const balloon = page.locator('[aria-live="polite"]');
    await hero(page).getByRole("button", { name: "Boing" }).click();
    await expect(balloon).toContainText("wheee! that's the press.");
  });
});
