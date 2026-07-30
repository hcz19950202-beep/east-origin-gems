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
