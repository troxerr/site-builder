import { initSlider } from "./slider.js";
import { leadForm } from "./lead-form.js";

initSlider();

// Keep the curated five in the same order on every visit.
document.querySelectorAll(".work-item:not(.wide)").forEach((li) => { li.hidden = false; });

// Plan buttons preselect the plan in the form
const plan = document.getElementById("plan");
const formTitle = document.getElementById("contact-form-title");
const contactTitle = document.getElementById("contact-title");
const contactKicker = document.getElementById("contact-kicker");
const contactIntro = document.getElementById("contact-intro");
const websiteSteps = document.getElementById("contact-website-steps");
const textbackSteps = document.getElementById("contact-textback-steps");
const submit = plan.form.querySelector('button[type="submit"]');
const websiteIntro = contactIntro.textContent;

function updateInquiry() {
  const textback = plan.value.startsWith("Missed-call text-back");
  const booking = plan.value.startsWith("Missed-call booking agent");
  const phoneService = textback || booking;
  const service = booking ? "booking agent" : "text-back";
  contactKicker.textContent = phoneService ? "Phone workflow" : "Website design";
  contactTitle.textContent = phoneService ? `See how ${service} would work for you.` : "Get your free working draft.";
  contactIntro.textContent = phoneService ? "Tell me how your business handles calls today. I’ll show you a realistic example and check what would work with your setup." : websiteIntro;
  formTitle.textContent = phoneService ? `Request a ${service} demo` : "Request my free draft";
  if (!submit.disabled) submit.textContent = phoneService ? `Request my ${service} demo` : "Get my free draft";
  websiteSteps.hidden = phoneService;
  textbackSteps.hidden = !phoneService;
}

plan.addEventListener("change", updateInquiry);
window.addEventListener("pageshow", updateInquiry);
document.querySelectorAll("[data-plan]").forEach((link) => link.addEventListener("click", () => {
  plan.value = link.dataset.plan;
  updateInquiry();
}));
updateInquiry();

const exampleControls = document.querySelector(".textback-switch");
const examples = exampleControls.querySelectorAll("button");
const transcripts = document.querySelectorAll("[data-textback-transcript]");
exampleControls.hidden = false;
examples.forEach((button) => button.addEventListener("click", () => {
  examples.forEach((example) => example.setAttribute("aria-pressed", String(example === button)));
  transcripts.forEach((transcript) => {
    transcript.hidden = transcript.dataset.textbackTranscript !== button.dataset.textbackExample;
  });
}));

const consent = document.getElementById("sms-consent");
const mobile = document.getElementById("sms-mobile");

function mobileE164(value) {
  const digits = value.trim().replace(/[\s().-]/g, "");
  if (/^(?:\+?1)?[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return "+1" + digits.slice(-10);
  return "";
}

function validateSms() {
  mobile.required = consent.checked;
  const invalid = consent.checked && mobile.value.trim() && !mobileE164(mobile.value);
  mobile.setCustomValidity(invalid ? "Enter a valid US mobile number, or uncheck SMS consent." : "");
}

consent.addEventListener("change", validateSms);
mobile.addEventListener("input", validateSms);
window.addEventListener("pageshow", validateSms);
consent.form.addEventListener("reset", () => queueMicrotask(validateSms));
consent.form.addEventListener("formdata", ({ formData }) => {
  if (consent.checked) {
    formData.set("sms_mobile", mobileE164(mobile.value));
    formData.set("sms_consent_at", new Date().toISOString());
  } else {
    formData.set("sms_consent", "no");
    formData.delete("sms_mobile");
    formData.delete("sms_disclosure");
    formData.delete("sms_disclosure_version");
    formData.delete("sms_source");
  }
});
consent.disabled = false;
validateSms();

leadForm({
  idle: "Get my free draft",
  success: "Got it, thanks! I'll reply within 1–3 business days with a couple of quick questions. Nothing to pay unless you love your draft.",
  subject: (f) => {
    const p = f.plan.value;
    return (p.startsWith("Missed-call booking agent") ? "Booking agent inquiry: " : p.includes("text-back") ? "Text-back inquiry: " : "Free draft request: ") + f.business.value + " (" + p + ")";
  },
  redirect: (f) => (f.plan.value.startsWith("Missed-call booking agent") ? "/thanks/booking-agent/" : "/thanks/"),
});

