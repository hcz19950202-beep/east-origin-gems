(() => {
  const languages = {
    en: {
      products: "Products",
      development: "Custom Development",
      samples: "Samples",
      quality: "Quality",
      about: "About",
      cta: "Upload Your Design",
      menu: "Open navigation"
    },
    fr: {
      products: "Produits",
      development: "Développement sur mesure",
      samples: "Échantillons",
      quality: "Qualité",
      about: "À propos",
      cta: "Télécharger votre design",
      menu: "Ouvrir la navigation"
    },
    de: {
      products: "Produkte",
      development: "Kundenspezifische Entwicklung",
      samples: "Muster",
      quality: "Qualität",
      about: "Über uns",
      cta: "Design hochladen",
      menu: "Navigation öffnen"
    },
    es: {
      products: "Productos",
      development: "Desarrollo personalizado",
      samples: "Muestras",
      quality: "Calidad",
      about: "Acerca de",
      cta: "Subir su diseño",
      menu: "Abrir navegación"
    },
    pt: {
      products: "Produtos",
      development: "Desenvolvimento personalizado",
      samples: "Amostras",
      quality: "Qualidade",
      about: "Sobre",
      cta: "Enviar seu design",
      menu: "Abrir navegação"
    },
    ar: {
      products: "المنتجات",
      development: "تطوير مخصص",
      samples: "العينات",
      quality: "الجودة",
      about: "من نحن",
      cta: "ارفع تصميمك",
      menu: "فتح قائمة التنقل"
    },
    ru: {
      products: "Продукты",
      development: "Индивидуальная разработка",
      samples: "Образцы",
      quality: "Качество",
      about: "О нас",
      cta: "Загрузить дизайн",
      menu: "Открыть навигацию"
    }
  };

  const supported = Object.keys(languages);
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const language = supported.includes(pathParts[0]) ? pathParts.shift() : "en";
  const copy = languages[language];
  const prefix = language === "en" ? "" : `/${language}`;
  const route = `/${pathParts.join("/")}${pathParts.length ? "/" : ""}`;
  const localized = (path) => `${prefix}${path}`;

  const activeKey = (() => {
    if (route.startsWith("/products/") || route.startsWith("/product/")) return "products";
    if (route.startsWith("/custom-development/")) return "development";
    if (route.startsWith("/samples/")) return "samples";
    if (route.startsWith("/quality/")) return "quality";
    if (route.startsWith("/about-donghai/")) return "about";
    return "";
  })();

  const navItems = [
    ["products", "/products/"],
    ["development", "/custom-development/"],
    ["samples", "/samples/"],
    ["quality", "/quality/"],
    ["about", "/about-donghai/"]
  ];

  const addFontLink = () => {
    if (document.getElementById("eog-unified-fonts")) return;
    const link = document.createElement("link");
    link.id = "eog-unified-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.append(link);
  };

  const addStyles = () => {
    if (document.getElementById("eog-unified-header-styles")) return;
    const style = document.createElement("style");
    style.id = "eog-unified-header-styles";
    style.textContent = `
      body.eog-unified-typography {
        font-family: "Hanken Grotesk", Arial, sans-serif !important;
      }
      body.eog-unified-typography main h1,
      body.eog-unified-typography main h2,
      body.eog-unified-typography main h3,
      body.eog-unified-typography main h4 {
        font-family: "Source Serif 4", Georgia, serif !important;
      }
      body.eog-unified-typography .font-label-caps,
      body.eog-unified-typography .font-technical-data {
        font-family: "JetBrains Mono", Consolas, monospace !important;
      }
      .eog-site-header,
      .eog-site-header * {
        box-sizing: border-box;
      }
      .eog-site-header {
        position: sticky;
        top: 0;
        z-index: 60;
        width: 100%;
        min-height: 72px;
        border-bottom: 1px solid #ccc4cc;
        background: rgba(250, 249, 252, .96);
        color: #33253b;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      .eog-header-inner {
        width: 100%;
        max-width: 1440px;
        min-height: 71px;
        margin: 0 auto;
        padding: 0 64px;
        display: grid;
        grid-template-columns: minmax(250px, 1fr) auto minmax(250px, 1fr);
        align-items: center;
        gap: 28px;
      }
      .eog-header-brand {
        color: #33253b;
        font: 700 28px/1.1 "Source Serif 4", Georgia, serif;
        letter-spacing: -.02em;
        text-decoration: none;
        white-space: nowrap;
      }
      .eog-header-nav {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 32px;
      }
      .eog-header-link {
        position: relative;
        padding: 27px 0 24px;
        color: #4a454b;
        font: 500 12px/1.2 "JetBrains Mono", Consolas, monospace;
        letter-spacing: .04em;
        text-decoration: none;
        white-space: nowrap;
        transition: color 160ms ease;
      }
      .eog-header-link:hover,
      .eog-header-link:focus-visible,
      .eog-header-link.is-active {
        color: #33253b;
      }
      .eog-header-link.is-active {
        font-weight: 700;
      }
      .eog-header-link.is-active::after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 20px;
        left: 0;
        height: 2px;
        background: #33253b;
      }
      .eog-header-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;
      }
      .eog-language-placeholder {
        min-height: 38px;
        padding: 0 12px;
        border: 1px solid #ccc4cc;
        border-radius: 4px;
        background: #fff;
        color: #33253b;
        font: 700 12px/1 "JetBrains Mono", Consolas, monospace;
      }
      .eog-header-cta {
        min-height: 38px;
        padding: 0 20px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #4a3b52;
        color: #fff;
        font: 700 12px/1.2 "JetBrains Mono", Consolas, monospace;
        letter-spacing: .02em;
        text-decoration: none;
        white-space: nowrap;
        transition: background 160ms ease, transform 160ms ease;
      }
      .eog-header-cta:hover {
        background: #33253b;
        transform: translateY(-1px);
      }
      .eog-header-link:focus-visible,
      .eog-header-brand:focus-visible,
      .eog-header-cta:focus-visible,
      .eog-menu-toggle:focus-visible {
        outline: 2px solid #4a3b52;
        outline-offset: 3px;
      }
      .eog-menu-toggle,
      .eog-mobile-panel {
        display: none;
      }
      html[dir="rtl"] .eog-header-inner {
        direction: rtl;
      }
      @media (max-width: 1180px) {
        .eog-header-inner {
          padding: 0 32px;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
        }
        .eog-header-nav {
          gap: 20px;
        }
        .eog-header-link {
          font-size: 11px;
        }
        .eog-header-cta {
          padding: 0 14px;
        }
      }
      @media (max-width: 900px) {
        body.eog-unified-typography {
          padding-top: 0 !important;
        }
        body.eog-unified-typography::before {
          display: none !important;
        }
        body.eog-unified-typography > .eog-site-header {
          top: 0 !important;
        }
        .eog-site-header {
          min-height: 64px;
        }
        .eog-header-inner {
          min-height: 63px;
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
        }
        .eog-header-brand {
          font-size: 22px;
        }
        .eog-header-nav,
        .eog-header-actions .eog-header-cta {
          display: none;
        }
        .eog-header-actions {
          position: absolute;
          top: 12px;
          right: 68px;
          display: flex;
        }
        .eog-site-header .eog-header-actions .eog-language-switcher {
          display: inline-flex !important;
        }
        body.eog-unified-typography > .eog-language-switcher--mobile {
          display: none !important;
        }
        .eog-menu-toggle {
          width: 42px;
          height: 42px;
          margin-inline-start: auto;
          border: 1px solid #ccc4cc;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #33253b;
        }
        .eog-menu-toggle .material-symbols-outlined {
          font-size: 23px;
        }
        .eog-mobile-panel {
          padding: 8px 16px 18px;
          border-top: 1px solid #e2dce3;
          background: #faf9fc;
        }
        .eog-mobile-panel.is-open {
          display: grid;
          gap: 2px;
        }
        .eog-mobile-panel .eog-header-link {
          padding: 13px 4px;
          border-bottom: 1px solid #e2dce3;
          font-size: 12px;
        }
        .eog-mobile-panel .eog-header-link.is-active::after {
          top: 11px;
          right: auto;
          bottom: 11px;
          left: -8px;
          width: 2px;
          height: auto;
        }
        .eog-mobile-panel .eog-header-cta {
          margin-top: 12px;
          min-height: 44px;
        }
        html[dir="rtl"] .eog-header-actions {
          right: auto;
          left: 68px;
        }
      }
    `;
    document.head.append(style);
  };

  const linkMarkup = ([key, href], mobile = false) => {
    const active = key === activeKey;
    return `<a class="eog-header-link${active ? " is-active" : ""}" href="${localized(href)}"${active ? ' aria-current="page"' : ""}>${copy[key]}</a>`;
  };

  const render = () => {
    const candidates = [...document.querySelectorAll("body > header, body > nav, body > header > nav")];
    const existing = candidates.find((element) => /DONGHAI CRYSTAL/i.test(element.textContent || ""));
    if (!existing || existing.dataset.eogUnifiedHeader === "true") return;

    addFontLink();
    addStyles();
    document.body.classList.add("eog-unified-typography");

    const header = document.createElement("header");
    header.className = "eog-site-header";
    header.dataset.eogUnifiedHeader = "true";
    header.innerHTML = `
      <div class="eog-header-inner">
        <a class="eog-header-brand" href="${localized("/")}">DONGHAI CRYSTAL</a>
        <nav class="eog-header-nav" aria-label="Primary navigation">
          ${navItems.map((item) => linkMarkup(item)).join("")}
        </nav>
        <div class="eog-header-actions">
          <button class="eog-language-placeholder" type="button">EN/FR/DE</button>
          <a class="eog-header-cta" href="${localized("/design-review/")}">${copy.cta}</a>
        </div>
        <button class="eog-menu-toggle" type="button" aria-expanded="false" aria-controls="eog-mobile-panel" aria-label="${copy.menu}">
          <span class="material-symbols-outlined" aria-hidden="true">menu</span>
        </button>
      </div>
      <nav class="eog-mobile-panel" id="eog-mobile-panel" aria-label="Mobile navigation">
        ${navItems.map((item) => linkMarkup(item, true)).join("")}
        <a class="eog-header-cta" href="${localized("/design-review/")}">${copy.cta}</a>
      </nav>
    `;

    existing.replaceWith(header);

    const toggle = header.querySelector(".eog-menu-toggle");
    const panel = header.querySelector(".eog-mobile-panel");
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
      toggle.querySelector(".material-symbols-outlined").textContent = "menu";
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
      toggle.querySelector(".material-symbols-outlined").textContent = open ? "menu" : "close";
    });
    panel.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
