const { chromium } = require("playwright");

const baseUrl = process.env.EOG_BASE_URL || "http://127.0.0.1:4182";
const browserPath = process.env.EOG_BROWSER || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const languages = ["en", "fr", "de", "es", "pt", "ar", "ru"];
const whatsappAria = {
  en: "Chat with East Origin Gems on WhatsApp",
  fr: "Discuter avec East Origin Gems sur WhatsApp",
  de: "East Origin Gems über WhatsApp kontaktieren",
  es: "Contactar con East Origin Gems por WhatsApp",
  pt: "Falar com a East Origin Gems pelo WhatsApp",
  ar: "تواصل مع East Origin Gems عبر واتساب",
  ru: "Связаться с East Origin Gems через WhatsApp"
};
const routes = [
  "/",
  "/solutions/",
  "/products/",
  "/custom-development/",
  "/samples/",
  "/quality/",
  "/about-donghai/",
  "/faq/",
  "/design-review/",
  "/product/clear-quartz-cabochon/",
  "/thank-you/"
];

const localizedUrl = (language, route) => {
  if (language === "en") return `${baseUrl}${route}`;
  return `${baseUrl}/${language}${route}`;
};

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: browserPath,
    args: ["--disable-gpu", "--no-first-run", "--disable-features=msEdgeFirstRunExperience"]
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    const baseHost = new URL(baseUrl).host;
    if (requestUrl.host === baseHost) await route.continue();
    else await route.abort();
  });
  const failures = [];
  let checked = 0;

  try {
    for (const language of languages) {
      for (const route of routes) {
        const url = localizedUrl(language, route);
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.waitForTimeout(80);
        const result = await page.evaluate(({ expectedLanguage, expectedRoute }) => {
          const switchers = [...document.querySelectorAll("[data-eog-language-switcher]")];
          const desktop = switchers.find((element) => !element.classList.contains("eog-language-switcher--mobile"));
          const options = desktop ? [...desktop.querySelectorAll(".eog-language-option")] : [];
          const targetDe = options.find((element) => element.lang === "de");
          const expectedDe = `/de${expectedRoute}`;
          const activeOptions = options.filter((element) => element.getAttribute("aria-checked") === "true");
          const formRequired = [...document.querySelectorAll("form [required]")].map((element) => element.name || element.type);
          return {
            language: document.documentElement.lang,
            direction: document.documentElement.dir,
            switchers: switchers.length,
            options: options.length,
            activeOptions: activeOptions.length,
            activeLanguage: activeOptions[0]?.lang || "",
            sameRouteGerman: targetDe ? new URL(targetDe.href).pathname === expectedDe : false,
            whatsapp: Boolean(document.querySelector('#eog-whatsapp-float[href*="wa.me/8615252474087"]')),
            whatsappAria: document.querySelector("#eog-whatsapp-float")?.getAttribute("aria-label") || "",
            oldPreviewLink: [...document.querySelectorAll("a[href]")].some((anchor) => anchor.href.includes("/language-preview/")),
            required: formRequired,
            fileInput: expectedRoute === "/design-review/" ? Boolean(document.querySelector('input[type="file"]')) : true
          };
        }, { expectedLanguage: language, expectedRoute: route });

        const issues = [];
        if (!response || !response.ok()) issues.push(`status=${response?.status() || "none"}`);
        if (result.language !== language) issues.push(`lang=${result.language}`);
        if (language === "ar" && result.direction !== "rtl") issues.push(`dir=${result.direction}`);
        if (language !== "ar" && result.direction !== "ltr") issues.push(`dir=${result.direction}`);
        if (result.switchers < 2) issues.push(`switchers=${result.switchers}`);
        if (result.options !== 7) issues.push(`options=${result.options}`);
        if (result.activeOptions !== 1 || result.activeLanguage !== language) issues.push(`active=${result.activeLanguage}`);
        if (!result.sameRouteGerman) issues.push("same-route-switch=false");
        if (!result.whatsapp) issues.push("whatsapp=false");
        if (result.whatsappAria !== whatsappAria[language]) issues.push(`whatsapp-aria=${result.whatsappAria}`);
        if (result.oldPreviewLink) issues.push("old-preview-link=true");
        if (!result.fileInput) issues.push("file-input=false");
        if (["/", "/samples/", "/design-review/"].includes(route)) {
          const required = new Set(result.required);
          if (![...required].some((name) => /name/i.test(name))) issues.push("required-name=false");
          if (![...required].some((name) => /email/i.test(name))) issues.push("required-email=false");
          const unexpected = [...required].filter((name) => !/name|email/i.test(name));
          if (unexpected.length) issues.push(`extra-required=${unexpected.join(",")}`);
        }
        if (issues.length) failures.push({ language, route, issues });
        checked += 1;
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(localizedUrl("ar", "/products/"), { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(100);
    const mobile = await page.evaluate(() => {
      const switcher = document.querySelector(".eog-language-switcher--mobile");
      const trigger = switcher?.querySelector(".eog-language-trigger");
      const style = switcher ? getComputedStyle(switcher) : null;
      trigger?.click();
      const menu = switcher?.querySelector(".eog-language-menu");
      const rect = menu?.getBoundingClientRect();
      return {
        visible: Boolean(style && style.display !== "none"),
        expanded: trigger?.getAttribute("aria-expanded") === "true",
        inViewport: Boolean(rect && rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight)
      };
    });
    if (!mobile.visible || !mobile.expanded || !mobile.inViewport) {
      failures.push({ language: "ar", route: "/products/", issues: [`mobile=${JSON.stringify(mobile)}`] });
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify({ checked, failures, ok: failures.length === 0 }, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
