import { defineConfig } from "@playwright/test";

const CI = Boolean(process.env.CI);
const PORT = 4173;

/**
 * A local run may point at a specific browser binary, the way scripts/shoot.mjs
 * does (`CHROME=/usr/bin/google-chrome npm test`). CI installs Playwright's own
 * chromium with `npx playwright install chromium` and leaves this unset.
 */
const executablePath = process.env.CHROME;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", viewport: { width: 1440, height: 900 } },
    },
  ],
  // The suite runs against the production build, which is what ships.
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 180_000,
    stdout: "ignore",
  },
});
