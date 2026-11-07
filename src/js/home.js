import { initSlider } from "./slider.js";
import { leadForm } from "./lead-form.js";
import { shuffle } from "./shuffle.js";

initSlider();

// Featured demos: a random five, in random order, on each visit
const work = document.querySelector(".work"), wide = work && work.querySelector(".work-item.wide");
if (wide) {
  shuffle([...work.querySelectorAll(".work-item:not(.wide)")]).forEach((li, n) => { li.hidden = n >= 5; work.insertBefore(li, wide); });
}

// Plan buttons preselect the plan in the form
const plan = document.getElementById("plan");
document.querySelectorAll("[data-plan]").forEach((a) => a.addEventListener("click", () => { plan.value = a.getAttribute("data-plan"); }));

leadForm({
  idle: "Get my free draft",
  success: "Got it, thanks! I'll reply within one business day with a couple of quick questions. Nothing to pay unless you love your draft.",
  subject: (f) => {
    const p = f.plan.value;
    return (p.startsWith("Missed-call booking agent") ? "Booking agent inquiry: " : p.includes("text-back") ? "Text-back inquiry: " : "Free draft request: ") + f.business.value + " (" + p + ")";
  },
  redirect: (f) => (f.plan.value.startsWith("Missed-call booking agent") ? "/thanks/booking-agent/" : "/thanks/"),
});
