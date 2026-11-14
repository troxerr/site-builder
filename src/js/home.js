import { initSlider } from "./slider.js";
import { leadForm } from "./lead-form.js";
/* global __TEXTBACK_MONTHLY__ */
initSlider();
const form = document.getElementById("contact-form"), plan = document.getElementById("plan"), inquiry = document.getElementById("inquiry-type");
const button = form.querySelector('button[type="submit"]');
const typeFor = value => value.startsWith("Missed-call booking agent") ? "booking" : /text-back/.test(value) ? "textback" : value.startsWith("Care plan") ? "care" : "website";
const copy = {
 website: {title:"Get your free website draft.",button:"Get my free website draft",heading:"Request my free website draft",promise:"No payment, card or obligation. Draft usually ready 2–3 days after your details are confirmed.",steps:[["I reply personally.","We confirm your services, hours and what your website needs to do."],["You get a working draft.","Open it on your phone and share your feedback."],["You decide.","The scope and price are agreed before you pay."]]},
 textback: {title:"See missed-call follow-up in action.",button:"Request my text-back demo",heading:"Request a text-back demo",promise:"We check your phone setup and confirm all costs before you agree to a paid service.",steps:[["I reply personally.","We discuss the calls you miss and the phone setup you use."],["You see the follow-up flow.","I show the automatic reply, customer response and owner’s inbox."],["You decide.","We confirm compatibility, usage, cancellation and the price in writing."]]},
 booking: {title:"See whether a booking agent fits.",button:"Request my booking-agent demo",heading:"Request a booking-agent demo",promise:"We check your phone and calendar compatibility before any paid setup.",steps:[["I reply personally.","We discuss your booking process and calendar."],["We check the connection.","I confirm your systems can connect and show the booking flow."],["You decide.","We agree on scope, usage, handoff and pricing before setup."]]},
 care: {title:"Ask about website care.",button:"Ask about website care",heading:"Ask about care",promise:"Tell me which website needs updates. We agree on the scope before work starts.",steps:[["I reply personally.","We review your current site and the updates you need."],["We confirm the scope.","I explain what the care plan covers."],["You decide.","The price and ongoing terms are agreed before you pay."]]}
};
function updateCopy() {
 const mode=copy[inquiry.value]?inquiry.value:"website",c=copy[mode];
 document.getElementById("contact-title").textContent=c.title;
 document.getElementById("form-title").textContent=c.heading;
 document.getElementById("form-promise").textContent=c.promise;
 button.textContent=c.button;
 document.getElementById("contact-next").replaceChildren(...c.steps.map(([heading,text])=>{
  const li=document.createElement("li"),strong=document.createElement("strong");strong.textContent=heading;li.append(strong," "+text);return li;
 }));
 form.elements.redirect.value=window.location.origin+(mode==="booking"?"/thanks/booking-agent/":mode==="textback"?"/thanks/text-back/":"/thanks/");
}
document.querySelectorAll("[data-plan]").forEach(a=>a.addEventListener("click",()=>{plan.value=a.dataset.plan;inquiry.value=typeFor(plan.value);updateCopy();}));
document.querySelectorAll('a[href="/#contact"]:not([data-plan])').forEach(a=>a.addEventListener("click",()=>{plan.value="Not sure yet";inquiry.value="website";updateCopy();}));
inquiry.addEventListener("change",()=>{
 const prefix={textback:"Missed-call text-back",booking:"Missed-call booking agent",care:"Care plan"}[inquiry.value];
 plan.value=prefix?[...plan.options].find(o=>o.value.startsWith(prefix)).value:"Not sure yet";updateCopy();
});
plan.addEventListener("change",()=>{inquiry.value=typeFor(plan.value);updateCopy();});
updateCopy();
leadForm({
 idle:()=>copy[inquiry.value].button,
 success:"Got it, thanks! I’ll reply in 1–3 business days to discuss your request.",
 subject:f=>(inquiry.value==="booking"?"Booking agent inquiry: ":inquiry.value==="textback"?"Text-back inquiry: ":inquiry.value==="care"?"Website care inquiry: ":"Free draft request: ")+f.business.value+" ("+f.plan.value+")",
 redirect:()=>inquiry.value==="booking"?"/thanks/booking-agent/":inquiry.value==="textback"?"/thanks/text-back/":"/thanks/"
});
const demoButton=document.getElementById("textback-next");let step=0;demoButton.hidden=false;
demoButton.addEventListener("click",()=>{
 step=(step+1)%3;document.querySelectorAll("[data-demo-step]").forEach(el=>{el.hidden=Number(el.dataset.demoStep)>step;});
 demoButton.textContent=["Show the customer reply","Show what the owner receives","Reset the example"][step];
});
const profit=document.getElementById("job-profit"),result=document.getElementById("profit-result");
function calculate(){
 const value=Number(profit.value);
 if(!Number.isFinite(value)||value<=0){result.textContent="Enter a profit greater than zero to estimate fee coverage.";return;}
 const jobs=Math.ceil(__TEXTBACK_MONTHLY__/value);
 result.textContent="At "+value.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2})+" profit per extra job, "+jobs.toLocaleString("en-US")+" additional "+(jobs===1?"job would":"jobs would")+" cover the $"+__TEXTBACK_MONTHLY__+" monthly fee.";
}
profit.addEventListener("input",calculate);calculate();

