/* Elite Roofing Solutions — demo instant price estimator */
(function () {
  "use strict";

  var form = document.getElementById("quote-form");
  if (!form) return;

  var addressInput = document.getElementById("quote-address");
  var addressError = document.querySelector('[data-error-for="address"]');
  var panel = document.getElementById("quote-panel");
  var display = document.getElementById("quote-address-display");
  var resetBtn = document.getElementById("quote-reset");
  var sampleBtn = document.getElementById("use-sample");
  var step1Copy = document.getElementById("quote-step1-copy");
  var size = document.getElementById("quote-size");
  var sizeValue = document.getElementById("quote-size-value");
  var material = document.getElementById("quote-material");
  var pitch = document.getElementById("quote-pitch");
  var rangeEl = document.getElementById("quote-range");
  var basisEl = document.getElementById("quote-basis");
  var perFt = document.getElementById("quote-per-ft");
  var monthly = document.getElementById("quote-monthly");
  var inspectionLink = document.getElementById("quote-inspection");

  var SAMPLE = "4821 Walnut Grove Rd, Memphis, TN 38117";
  var completed = false;
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  function setAddressError(message) {
    if (addressError) {
      addressError.textContent = message || "";
      addressError.classList.toggle("is-visible", Boolean(message));
    }
    if (addressInput) addressInput.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function round100(v) { return Math.round(v / 100) * 100; }

  function calc() {
    var sqft = Number(size.value) || 0;
    var opt = material.options[material.selectedIndex];
    var lowRate = parseFloat(opt.getAttribute("data-low")) || 0;
    var highRate = parseFloat(opt.getAttribute("data-high")) || 0;
    var mult = parseFloat(pitch.value) || 1;
    var low = round100(sqft * lowRate * mult);
    var high = round100(sqft * highRate * mult);

    if (sizeValue) sizeValue.textContent = sqft.toLocaleString("en-US");
    if (rangeEl) rangeEl.textContent = money.format(low) + " – " + money.format(high);
    if (basisEl) {
      basisEl.textContent = sqft.toLocaleString("en-US") + " sq ft · " +
        opt.textContent.trim() + " · " +
        pitch.options[pitch.selectedIndex].getAttribute("data-label") + " pitch";
    }
    if (perFt) perFt.textContent = "$" + (low / sqft).toFixed(2);
    if (monthly) monthly.textContent = money.format(Math.round(low / 60)) + "/mo";

    if (inspectionLink) {
      var address = display && display.textContent ? display.textContent : "";
      inspectionLink.href = "/demos/elite-roofing-solutions/get-an-estimate/?service=Roof+replacement&address=" + encodeURIComponent(address);
    }
  }

  function showEstimate(address) {
    if (display) display.textContent = address;
    if (form) form.hidden = true;
    if (step1Copy) step1Copy.hidden = true;
    if (panel) panel.hidden = false;
    calc();
    if (panel) {
      var heading = panel.querySelector("p");
      if (heading) heading.setAttribute("tabindex", "-1");
    }
    if (!completed) {
      completed = true;
      if (typeof window.eliteTrack === "function") {
        window.eliteTrack("quote_complete", {
          source: "demo_estimator",
          address_entered: Boolean(address),
          page: window.location.pathname
        });
      }
    }
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = (addressInput.value || "").trim();
    if (value.length < 5) {
      setAddressError("Enter the property address, including the city or ZIP.");
      addressInput.focus();
      return;
    }
    setAddressError("");
    showEstimate(value);
  });

  if (sampleBtn) {
    sampleBtn.addEventListener("click", function () {
      addressInput.value = SAMPLE;
      setAddressError("");
      showEstimate(SAMPLE);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (panel) panel.hidden = true;
      if (form) form.hidden = false;
      if (step1Copy) step1Copy.hidden = false;
      addressInput.value = "";
      setAddressError("");
      addressInput.focus();
      if (rangeEl) rangeEl.textContent = "—";
      if (basisEl) basisEl.textContent = "Enter an address to begin.";
      if (perFt) perFt.textContent = "—";
      if (monthly) monthly.textContent = "—";
    });
  }

  [size, material, pitch].forEach(function (el) {
    if (!el) return;
    el.addEventListener("input", calc);
    el.addEventListener("change", calc);
  });

  addressInput.addEventListener("input", function () { setAddressError(""); });

})();
