(() => {
  const languages = {
    en: { code: "EN", name: "English", direction: "ltr" },
    fr: { code: "FR", name: "Français", direction: "ltr" },
    de: { code: "DE", name: "Deutsch", direction: "ltr" },
    es: { code: "ES", name: "Español", direction: "ltr" },
    pt: { code: "PT", name: "Português", direction: "ltr" },
    ar: { code: "AR", name: "العربية", direction: "rtl" },
    ru: { code: "RU", name: "Русский", direction: "ltr" }
  };
  const supported = Object.keys(languages);
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const activeLanguage = supported.includes(pathParts[0]) ? pathParts[0] : "en";
  const active = languages[activeLanguage];

  const routeWithoutLanguage = () => {
    const parts = [...pathParts];
    if (supported.includes(parts[0])) parts.shift();
    return `/${parts.length ? `${parts.join("/")}/` : ""}`;
  };

  const localizedRoute = (language) => {
    const route = routeWithoutLanguage();
    return language === "en" ? route : `/${language}${route}`;
  };

  const labels = {
    en: { choose: "Choose language", current: "Current language" },
    fr: { choose: "Choisir la langue", current: "Langue actuelle" },
    de: { choose: "Sprache auswählen", current: "Aktuelle Sprache" },
    es: { choose: "Elegir idioma", current: "Idioma actual" },
    pt: { choose: "Escolher idioma", current: "Idioma atual" },
    ar: { choose: "اختر اللغة", current: "اللغة الحالية" },
    ru: { choose: "Выбрать язык", current: "Текущий язык" }
  };

  const findLanguagePlaceholder = () => {
    const exact = [...document.querySelectorAll("button, a, span, div")].find((element) => {
      const text = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (text === "EN/FR/DE") return true;
      if (element.matches("[data-toast*='Language versions']")) return true;
      return text === "EN" && Boolean(element.querySelector(".material-symbols-outlined"));
    });
    return exact || null;
  };

  const createLanguageSwitcher = (mobile = false) => {
    const copy = labels[activeLanguage] || labels.en;
    const wrapper = document.createElement("div");
    wrapper.className = `eog-language-switcher${mobile ? " eog-language-switcher--mobile" : ""}`;
    wrapper.setAttribute("data-eog-language-switcher", "");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "eog-language-trigger";
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", `${copy.choose}. ${copy.current}: ${active.name}`);
    trigger.innerHTML = `
      <span class="material-symbols-outlined eog-language-globe" aria-hidden="true">language</span>
      <span class="eog-language-code">${active.code}</span>
      <span class="material-symbols-outlined eog-language-chevron" aria-hidden="true">expand_more</span>
    `;

    const menu = document.createElement("div");
    menu.className = "eog-language-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", copy.choose);
    menu.hidden = true;

    Object.entries(languages).forEach(([language, details]) => {
      const option = document.createElement("a");
      option.className = "eog-language-option";
      option.href = localizedRoute(language);
      option.lang = language;
      option.dir = details.direction;
      option.setAttribute("role", "menuitemradio");
      option.setAttribute("aria-checked", String(language === activeLanguage));
      option.innerHTML = `
        <span class="eog-language-name">${details.name}</span>
        <span class="eog-language-option-code">${details.code}</span>
        <span class="material-symbols-outlined eog-language-check" aria-hidden="true">check</span>
      `;
      menu.append(option);
    });

    const menuOptions = () => [...menu.querySelectorAll(".eog-language-option")];
    const closeMenu = (restoreFocus = false) => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      wrapper.classList.remove("is-open");
      if (restoreFocus) trigger.focus();
    };
    const openMenu = () => {
      document.querySelectorAll("[data-eog-language-switcher].is-open").forEach((other) => {
        if (other === wrapper) return;
        other.querySelector(".eog-language-menu").hidden = true;
        other.querySelector(".eog-language-trigger").setAttribute("aria-expanded", "false");
        other.classList.remove("is-open");
      });
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      wrapper.classList.add("is-open");
    };

    trigger.addEventListener("click", () => {
      if (menu.hidden) openMenu();
      else closeMenu();
    });
    trigger.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      openMenu();
      const options = menuOptions();
      const target = event.key === "ArrowDown" ? options[0] : options[options.length - 1];
      target?.focus();
    });
    menu.addEventListener("keydown", (event) => {
      const options = menuOptions();
      const index = options.indexOf(document.activeElement);
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = options.length - 1;
      if (event.key === "ArrowDown") next = (index + 1 + options.length) % options.length;
      if (event.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
      options[next]?.focus();
    });
    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) closeMenu();
    });

    wrapper.append(trigger, menu);
    return wrapper;
  };

  const addStyles = () => {
    if (document.getElementById("eog-language-styles")) return;
    const style = document.createElement("style");
    style.id = "eog-language-styles";
    style.textContent = `
      .eog-language-switcher {
        position: relative;
        display: inline-flex;
        flex: 0 0 auto;
        font-family: "Hanken Grotesk", Arial, sans-serif;
        line-height: 1.2;
        direction: ltr;
        z-index: 80;
      }
      .eog-language-trigger {
        min-height: 38px;
        padding: 0 10px;
        border: 1px solid #ccc4cc;
        border-radius: 4px;
        background: #fff;
        color: #33253b;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        font: 600 12px/1 "JetBrains Mono", monospace;
        letter-spacing: .04em;
      }
      .eog-language-trigger:hover {
        background: #f3f3f6;
        border-color: #7c757c;
      }
      .eog-language-trigger:focus-visible,
      .eog-language-option:focus-visible {
        outline: 2px solid #4a3b52;
        outline-offset: 2px;
      }
      .eog-language-globe {
        font-size: 18px;
      }
      .eog-language-chevron {
        font-size: 16px;
        transition: transform 160ms ease;
      }
      .eog-language-switcher.is-open .eog-language-chevron {
        transform: rotate(180deg);
      }
      .eog-language-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 236px;
        padding: 7px;
        border: 1px solid #ccc4cc;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 14px 34px rgba(51, 37, 59, .16);
        z-index: 999;
      }
      .eog-language-menu[hidden] {
        display: none !important;
      }
      .eog-language-option {
        min-height: 40px;
        padding: 0 10px;
        border-radius: 3px;
        display: grid;
        grid-template-columns: 1fr auto 20px;
        align-items: center;
        gap: 10px;
        color: #4a454b;
        text-decoration: none;
        font-size: 14px;
      }
      .eog-language-option:hover {
        background: #f3f3f6;
        color: #33253b;
      }
      .eog-language-option[aria-checked="true"] {
        background: #f1dbf9;
        color: #33253b;
        font-weight: 700;
      }
      .eog-language-option-code {
        color: #7c757c;
        font: 500 11px/1 "JetBrains Mono", monospace;
        letter-spacing: .05em;
      }
      .eog-language-check {
        font-size: 17px;
        visibility: hidden;
      }
      .eog-language-option[aria-checked="true"] .eog-language-check {
        visibility: visible;
      }
      .eog-language-switcher--mobile {
        display: none;
      }
      html[dir="rtl"] body {
        text-align: right;
      }
      html[dir="rtl"] input[type="email"],
      html[dir="rtl"] input[type="tel"],
      html[dir="rtl"] input[type="url"],
      html[dir="rtl"] input[type="number"],
      html[dir="rtl"] .technical-data,
      html[dir="rtl"] code {
        direction: ltr;
        text-align: left;
      }
      @media (max-width: 767px) {
        body {
          padding-top: 52px !important;
        }
        body::before {
          content: "";
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          height: 52px;
          z-index: 110;
          background: rgba(255, 255, 255, .98);
          border-bottom: 1px solid #e2e2e5;
        }
        body > header:first-of-type,
        body > nav:first-of-type {
          top: 52px !important;
        }
        .eog-language-switcher:not(.eog-language-switcher--mobile) {
          display: none !important;
        }
        .eog-language-switcher--mobile {
          position: fixed;
          top: 6px;
          right: 12px;
          display: inline-flex;
          z-index: 120;
        }
        .eog-language-switcher--mobile .eog-language-trigger {
          min-height: 40px;
          background: rgba(255, 255, 255, .96);
          box-shadow: 0 3px 12px rgba(51, 37, 59, .08);
        }
        .eog-language-switcher--mobile .eog-language-menu {
          position: fixed;
          top: 52px;
          right: 12px;
          left: auto;
          width: min(320px, calc(100vw - 24px));
          max-height: calc(100vh - 80px);
          overflow-y: auto;
        }
      }
    `;
    document.head.append(style);
  };

  const localizeNavigation = () => {
    if (activeLanguage === "en") return;
    document.querySelectorAll("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      const url = new URL(href, window.location.origin);
      const parts = url.pathname.split("/").filter(Boolean);
      if (supported.includes(parts[0])) parts.shift();
      url.pathname = `/${activeLanguage}/${parts.length ? `${parts.join("/")}/` : ""}`;
      anchor.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
    });
    document.querySelectorAll('input[name="_next"]').forEach((input) => {
      input.value = `${window.location.origin}/${activeLanguage}/thank-you/`;
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = activeLanguage;
    document.documentElement.dir = active.direction;
    addStyles();
    localizeNavigation();

    const placeholder = findLanguagePlaceholder();
    const desktop = createLanguageSwitcher();
    if (placeholder) placeholder.replaceWith(desktop);
    else {
      const headerTarget = document.querySelector("header .nav-actions, header nav, header");
      (headerTarget || document.body).append(desktop);
    }
    document.body.append(createLanguageSwitcher(true));
  });
})();
