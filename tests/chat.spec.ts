import { expect, test, type Locator, type Page } from "@playwright/test";
import { expectNoHorizontalOverflow, openSheet } from "./support";

/** The specimen lives on the Feedback tab of the parts sheet. */
async function openChat(page: Page) {
  await openSheet(page);
  await page.getByRole("tab", { name: /feedback/i }).click();
  const log = page.getByRole("log", { name: "Press room" });
  await log.scrollIntoViewIfNeeded();
  return {
    log,
    messages: log.locator("[data-chat-message]"),
    field: page.getByRole("textbox", { name: "Message" }),
    send: page.getByRole("button", { name: "Send" }),
  };
}

/** Pixels between the bottom of what the log shows and the bottom of what it holds. */
function distanceFromEnd(log: Locator) {
  return log.evaluate((element) => element.scrollHeight - element.scrollTop - element.clientHeight);
}

/** The prompt's accessibility contract: a polite log, a labelled field, 44px targets. */
test("the thread is a polite log and the composer is a labelled field with 44px targets", async ({
  page,
}) => {
  const { log, field, send } = await openChat(page);

  await expect(log).toHaveAttribute("aria-live", "polite");
  await expect(log).toHaveAttribute("tabindex", "0");
  // It opens on the newest message, not the oldest.
  expect(await distanceFromEnd(log)).toBeLessThanOrEqual(24);

  // A real <label>, not a placeholder standing in for one.
  const labelled = await field.evaluate(
    (element) => (element as HTMLTextAreaElement).labels?.[0]?.textContent ?? "",
  );
  expect(labelled).toBe("Message");

  // The crop mark is drawn inset: the log sits inside the framed chat panel.
  await log.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(log).toBeFocused();
  const ring = await log.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, offset: style.outlineOffset };
  });
  expect(ring).toEqual({ style: "dashed", offset: "-4px" });

  for (const target of [field, send]) {
    const box = await target.boundingBox();
    expect(box?.height, "a composer target is shorter than 44px").toBeGreaterThanOrEqual(44);
    expect(box?.width, "a composer target is narrower than 44px").toBeGreaterThanOrEqual(44);
  }
});

test("send is disabled while the draft is blank, and Enter on a blank draft sends nothing", async ({
  page,
}) => {
  const { messages, field, send } = await openChat(page);
  const before = await messages.count();

  await expect(send).toBeDisabled();
  await field.fill("   \n  ");
  await expect(send).toBeDisabled();
  await field.press("Enter");
  await expect(messages).toHaveCount(before);

  await field.fill("Print it.");
  await expect(send).toBeEnabled();
});

test("Shift+Enter is a new line, Enter sends, and the thread follows the new message", async ({
  page,
}) => {
  const { log, messages, field, send } = await openChat(page);
  const before = await messages.count();

  await field.click();
  await page.keyboard.type("Line one");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.type("line two");
  await expect(field).toHaveValue("Line one\nline two");
  await expect(messages).toHaveCount(before);

  await page.keyboard.press("Enter");
  await expect(messages).toHaveCount(before + 1);

  const sent = messages.last();
  await expect(sent).toHaveAttribute("data-chat-own", "true");
  await expect(sent).toContainText("Line one");
  await expect(sent).toContainText("line two");

  // The draft clears, focus stays to write the next one, and send goes back to halftone.
  await expect(field).toHaveValue("");
  await expect(field).toBeFocused();
  await expect(send).toBeDisabled();

  expect(await distanceFromEnd(log)).toBeLessThanOrEqual(24);

  // The canned reply arrives while the reader is at the bottom: the thread follows it.
  await expect(messages).toHaveCount(before + 2);
  await expect(messages.last()).toHaveAttribute("data-chat-own", "false");
  await expect.poll(() => distanceFromEnd(log)).toBeLessThanOrEqual(24);
});

test("a reader who scrolled back is left where they are, and offered the way down", async ({
  page,
}) => {
  const { log, messages, field } = await openChat(page);
  const before = await messages.count();
  const jump = page.getByRole("button", { name: /jump to newest/i });

  await field.fill("Pull another proof.");
  await field.press("Enter");
  await expect(messages).toHaveCount(before + 1);

  // Read back to the top before the reply lands (it is ~900ms behind).
  await log.evaluate((element) => {
    element.scrollTop = 0;
  });
  await expect(jump).toBeHidden();

  await expect(messages).toHaveCount(before + 2);
  await expect(messages.last()).toHaveAttribute("data-chat-own", "false");

  // The new message did not drag the reader down...
  expect(await log.evaluate((element) => element.scrollTop)).toBe(0);
  // ...and the way back is offered, outside the log so it is not announced as a message.
  await expect(jump).toBeVisible();
  expect(await jump.evaluate((element) => element.closest('[role="log"]') === null)).toBe(true);
  const box = await jump.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);

  await jump.click();
  expect(await distanceFromEnd(log)).toBeLessThanOrEqual(24);
  await expect(jump).toBeHidden();
});

test("a composer growing line by line does not cover the newest message", async ({ page }) => {
  const { log, messages, field } = await openChat(page);
  const before = await messages.count();
  expect(await distanceFromEnd(log)).toBeLessThanOrEqual(24);
  const tall = await log.evaluate((element) => element.clientHeight);

  await field.click();
  for (const line of ["One", "two", "three", "four"]) {
    await page.keyboard.type(line);
    await page.keyboard.press("Shift+Enter");
  }
  await expect(messages).toHaveCount(before);

  // The log really did shrink — otherwise this spec would prove nothing.
  expect(await log.evaluate((element) => element.clientHeight)).toBeLessThan(tall - 40);
  await expect.poll(() => distanceFromEnd(log)).toBeLessThanOrEqual(24);
});

/** DESIGN.md, Layout: the composer row (field + send) is the widest thing the chat prints. */
test("the chat prints inside the sheet at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { field, send } = await openChat(page);
  await field.fill("A long line that has to wrap rather than push the send button off the sheet.");
  await expectNoHorizontalOverflow(page);
  const box = await send.boundingBox();
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390);
});
