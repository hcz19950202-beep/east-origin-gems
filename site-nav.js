(() => {
  const whatsappNumber = "8615252474087";
  const whatsappUrl = (text) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text || "Hello, I would like to discuss a B2B crystal sourcing inquiry.")}`;
  const routes = [
    [/\bhome\b/i, "/"],
    [/solutions?|material sourcing|logistics/i, "/solutions/"],
    [/products?|catalog|browse components/i, "/products/"],
    [/custom development|custom service|custom component|custom faceting/i, "/custom-development/"],
    [/\bsamples?\b|request (a )?sample/i, "/samples/"],
    [/quality control|material disclosure|\bquality\b/i, "/quality/"],
    [/\babout\b|about donghai|sourcing partner/i, "/about-donghai/"],
    [/frequently asked|\bfaq\b/i, "/faq/"],
    [/design review|upload your design|start your design|request (a )?quote/i, "/design-review/"],
    [/view (the )?product|technical spec|view specs|select component/i, "/product/clear-quartz-cabochon/"]
  ];

  const translations = {
    fr: {
      "Solutions": "Solutions", "Products": "Produits", "Custom Development": "D茅veloppement sur mesure", "Samples": "脡chantillons", "Quality": "Qualit茅", "About": "脌 propos",
      "Submit Project Brief": "Envoyer votre projet", "Upload Your Design": "T茅l茅verser votre design", "Request a Sample": "Demander un 茅chantillon",
      "Technical Components Catalog": "Catalogue de composants techniques", "Technical Sourcing Directory": "R茅pertoire d'approvisionnement technique",
      "Core Capabilities": "Expertises cl茅s", "Technical Benchmarks": "R茅f茅rences techniques", "Design Review Intake": "Demande d'茅tude de conception",
      "Primary Contact Name *": "Nom du contact principal *", "Corporate Email *": "E-mail professionnel *", "Brand / Organization": "Marque / Organisation",
      "Region of Operation": "R茅gion d'activit茅", "Expected Annual Quantity (Units)": "Quantit茅 annuelle pr茅vue (unit茅s)",
      "Drop files here or click to browse": "D茅posez les fichiers ici ou cliquez pour parcourir", "No file selected": "Aucun fichier s茅lectionn茅",
      "CONTINUE TO MATERIAL SPECS": "CONTINUER VERS LES SP脡CIFICATIONS", "B2B Feasibility Review": "脡tude de faisabilit茅 B2B",
      "Require a Unique Specification?": "Besoin d'une sp茅cification unique?", "Submit Technical Drawings": "Envoyer les plans techniques"
    },
    de: {
      "Solutions": "L枚sungen", "Products": "Produkte", "Custom Development": "Sonderanfertigung", "Samples": "Muster", "Quality": "Qualit盲t", "About": "脺ber uns",
      "Submit Project Brief": "Projektanfrage senden", "Upload Your Design": "Design hochladen", "Request a Sample": "Muster anfordern",
      "Technical Components Catalog": "Katalog technischer Komponenten", "Technical Sourcing Directory": "Technisches Beschaffungsverzeichnis",
      "Core Capabilities": "Kernkompetenzen", "Technical Benchmarks": "Technische Referenzen", "Design Review Intake": "Anfrage zur Designpr眉fung",
      "Primary Contact Name *": "Name der Hauptansprechperson *", "Corporate Email *": "Gesch盲ftliche E-Mail *", "Brand / Organization": "Marke / Unternehmen",
      "Region of Operation": "Einsatzregion", "Expected Annual Quantity (Units)": "Erwartete Jahresmenge (St眉ck)",
      "Drop files here or click to browse": "Dateien hier ablegen oder zum Ausw盲hlen klicken", "No file selected": "Keine Datei ausgew盲hlt",
      "CONTINUE TO MATERIAL SPECS": "WEITER ZU MATERIALSPEZIFIKATIONEN", "B2B Feasibility Review": "B2B-Machbarkeitspr眉fung",
      "Require a Unique Specification?": "Ben枚tigen Sie eine individuelle Spezifikation?", "Submit Technical Drawings": "Technische Zeichnungen senden"
    }
  };

  const routeFor = (text) => routes.find(([pattern]) => pattern.test(text))?.[1];

  const setupTranslations = () => {
    const translatableNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        const key = node.nodeValue.replace(/\s+/g, " ").trim();
        if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName) || !translations.fr[key]) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      translatableNodes.push({ node, original: node.nodeValue, key: node.nodeValue.replace(/\s+/g, " ").trim() });
    }

    let language = localStorage.getItem("donghai-language") || "en";
    const triggers = [...document.querySelectorAll("a, button, span, div")].filter((element) =>
      (element.textContent || "").replace(/\s+/g, " ").trim() === "EN/FR/DE"
    );
    if (!triggers.length) return;

    const menu = document.createElement("div");
    menu.className = "donghai-language-menu";
    menu.hidden = true;
    menu.innerHTML = '<button type="button" data-language="en">English</button><button type="button" data-language="fr">Fran莽ais</button><button type="button" data-language="de">Deutsch</button>';
    document.body.append(menu);

    const applyLanguage = (nextLanguage) => {
      language = nextLanguage;
      localStorage.setItem("donghai-language", language);
      document.documentElement.lang = language;
      const dictionary = translations[language] || {};
      translatableNodes.forEach(({ node, original, key }) => {
        const leading = original.match(/^\s*/)[0];
        const trailing = original.match(/\s*$/)[0];
        node.nodeValue = `${leading}${dictionary[key] || key}${trailing}`;
      });
      triggers.forEach((trigger) => { trigger.textContent = language.toUpperCase(); trigger.setAttribute("aria-label", "Select language"); });
      menu.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
    };

    triggers.forEach((trigger) => {
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.classList.add("cursor-pointer");
      const toggle = () => {
        const rect = trigger.getBoundingClientRect();
        menu.style.top = `${rect.bottom + 8}px`;
        menu.style.left = `${Math.max(12, rect.right - 132)}px`;
        menu.hidden = !menu.hidden;
      };
      trigger.addEventListener("click", toggle);
      trigger.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } });
    });
    menu.addEventListener("click", (event) => {
      const selected = event.target.closest("button[data-language]");
      if (!selected) return;
      applyLanguage(selected.dataset.language);
      menu.hidden = true;
    });
    document.addEventListener("click", (event) => { if (!menu.contains(event.target) && !triggers.includes(event.target)) menu.hidden = true; });

    const style = document.createElement("style");
    style.textContent = '.donghai-language-menu{position:fixed;z-index:1000;min-width:132px;padding:6px;background:#fff;border:1px solid #ccc4cc;box-shadow:0 10px 26px rgba(26,28,30,.16)}.donghai-language-menu button{display:block;width:100%;padding:9px 10px;border:0;background:transparent;text-align:left;color:#33253b;font:500 12px "JetBrains Mono",monospace;cursor:pointer}.donghai-language-menu button:hover,.donghai-language-menu button[aria-pressed="true"]{background:#f3f3f6}';
    document.head.append(style);
    applyLanguage(language);
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a, div, span").forEach((element) => {
      if ((element.textContent || "").replace(/\s+/g, " ").trim() !== "DONGHAI CRYSTAL") return;
      if (element.querySelector("a, div, span")) return;
      if (element.tagName === "A") { element.setAttribute("href", "/"); return; }
      element.setAttribute("role", "link");
      element.setAttribute("tabindex", "0");
      element.classList.add("cursor-pointer");
      const goHome = () => { window.location.href = "/"; };
      element.addEventListener("click", goHome);
      element.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); goHome(); } });
    });

    document.querySelectorAll("a[href='#'], button").forEach((element) => {
      const label = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (/whatsapp/i.test(label)) {
        const destination = whatsappUrl(`Hello Donghai Crystal, I would like to discuss a B2B sourcing inquiry. Page: ${window.location.href}`);
        if (element.tagName === "A") { element.setAttribute("href", destination); element.setAttribute("target", "_blank"); element.setAttribute("rel", "noopener noreferrer"); }
        else element.addEventListener("click", () => { window.open(destination, "_blank", "noopener,noreferrer"); });
        return;
      }
      const destination = routeFor(label);
      if (!destination) return;
      if (element.tagName === "A") element.setAttribute("href", destination);
      else element.addEventListener("click", () => { window.location.href = destination; });
    });
    setupTranslations();
  });
})();

