const path = require("path");
const { chromium } = require("playwright");

const baseUrl = process.env.EOG_BASE_URL || "http://127.0.0.1:4182";
const outputDir = process.env.EOG_SCREENSHOT_DIR || process.cwd();
const browserPath = process.env.EOG_BROWSER || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await desktop.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    await desktop.locator('[data-eog-language-switcher]:not(.eog-language-switcher--mobile) .eog-language-trigger').click();
    await desktop.screenshot({ path: path.join(outputDir, "latest-language-switcher-desktop.png") });

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(`${baseUrl}/ar/products/`, { waitUntil: "domcontentloaded" });
    await mobile.locator(".eog-language-switcher--mobile .eog-language-trigger").click();
    await mobile.screenshot({ path: path.join(outputDir, "latest-language-switcher-mobile-ar.png") });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
