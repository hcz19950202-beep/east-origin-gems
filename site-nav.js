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

  const addWhatsAppButton = () => {
    if (document.getElementById("eog-whatsapp-float")) return;

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
    link.href = whatsappUrl(`Hello East Origin Gems, I would like to discuss a B2B crystal sourcing inquiry. Page: ${window.location.href}`);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Chat with East Origin Gems on WhatsApp");
    link.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">chat</span><span class="eog-whatsapp-label">WhatsApp</span>';
    document.body.append(link);
  };

  document.addEventListener("DOMContentLoaded", () => {
    addWhatsAppButton();

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
