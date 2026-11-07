import { leadForm } from "./lead-form.js";

// Missed-call calculator: every number comes from the visitor's inputs; 4.33 weeks a month.
const FEE = 1000;
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const pairs = ["calls", "share", "value"].map((k) => {
  const num = document.getElementById("c-" + k), range = document.getElementById("c-" + k + "-r");
  range.addEventListener("input", () => { num.value = range.value; calc(); });
  num.addEventListener("input", () => { range.value = num.value; calc(); });
  return num;
});
function calc() {
  const calls = Math.max(0, +pairs[0].value || 0), share = Math.min(100, Math.max(0, +pairs[1].value || 0)), value = Math.max(0, +pairs[2].value || 0);
  const callers = Math.round(calls * 4.33 * share / 100);
  document.getElementById("o-callers").textContent = Math.round(callers);
  document.getElementById("o-value").textContent = money(callers * value);
  const even = document.getElementById("o-even");
  if (value > 0) {
    const n = Math.ceil(FEE / value);
    even.innerHTML = "The agent's monthly fee is covered once it books <b>" + n + " visit" + (n === 1 ? "" : "s") + "</b> a month that would otherwise have gone to voicemail.";
  } else {
    even.textContent = "Enter what a booked visit is worth to see how many bookings cover the monthly fee.";
  }
}
calc();

leadForm({
  idle: "See if it fits my office",
  success: "Got it, thanks! I'll reply within one business day to set up a short call about your phones and calendar.",
  subject: (f) => "Booking agent inquiry: " + f.business.value + " (" + f.software.value + ")",
  redirect: () => "/thanks/booking-agent/",
});
