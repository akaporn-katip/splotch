import { expect, type Locator, type Page } from "@playwright/test";

/**
 * The four ink sets, named as their card is printed in the ink room. The anchors
 * matter: a card's notes mention other sets ("mustard flag" sits in the workshop
 * note), so a loose name would match two radios.
 */
export const INK_SETS = [
  { id: "workshop", card: /^Workshop/ },
  { id: "mustard", card: /^Mustard/ },
  { id: "plum", card: /^Plum/ },
  { id: "newsprint", card: /^Newsprint/ },
] as const;

/** The hero's live control cluster. The Lab prints copies of most of these parts. */
export function hero(page: Page): Locator {
  return page.locator("#top");
}

/** The widths DESIGN.md promises no horizontal overflow at. */
export const WIDTHS = [390, 768, 1024, 1280, 1440] as const;

/** Open the printed sheet and wait until the stock and the type have settled. */
export async function openSheet(page: Page): Promise<void> {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

/** An ink card in the ink room, by the name printed on it. */
export function inkCard(page: Page, card: RegExp): Locator {
  return page.getByRole("radio", { name: card });
}

/** A custom property as the browser resolved it on `<html>`. */
export function rootToken(page: Page, token: string): Promise<string> {
  return page.evaluate(
    (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
    token,
  );
}

/** `"0.62s"` / `"0.001ms"` as a number of seconds. */
export function seconds(duration: string): number {
  return Math.max(
    ...duration.split(",").map((part) => {
      const value = Number.parseFloat(part);
      return part.trim().endsWith("ms") ? value / 1000 : value;
    }),
  );
}

/**
 * The sheet scrolls sideways only if something overflows: `body` hides the
 * x-axis, so the scroll extent of the document is the honest measure.
 */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const box = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));

  expect(box.client, "the viewport did not take the width under test").toBe(
    page.viewportSize()?.width,
  );
  expect(
    box.scroll,
    `the sheet prints ${box.scroll}px wide inside a ${box.client}px viewport`,
  ).toBeLessThanOrEqual(box.client);
}
