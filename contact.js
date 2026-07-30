(() => {
  const recipient = "577300811@qq.com";
  const confirmationUrl = "https://east-origin-gems.pages.dev/thank-you/";
  const forms = [
    { selector: "#home-design-review-form", source: "Homepage Design Review" },
    { selector: "#intake-form", source: "Design Review" },
    { selector: "form[data-inquiry='sample']", source: "Sample Request" }
  ];

  const addHiddenField = (form, name, value) => {
    let field = form.querySelector(`input[name="${name}"]`);
    if (!field) {
      field = document.createElement("input");
      field.type = "hidden";
      field.name = name;
      form.append(field);
    }
    field.value = value;
  };

  document.addEventListener("DOMContentLoaded", () => {
    forms.forEach(({ selector, source }) => {
      const form = document.querySelector(selector);
      if (!form) return;

      form.action = `https://formsubmit.co/${recipient}`;
      form.method = "POST";
      form.acceptCharset = "UTF-8";
      addHiddenField(form, "_subject", `New B2B inquiry: ${source}`);
      addHiddenField(form, "_next", confirmationUrl);
      addHiddenField(form, "_template", "table");
      addHiddenField(form, "_captcha", "false");
      addHiddenField(form, "inquiry_source", source);

      form.addEventListener("submit", () => {
        const button = form.querySelector('button[type="submit"]');
        if (button && form.checkValidity()) {
          button.disabled = true;
          button.setAttribute("aria-busy", "true");
          button.textContent = "Sending inquiry鈥?;
        }
      });
    });
  });
})();
