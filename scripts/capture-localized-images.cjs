const path = require("path");
const { chromium } = require("playwright");

const baseUrl = process.env.EOG_BASE_URL || "http://127.0.0.1:4185";
const outputDir = process.env.EOG_SCREENSHOT_DIR || process.cwd();
const browserPath = process.env.EOG_BROWSER || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  try {
    const page = await browser.newPage({ viewport: { width: 1580, height: 900 } });
    await page.goto(`${baseUrl}/fr/`, { waitUntil: "networkidle", timeout: 30000 });
    const heading = page.getByText("Chaque étape produit quelque chose que l’acheteur peut examiner.", { exact: false }).first();
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(outputDir, "localized-images-fixed-fr.png") });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
