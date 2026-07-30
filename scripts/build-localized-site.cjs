const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const repo = path.resolve(__dirname, "..");
const cacheDir = path.join(repo, ".build-cache");
const cacheFile = path.join(cacheDir, "translations.json");
const origin = "https://east-origin-gems.pages.dev";
const browserPath = process.env.EOG_BROWSER || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const languages = {
  fr: "French",
  de: "German",
  es: "Spanish",
  pt: "Portuguese",
  ar: "Arabic",
  ru: "Russian"
};
const allLanguageCodes = ["en", ...Object.keys(languages)];
const sourcePages = [
  "index.html",
  "solutions/index.html",
  "products/index.html",
  "custom-development/index.html",
  "samples/index.html",
  "quality/index.html",
  "about-donghai/index.html",
  "faq/index.html",
  "design-review/index.html",
  "product/clear-quartz-cabochon/index.html",
  "thank-you/index.html"
];
const separator = "[[[EOG_SPLIT_7F4C]]]";

const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
const meaningful = (value) => {
  const text = normalize(value);
  if (text.length < 2 || text.length > 1400 || !/[A-Za-z]/.test(text)) return false;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(text)) return false;
  if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(text)) return false;
  if (/^[A-Z0-9_.:/-]{2,32}$/.test(text) && !text.includes(" ")) return false;
  if (/^(East Origin Gems|DONGHAI CRYSTAL|WhatsApp|B2B|CAD|CNC|MOQ|SiO2)$/i.test(text)) return false;
  return true;
};

const ensureI18nScript = (html) => {
  if (html.includes('src="/i18n.js"')) return html;
  return html.replace(/<\/body>/i, '<script src="/i18n.js"></script>\n</body>');
};

const languageUrl = (language, route) => {
  if (language === "en") return `${origin}${route}`;
  return `${origin}/${language}${route}`;
};

const pageRoute = (relativeFile) => {
  if (relativeFile === "index.html") return "/";
  return `/${relativeFile.replace(/index\.html$/i, "").replace(/\\/g, "/")}`;
};

const injectAlternates = (html, relativeFile) => {
  const route = pageRoute(relativeFile);
  const links = [
    '<!-- EOG_I18N_ALTERNATES_START -->',
    ...allLanguageCodes.map((code) => `<link rel="alternate" hreflang="${code}" href="${languageUrl(code, route)}"/>`),
    `<link rel="alternate" hreflang="x-default" href="${languageUrl("en", route)}"/>`,
    '<!-- EOG_I18N_ALTERNATES_END -->'
  ].join("\n");
  const withoutOld = html.replace(/<!-- EOG_I18N_ALTERNATES_START -->[\s\S]*?<!-- EOG_I18N_ALTERNATES_END -->\s*/i, "");
  return withoutOld.replace(/<\/head>/i, `${links}\n</head>`);
};

async function translateRequest(text, target, attempt = 1) {
  const query = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: target,
    dt: "t",
    q: text
  });
  try {
    const url = `https://translate.googleapis.com/translate_a/single?${query.toString()}`;
    const responseText = execFileSync("curl.exe", [
      "-L",
      "-sS",
      "--retry", "3",
      "--retry-delay", "1",
      "--connect-timeout", "20",
      "--max-time", "90",
      url
    ], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      windowsHide: true
    });
    const payload = JSON.parse(responseText);
    return (payload[0] || []).map((part) => part?.[0] || "").join("");
  } catch (error) {
    if (attempt >= 4) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
    return translateRequest(text, target, attempt + 1);
  }
}

const makeBatches = (items) => {
  const batches = [];
  let current = [];
  let length = 0;
  for (const item of items) {
    const extra = item.length + separator.length + 4;
    if (current.length && (current.length >= 24 || length + extra > 3400)) {
      batches.push(current);
      current = [];
      length = 0;
    }
    current.push(item);
    length += extra;
  }
  if (current.length) batches.push(current);
  return batches;
};

async function translateBatch(items, target) {
  if (items.length === 1) return [normalize(await translateRequest(items[0], target))];
  const joined = items.join(`\n${separator}\n`);
  const translated = await translateRequest(joined, target);
  const pieces = translated.split(new RegExp(`\\s*\\[\\[\\[EOG_SPLIT_7F4C\\]\\]\\]\\s*`, "g"));
  if (pieces.length === items.length) return pieces.map(normalize);
  const fallback = [];
  for (const item of items) fallback.push(normalize(await translateRequest(item, target)));
  return fallback;
}

async function main() {
  fs.mkdirSync(cacheDir, { recursive: true });
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};
  const browser = await chromium.launch({
    headless: true,
    executablePath: browserPath,
    args: ["--disable-gpu", "--no-first-run", "--disable-features=msEdgeFirstRunExperience"]
  });
  const page = await browser.newPage();

  try {
    const sourceHtml = {};
    const phrases = new Set();
    for (const relativeFile of sourcePages) {
      const file = path.join(repo, relativeFile);
      let html = fs.readFileSync(file, "utf8");
      html = injectAlternates(ensureI18nScript(html), relativeFile);
      fs.writeFileSync(file, html, "utf8");
      sourceHtml[relativeFile] = html;

      const extracted = await page.evaluate((documentHtml) => {
        const doc = new DOMParser().parseFromString(documentHtml, "text/html");
        const values = [];
        values.push(doc.title);
        doc.querySelectorAll('meta[name="description"]').forEach((element) => values.push(element.content));
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const parent = node.parentElement;
          if (!parent || parent.closest("script, style, noscript, template, .material-symbols-outlined")) continue;
          values.push(node.nodeValue);
        }
        doc.querySelectorAll("[placeholder], [aria-label], [title], img[alt], input[type='submit'][value], input[type='button'][value]").forEach((element) => {
          ["placeholder", "aria-label", "title", "alt", "value"].forEach((attribute) => {
            if (element.hasAttribute(attribute)) values.push(element.getAttribute(attribute));
          });
        });
        return values;
      }, html);
      extracted.map(normalize).filter(meaningful).forEach((phrase) => phrases.add(phrase));
    }

    const phraseList = [...phrases].sort((a, b) => a.localeCompare(b));
    console.log(`SOURCE pages=${sourcePages.length} phrases=${phraseList.length}`);

    for (const language of Object.keys(languages)) {
      cache[language] ||= {};
      const missing = phraseList.filter((phrase) => !cache[language][phrase]);
      const batches = makeBatches(missing);
      console.log(`TRANSLATE language=${language} missing=${missing.length} batches=${batches.length}`);
      let completed = 0;
      for (const batch of batches) {
        const translated = await translateBatch(batch, language);
        batch.forEach((source, index) => {
          cache[language][source] = translated[index] || source;
        });
        completed += batch.length;
        fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), "utf8");
        console.log(`PROGRESS language=${language} completed=${completed}/${missing.length}`);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    }

    for (const [language] of Object.entries(languages)) {
      for (const relativeFile of sourcePages) {
        const route = pageRoute(relativeFile);
        const outputHtml = await page.evaluate(({ documentHtml, dictionary, languageCode, routePath, languageCodes, siteOrigin }) => {
          const doc = new DOMParser().parseFromString(documentHtml, "text/html");
          const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();
          const translateValue = (value) => dictionary[normalizeText(value)] || value;

          doc.documentElement.lang = languageCode;
          doc.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
          if (dictionary[normalizeText(doc.title)]) doc.title = dictionary[normalizeText(doc.title)];
          doc.querySelectorAll('meta[name="description"]').forEach((element) => {
            element.content = translateValue(element.content);
          });

          const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
          const nodes = [];
          while (walker.nextNode()) nodes.push(walker.currentNode);
          nodes.forEach((node) => {
            const parent = node.parentElement;
            if (!parent || parent.closest("script, style, noscript, template, .material-symbols-outlined")) return;
            const key = normalizeText(node.nodeValue);
            if (!dictionary[key]) return;
            const leading = (node.nodeValue.match(/^\s*/) || [""])[0];
            const trailing = (node.nodeValue.match(/\s*$/) || [""])[0];
            node.nodeValue = `${leading}${dictionary[key]}${trailing}`;
          });

          doc.querySelectorAll("[placeholder], [aria-label], [title], img[alt], input[type='submit'][value], input[type='button'][value]").forEach((element) => {
            ["placeholder", "aria-label", "title", "alt", "value"].forEach((attribute) => {
              if (!element.hasAttribute(attribute)) return;
              const current = element.getAttribute(attribute);
              const translated = dictionary[normalizeText(current)];
              if (translated) element.setAttribute(attribute, translated);
            });
          });

          doc.querySelectorAll("a[href]").forEach((anchor) => {
            const href = anchor.getAttribute("href");
            if (!href || !href.startsWith("/") || href.startsWith("//")) return;
            const url = new URL(href, siteOrigin);
            const parts = url.pathname.split("/").filter(Boolean);
            if (languageCodes.includes(parts[0])) parts.shift();
            url.pathname = `/${languageCode}/${parts.length ? `${parts.join("/")}/` : ""}`;
            anchor.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
          });

          doc.querySelectorAll('input[name="_next"]').forEach((input) => {
            input.value = `${siteOrigin}/${languageCode}/thank-you/`;
          });

          doc.querySelectorAll('link[rel="canonical"]').forEach((link) => link.remove());
          const canonical = doc.createElement("link");
          canonical.rel = "canonical";
          canonical.href = `${siteOrigin}/${languageCode}${routePath}`;
          doc.head.append(canonical);
          return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
        }, {
          documentHtml: sourceHtml[relativeFile],
          dictionary: cache[language],
          languageCode: language,
          routePath: route,
          languageCodes: allLanguageCodes,
          siteOrigin: origin
        });

        const outputFile = path.join(repo, language, relativeFile);
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        fs.writeFileSync(outputFile, outputHtml, "utf8");
      }
      console.log(`GENERATE language=${language} pages=${sourcePages.length}`);
    }
  } finally {
    await browser.close();
  }
  console.log("DONE");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
