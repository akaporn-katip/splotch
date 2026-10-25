import { expect, test } from "@playwright/test";
import { INK_SETS, inkCard, openSheet, rootToken } from "./support";

/**
 * DESIGN.md, Inks: four sets, each a different ground and spot, all of them CSS
 * custom properties on `<html data-ink>`. Clicking a card has to reprint every one
 * of them — and the card has to be printing the ink it actually applies.
 */
test("each ink card reprints the sheet in its own set", async ({ page }) => {
  await openSheet(page);

  const fields = new Map<string, string>();

  for (const set of INK_SETS) {
    const card = inkCard(page, set.card);
    await card.click();

    await expect(page.locator("html")).toHaveAttribute("data-ink", set.id);
    await expect(card).toBeChecked();

    const field = await rootToken(page, "--color-field");
    expect(field, `${set.id} resolves no --color-field`).toMatch(/^(#|rgb)/);
    fields.set(set.id, field);

    // The swatch printed on the card is the JSX ink value; the token is the CSS
    // one. They are two copies of the palette and must not drift apart.
    const painted = await card.evaluate((element) => {
      const swatch = element.querySelector<HTMLElement>("span[style*='background']");
      const probe = document.createElement("div");
      probe.style.color = "var(--color-field)";
      document.documentElement.append(probe);
      const token = getComputedStyle(probe).color;
      probe.remove();
      return { swatch: swatch && getComputedStyle(swatch).backgroundColor, token };
    });

    expect(painted.swatch, `${set.id}: the card's field swatch and --color-field disagree`).toBe(
      painted.token,
    );
  }

  expect(new Set(fields.values()).size, `the four sets printed ${JSON.stringify([...fields])}`).toBe(
    INK_SETS.length,
  );
});
