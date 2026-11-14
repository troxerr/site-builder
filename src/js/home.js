import { initSlider } from "./slider.js";
import { leadForm } from "./lead-form.js";

initSlider();

// Keep the curated five in the same order on every visit.
document.querySelectorAll(".work-item:not(.wide)").forEach((li) => { li.hidden = false; });

// Plan buttons preselect the plan in the form
const plan = document.getElementById("plan");
document.querySelectorAll("[data-plan]").forEach((a) => a.addEventListener("click", () => { plan.value = a.getAttribute("data-plan"); }));

leadForm({
  idle: "Get my free draft",
  success: "Got it, thanks! I'll reply within 1–3 business days with a couple of quick questions. Nothing to pay unless you love your draft.",
  subject: (f) => {
    const p = f.plan.value;
    return (p.startsWith("Missed-call booking agent") ? "Booking agent inquiry: " : p.includes("text-back") ? "Text-back inquiry: " : "Free draft request: ") + f.business.value + " (" + p + ")";
  },
  redirect: (f) => (f.plan.value.startsWith("Missed-call booking agent") ? "/thanks/booking-agent/" : "/thanks/"),
});

