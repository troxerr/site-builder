/* Elite Roofing Solutions — inspection form */
(function () {
  "use strict";

  var form = document.getElementById("inspection-form");
  if (!form) return;

  var alertBox = document.getElementById("form-alert");
  var alertText = document.getElementById("form-alert-text");
  var submitBtn = document.getElementById("inspection-submit");
  var submitLabel = document.getElementById("submit-label");
  var spinner = document.getElementById("submit-spinner");
  var success = document.getElementById("inspection-success");
  var successCopy = document.getElementById("success-copy");
  var card = document.getElementById("inspection-card");

  var defaultLabel = submitLabel ? submitLabel.textContent : "Request a roof inspection";
  var isSubmitting = false;

  var rules = {
    name: function (v) {
      if (v.trim().length < 2) return "Please enter your name.";
      return "";
    },
    phone: function (v) {
      var digits = v.replace(/\D/g, "");
      if (!digits) return "Please enter a phone number.";
      if (digits.length < 10) return "Enter a 10-digit phone number.";
      return "";
    },
    email: function (v) {
      if (!v.trim()) return "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Enter a valid email address, or leave it blank.";
      return "";
    },
    address: function (v) {
      if (v.trim().length < 5) return "Enter the property address, including the city or ZIP.";
      return "";
    },
    message: function (v) {
      if (v.trim().length < 10) return "Tell us a little about the roof — at least a sentence.";
      return "";
    }
  };

  function fieldEl(name) {
    return form.elements[name];
  }

  function errorEl(name) {
    return document.querySelector('[data-error-for="' + name + '"]');
  }

  function setError(name, message) {
    var input = fieldEl(name);
    var el = errorEl(name);
    if (el) {
      el.textContent = message || "";
      el.classList.toggle("is-visible", Boolean(message));
    }
    if (input && input.setAttribute) {
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  function clearErrors() {
    Object.keys(rules).forEach(function (name) { setError(name, ""); });
    if (alertBox) alertBox.classList.remove("is-visible");
  }

  function validate() {
    var errors = {};
    Object.keys(rules).forEach(function (name) {
      var input = fieldEl(name);
      if (!input) return;
      var message = rules[name](input.value || "");
      if (message) {
        errors[name] = message;
        setError(name, message);
      } else {
        setError(name, "");
      }
    });
    return errors;
  }

  function showAlert(message) {
    if (!alertBox) return;
    if (alertText) alertText.textContent = message;
    alertBox.classList.add("is-visible");
  }

  function setSubmitting(state) {
    isSubmitting = state;
    if (!submitBtn) return;
    submitBtn.setAttribute("aria-busy", state ? "true" : "false");
    submitBtn.disabled = state;
    if (spinner) spinner.hidden = !state;
    if (submitLabel) submitLabel.textContent = state ? "Sending…" : defaultLabel;
  }

  function payload() {
    return {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      address: form.elements.address.value.trim(),
      message: form.elements.message.value.trim(),
      service: form.getAttribute("data-service") || form.elements.service.value || "",
      context: form.getAttribute("data-context") || "",
      company_website: form.elements.company_website ? form.elements.company_website.value : "",
      page: window.location.pathname + window.location.search,
      submittedAt: new Date().toISOString()
    };
  }

  function showSuccess() {
    if (form) form.hidden = true;
    var chip = document.getElementById("service-context");
    if (chip) chip.hidden = true;
    if (alertBox) alertBox.classList.remove("is-visible");
    if (success) {
      success.hidden = false;
      success.focus({ preventScroll: true });
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (typeof window.eliteTrack === "function") {
      window.eliteTrack("inspection_request", {
        context: form.getAttribute("data-context") || "",
        service: form.getAttribute("data-service") || "",
        page: window.location.pathname
      });
    }
  }

  function fail(message, retry) {
    showAlert(message);
    setSubmitting(false);
    if (retry && submitLabel) {
      submitLabel.textContent = "Try again";
    }
    if (alertBox) alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isSubmitting) return;

    clearErrors();
    var errors = validate();
    var names = Object.keys(errors);
    if (names.length) {
      var first = fieldEl(names[0]);
      if (first) first.focus();
      showAlert("Please check the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setError("message", "");

    // Demo site: nothing is sent anywhere. Show the success panel with a plain "demo only" message.
    window.setTimeout(function () { setSubmitting(false); showSuccess(); }, 400);
  });

  form.addEventListener("input", function (event) {
    var name = event.target.name;
    if (name && rules[name]) setError(name, "");
  });


  /* Prefill from links: /get-an-estimate?address=...&service=... */
  try {
    var params = new URLSearchParams(window.location.search);
    var prefillAddress = params.get("address");
    var prefillService = params.get("service");
    if (prefillAddress && form.elements.address && !form.elements.address.value) {
      form.elements.address.value = prefillAddress;
    }
    if (prefillService) {
      form.setAttribute("data-service", prefillService);
      var ctx = document.getElementById("service-context");
      if (ctx) {
        ctx.hidden = false;
        ctx.innerHTML = "Requesting: <strong>" + prefillService.replace(/\+/g, " ") + "</strong>";
      }
    }
  } catch (e) {}

  if (successCopy) {
    successCopy.innerHTML = 'This is a demo site, so your request didn\u2019t go anywhere. On the live site it would reach Elite right away. To reach them now, call <strong>(901) 435-6250</strong>.';
  }
})();
