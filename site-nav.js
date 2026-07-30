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

  const routeFor = (text) => routes.find(([pattern]) => pattern.test(text))?.[1];

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a, div, span").forEach((element) => {
      if ((element.textContent || "").replace(/\s+/g, " ").trim() !== "DONGHAI CRYSTAL") return;
      if (element.querySelector("a, div, span")) return;
      if (element.tagName === "A") {
        element.setAttribute("href", "/");
        return;
      }
      element.setAttribute("role", "link");
      element.setAttribute("tabindex", "0");
      element.classList.add("cursor-pointer");
      const goHome = () => { window.location.href = "/"; };
      element.addEventListener("click", goHome);
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goHome();
        }
      });
    });

    document.querySelectorAll("a[href='#'], button").forEach((element) => {
      const label = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (/whatsapp/i.test(label)) {
        const destination = whatsappUrl(`Hello Donghai Crystal, I would like to discuss a B2B sourcing inquiry. Page: ${window.location.href}`);
        if (element.tagName === "A") {
          element.setAttribute("href", destination);
          element.setAttribute("target", "_blank");
          element.setAttribute("rel", "noopener noreferrer");
        } else {
          element.addEventListener("click", () => { window.open(destination, "_blank", "noopener,noreferrer"); });
        }
        return;
      }
      const destination = routeFor(label);
      if (!destination) return;
      if (element.tagName === "A") element.setAttribute("href", destination);
      else element.addEventListener("click", () => { window.location.href = destination; });
    });
  });
})();

