(() => {
  const language = document.documentElement.dataset.language || "en";
  const labels = { en:"English", fr:"Français", de:"Deutsch", es:"Español", pt:"Português", ar:"العربية", ru:"Русский" };
  const marker = "/language-preview/";
  const markerIndex = location.href.indexOf(marker);
  const previewBase = markerIndex >= 0 ? location.href.slice(0, markerIndex + marker.length) : "";
  const languageBase = `${previewBase}${language}/`;
  const localRoutes = [
    [/\bhome\b/i, ""], [/solutions?|material sourcing|logistics/i, "solutions/"], [/products?|catalog|browse components/i, "products/"],
    [/custom development|custom service|custom component|custom faceting/i, "custom-development/"], [/\bsamples?\b|request (a )?sample/i, "samples/"],
    [/quality control|material disclosure|\bquality\b/i, "quality/"], [/\babout\b|about donghai|sourcing partner/i, "about-donghai/"],
    [/frequently asked|\bfaq\b/i, "faq/"], [/design review|upload your design|start your design|request (a )?quote|submit project brief/i, "design-review/"],
    [/view (the )?product|technical spec|view specs|select component/i, "product/clear-quartz-cabochon/"]
  ];
  const localRouteFor = (label) => localRoutes.find(([pattern]) => pattern.test(label))?.[1];
  const translations = {
    fr:{"Solutions":"Solutions","Products":"Produits","Custom Development":"Développement sur mesure","Quality":"Qualité","About":"À propos","Submit Project Brief":"Envoyer votre projet","Technical Components Catalog":"Catalogue de composants techniques","Technical Sourcing Directory":"Répertoire d'approvisionnement technique","Reference specifications for precision crystal components. Use this directory to identify base materials and geometries for your custom manufacturing project.":"Spécifications de référence pour les composants en cristal de précision. Utilisez ce répertoire pour identifier les matériaux et géométries de base de votre projet.","Core Capabilities":"Expertises clés","Technical Benchmarks":"Références techniques","Require a Unique Specification?":"Besoin d'une spécification unique?","Submit Technical Drawings":"Envoyer les plans techniques"},
    de:{"Solutions":"Lösungen","Products":"Produkte","Custom Development":"Sonderanfertigung","Quality":"Qualität","About":"Über uns","Submit Project Brief":"Projektanfrage senden","Technical Components Catalog":"Katalog technischer Komponenten","Technical Sourcing Directory":"Technisches Beschaffungsverzeichnis","Reference specifications for precision crystal components. Use this directory to identify base materials and geometries for your custom manufacturing project.":"Referenzspezifikationen für präzise Kristallkomponenten. Nutzen Sie dieses Verzeichnis für Materialien und Geometrien Ihres Fertigungsprojekts.","Core Capabilities":"Kernkompetenzen","Technical Benchmarks":"Technische Referenzen","Require a Unique Specification?":"Benötigen Sie eine individuelle Spezifikation?","Submit Technical Drawings":"Technische Zeichnungen senden"},
    es:{"Solutions":"Soluciones","Products":"Productos","Custom Development":"Desarrollo a medida","Quality":"Calidad","About":"Nosotros","Submit Project Brief":"Enviar proyecto","Technical Components Catalog":"Catálogo de componentes técnicos","Technical Sourcing Directory":"Directorio de abastecimiento técnico","Reference specifications for precision crystal components. Use this directory to identify base materials and geometries for your custom manufacturing project.":"Especificaciones de referencia para componentes de cristal de precisión. Use este directorio para identificar materiales y geometrías para su proyecto.","Core Capabilities":"Capacidades principales","Technical Benchmarks":"Referencias técnicas","Require a Unique Specification?":"¿Necesita una especificación única?","Submit Technical Drawings":"Enviar planos técnicos"},
    pt:{"Solutions":"Soluções","Products":"Produtos","Custom Development":"Desenvolvimento personalizado","Quality":"Qualidade","About":"Sobre nós","Submit Project Brief":"Enviar projeto","Technical Components Catalog":"Catálogo de componentes técnicos","Technical Sourcing Directory":"Diretório de sourcing técnico","Reference specifications for precision crystal components. Use this directory to identify base materials and geometries for your custom manufacturing project.":"Especificações de referência para componentes de cristal de precisão. Use este diretório para identificar materiais e geometrias para o seu projeto.","Core Capabilities":"Capacidades principais","Technical Benchmarks":"Referências técnicas","Require a Unique Specification?":"Precisa de uma especificação única?","Submit Technical Drawings":"Enviar desenhos técnicos"},
    ar:{"Solutions":"الحلول","Products":"المنتجات","Custom Development":"تطوير مخصص","Quality":"الجودة","About":"من نحن","Submit Project Brief":"إرسال موجز المشروع","Technical Components Catalog":"كتالوج المكونات التقنية","Technical Sourcing Directory":"دليل التوريد التقني","Reference specifications for precision crystal components. Use this directory to identify base materials and geometries for your custom manufacturing project.":"مواصفات مرجعية لمكونات الكريستال الدقيقة. استخدم هذا الدليل لتحديد المواد والأشكال الأساسية لمشروع التصنيع الخاص بك.","Core Capabilities":"القدرات الأساسية","Technical Benchmarks":"المعايير التقنية","Require a Unique Specification?":"هل تحتاج إلى مواصفة فريدة؟","Submit Technical Drawings":"إرسال الرسومات التقنية"},
    ru:{"Solutions":"Решения","Products":"Продукция","Custom Development":"Индивидуальная разработка","Quality":"Качество","About":"О компании","Submit Project Brief":"Отправить проект","Technical Components Catalog":"Каталог технических компонентов","Technical Sourcing Directory":"Технический каталог поставок","Reference specifications for precision crystal components. Use this directory to identify base materials and geometries for your custom manufacturing project.":"Справочные спецификации для точных хрустальных компонентов. Используйте каталог для выбора материалов и геометрии для вашего проекта.","Core Capabilities":"Ключевые возможности","Technical Benchmarks":"Технические ориентиры","Require a Unique Specification?":"Нужна уникальная спецификация?","Submit Technical Drawings":"Отправить технические чертежи"}
  };
  const whatsappNumber = "8615252474087";
  const whatsappCopy = {
    en: {
      aria: "Chat with East Origin Gems on WhatsApp",
      message: "Hello East Origin Gems, I would like to discuss a B2B crystal sourcing inquiry."
    },
    fr: {
      aria: "Discuter avec East Origin Gems sur WhatsApp",
      message: "Bonjour East Origin Gems, je souhaite discuter d'une demande d'approvisionnement B2B en cristal."
    },
    de: {
      aria: "East Origin Gems über WhatsApp kontaktieren",
      message: "Hallo East Origin Gems, ich möchte eine B2B-Anfrage zur Beschaffung von Kristallkomponenten besprechen."
    },
    es: {
      aria: "Contactar con East Origin Gems por WhatsApp",
      message: "Hola East Origin Gems, me gustaría hablar sobre una consulta B2B de abastecimiento de componentes de cristal."
    },
    pt: {
      aria: "Falar com a East Origin Gems pelo WhatsApp",
      message: "Olá East Origin Gems, gostaria de conversar sobre uma consulta B2B de fornecimento de componentes de cristal."
    },
    ar: {
      aria: "تواصل مع East Origin Gems عبر واتساب",
      message: "مرحباً East Origin Gems، أود مناقشة طلب توريد مكونات كريستال للأعمال."
    },
    ru: {
      aria: "Связаться с East Origin Gems через WhatsApp",
      message: "Здравствуйте, East Origin Gems. Я хотел(а) бы обсудить B2B-запрос на поставку компонентов из кристалла."
    }
  };
  const addWhatsAppButton = () => {
    if (document.getElementById("eog-whatsapp-float")) return;
    const copy = whatsappCopy[language] || whatsappCopy.en;
    const style = document.createElement("style");
    style.textContent = `
      #eog-whatsapp-float {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 70;
        min-height: 54px;
        padding: 0 20px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        background: #25d366;
        color: #ffffff;
        font: 700 14px/1.2 Arial, sans-serif;
        text-decoration: none;
        direction: ltr;
        box-shadow: 0 10px 28px rgba(16, 74, 43, 0.28);
        transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
      }
      #eog-whatsapp-float:hover {
        background: #1fbd59;
        transform: translateY(-2px);
        box-shadow: 0 14px 34px rgba(16, 74, 43, 0.34);
      }
      #eog-whatsapp-float:focus-visible {
        outline: 3px solid #ffffff;
        outline-offset: 3px;
        box-shadow: 0 0 0 6px #167a3d;
      }
      #eog-whatsapp-float .material-symbols-outlined {
        font-size: 24px;
        line-height: 1;
      }
      @media (max-width: 640px) {
        #eog-whatsapp-float {
          right: 16px;
          bottom: 16px;
          width: 56px;
          height: 56px;
          min-height: 56px;
          padding: 0;
        }
        #eog-whatsapp-float .eog-whatsapp-label {
          display: none;
        }
      }
    `;
    document.head.append(style);
    const link = document.createElement("a");
    link.id = "eog-whatsapp-float";
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`${copy.message} Page: ${window.location.href}`)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", copy.aria);
    link.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">chat</span><span class="eog-whatsapp-label">WhatsApp</span>';
    document.body.append(link);
  };
  addWhatsAppButton();
  const dictionary = translations[language] || {};
  document.querySelectorAll("a, button").forEach((element) => {
    const label = (element.textContent || "").replace(/\s+/g, " ").trim();
    const route = localRouteFor(label);
    if (!route || !previewBase) return;
    const destination = `${languageBase}${route}`;
    if (element.tagName === "A") element.href = destination;
    else element.addEventListener("click", () => { location.href = destination; });
  });
  document.querySelectorAll("a, div, span").forEach((element) => {
    if ((element.textContent || "").replace(/\s+/g, " ").trim() === "DONGHAI CRYSTAL" && previewBase) {
      if (element.tagName === "A") element.href = languageBase;
      else { element.style.cursor = "pointer"; element.addEventListener("click", () => { location.href = languageBase; }); }
    }
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node=>{ const key=node.nodeValue.replace(/\s+/g," ").trim(); if(dictionary[key]) node.nodeValue=node.nodeValue.replace(key,dictionary[key]); });
  if(language==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl";document.body.style.textAlign="right";}
  const existing=[...document.querySelectorAll("a,button,span,div")].find(el=>(el.textContent||"").replace(/\s+/g," ").trim()==="EN/FR/DE");
  if(existing){const nav=document.createElement("nav");nav.style.cssText="display:flex;gap:7px;flex-wrap:wrap;font:11px JetBrains Mono,monospace";Object.entries(labels).forEach(([code,label])=>{const a=document.createElement("a");a.href=`${previewBase}${code}/`;a.textContent=code.toUpperCase();a.style.cssText=`color:#33253b;text-decoration:none;padding:5px 7px;border:1px solid ${code===language?"#33253b":"#ccc4cc"};${code===language?"background:#33253b;color:#fff;":""}`;a.title=label;nav.append(a)});existing.replaceWith(nav)};
})();
