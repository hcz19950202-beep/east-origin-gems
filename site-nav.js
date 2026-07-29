(() => {
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

  const routeFor = (text) => routes.find(([pattern]) => pattern.test(text))?.[1];

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[href='#'], button").forEach((element) => {
      const destination = routeFor((element.textContent || "").replace(/\s+/g, " ").trim());
      if (!destination) return;
      if (element.tagName === "A") element.setAttribute("href", destination);
      else element.addEventListener("click", () => { window.location.href = destination; });
    });
  });
})();

