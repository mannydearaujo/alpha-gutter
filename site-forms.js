/* Quote forms for alphagutterco.com.
   Handles every <form data-quote-form="label">. Sends to Formspree, shows a real
   error (with call/text fallback) when the send fails, and reports lead events
   through window.alphaTrackLead from /site-tracking.js. */
(() => {
  const ENDPOINT = "https://formspree.io/f/mwvzegaj";
  const PHONE = "+15084965173";
  const PHONE_DISPLAY = "508-496-5173";

  const track = (name, label, extra) => {
    if (window.alphaTrackLead) window.alphaTrackLead(name, label, extra);
  };

  // Remember how the visitor arrived, so each lead says where it came from.
  const source = (() => {
    let saved = "";
    try { saved = sessionStorage.getItem("alpha_source") || ""; } catch (e) {}
    if (saved) return saved;
    const q = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"]
      .map(k => q.get(k)).filter(Boolean).join(" / ");
    let ref = "";
    try { ref = document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) {}
    if (ref === window.location.hostname) ref = "";
    const value = utm || ref || "direct";
    try { sessionStorage.setItem("alpha_source", value); } catch (e) {}
    return value;
  })();

  document.querySelectorAll("form[data-quote-form]").forEach(form => {
    const label = form.getAttribute("data-quote-form") || "quote form";
    const btn = form.querySelector('[type="submit"]');
    const okMsg = form.querySelector(".form-msg");
    const errMsg = form.querySelector(".form-err");
    const btnText = btn ? btn.textContent : "";
    let started = false;

    // Our own messages replace the browser bubbles; without JS the native checks still run.
    form.noValidate = true;

    const value = name => {
      const el = form.elements[name];
      return el ? (el.value || "").trim() : "";
    };

    const clearErrors = () => {
      if (errMsg) { errMsg.style.display = "none"; errMsg.textContent = ""; }
      form.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));
    };

    const showError = (nodes, fieldName) => {
      if (!errMsg) return;
      errMsg.textContent = "";
      nodes.forEach(n => errMsg.append(n));
      errMsg.style.display = "block";
      const el = fieldName && form.elements[fieldName];
      if (el) { el.setAttribute("aria-invalid", "true"); el.focus(); }
    };

    form.addEventListener("focusin", () => {
      if (started) return;
      started = true;
      track("quote_form_start", label);
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      clearErrors();

      const name = value("name");
      const phone = value("phone");
      const email = value("email");
      if (!name) { showError(["Add your name so we know who to ask for."], "name"); return; }
      if (phone.replace(/\D/g, "").length < 10) {
        showError(["Add a phone number with area code so we can call or text you back."], "phone");
        return;
      }

      // Hidden field real visitors never fill in. Bots do; drop those quietly.
      if (value("_gotcha")) { form.reset(); return; }

      const data = { Name: name, Phone: phone };
      const optional = {
        Company: "company", "Gutter Size": "gutter_size",
        "Job Town": "job_town", "Job Details": "details"
      };
      Object.keys(optional).forEach(key => {
        if (form.elements[optional[key]]) data[key] = value(optional[key]) || "—";
      });
      if (email) data.email = email;
      data.Page = window.location.pathname;
      data.Source = source;
      data._subject = "Quote request — " + name + (data["Job Town"] && data["Job Town"] !== "—" ? " (" + data["Job Town"] + ")" : "");

      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      const sent = () => {
        track("quote_request_submit", label);
        if (okMsg) okMsg.style.display = "block";
        if (btn) btn.textContent = "Request Sent ✓";
      };

      const failed = reason => {
        track("quote_request_error", label, { error_reason: reason });
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
        const lines = ["Quote request from " + name];
        ["Job Town", "Gutter Size", "Job Details"].forEach(key => {
          if (data[key] && data[key] !== "—") lines.push(key + ": " + data[key]);
        });
        const call = document.createElement("a");
        call.href = "tel:" + PHONE;
        call.textContent = "call " + PHONE_DISPLAY;
        call.setAttribute("data-track", "phone_tap");
        call.setAttribute("data-track-label", label + " error call");
        const text = document.createElement("a");
        text.href = "sms:" + PHONE + "?&body=" + encodeURIComponent(lines.join("\n"));
        text.textContent = "text us these details";
        text.setAttribute("data-track", "sms_tap");
        text.setAttribute("data-track-label", label + " error text");
        showError(["That did not send. Your details are still here: try again, ", call, " or ", text, "."]);
      };

      fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(response => { if (response.ok) sent(); else failed("http_" + response.status); })
        .catch(() => failed("network"));
    });
  });
})();
