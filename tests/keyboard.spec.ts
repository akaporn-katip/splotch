import { expect, test } from "@playwright/test";
import { hero, openSheet } from "./support";

/**
 * DESIGN.md, Components: "Behaviour is Radix. Focus order, escape, ... come from
 * the primitive." The hero's live cluster is the first place that promise is made,
 * so it is the first place it can break.
 */
test("the hero live controls are tab-reachable and Boing hops on Enter and Space", async ({
  page,
}) => {
  await openSheet(page);

  const boing = hero(page).getByRole("button", { name: "Boing" });
  const balloon = page.locator('[aria-live="polite"]');
  await expect(balloon).toContainText("go on — press something.");

  // Tab in from the top of the document; the masthead, its links and its dialog
  // trigger come first, then the live cluster.
  for (let presses = 0; presses < 40; presses += 1) {
    if (await boing.evaluate((element) => element === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(boing).toBeFocused();

  // The hop is a CSS animation on the mascot; `animationstart` bubbles, so one
  // listener catches it even though the character remounts on each press.
  await page.evaluate(() => {
    const sheet = window as unknown as { hops: number };
    sheet.hops = 0;
    document.addEventListener(
      "animationstart",
      (event) => {
        if ((event as AnimationEvent).animationName === "hop") sheet.hops += 1;
      },
      true,
    );
  });
  const hops = () => page.evaluate(() => (window as unknown as { hops: number }).hops);

  await page.keyboard.press("Enter");
  await expect.poll(hops).toBe(1);
  await expect(balloon).toContainText("wheee! that's the press.");

  await page.keyboard.press("Space");
  await expect.poll(hops).toBe(2);
});
