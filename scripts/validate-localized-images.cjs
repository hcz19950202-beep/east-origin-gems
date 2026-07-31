const { chromium } = require("playwright");

const baseUrl = process.env.EOG_BASE_URL || "http://127.0.0.1:4184";
const browserPath = process.env.EOG_BROWSER || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const languages = ["fr", "de", "es", "pt", "ar", "ru"];

async function main() {
  const browser = await chromium.launch({ headless: true, executablePath: browserPath });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const checks = [];
    for (const language of languages) {
      const failedRequests = [];
      const onRequestFailed = (request) => {
        if (request.resourceType() === "image") {
          failedRequests.push({ url: request.url(), error: request.failure()?.errorText || "request failed" });
        }
      };
      page.on("requestfailed", onRequestFailed);
      const url = `${baseUrl}/${language}/`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      const images = await page.locator("img").evaluateAll((elements) => elements.map((image) => ({
        src: image.getAttribute("src"),
        resolved: image.currentSrc || image.src,
        alt: image.alt,
        complete: image.complete,
        naturalWidth: image.naturalWidth
      })));
      const broken = images.filter((image) => !image.complete || image.naturalWidth === 0);
      checks.push({ language, page: url, imageCount: images.length, broken, failedRequests });
      page.off("requestfailed", onRequestFailed);
    }
    const result = {
      checkedPages: checks.length,
      checkedImages: checks.reduce((total, check) => total + check.imageCount, 0),
      failures: checks.filter((check) => check.broken.length || check.failedRequests.length),
      ok: checks.every((check) => check.broken.length === 0 && check.failedRequests.length === 0)
    };
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
