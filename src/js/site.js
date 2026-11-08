// Runs on every first-party page: footer year, mobile menu, and the mobile call bar.
import { initMenu } from "./menu.js";

if (/[?&]preview\b/.test(location.search)) document.documentElement.classList.add("preview");
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
initMenu();

// The mobile bar steps aside while the contact form is on screen
const bar = document.querySelector(".mobile-bar"), form = document.getElementById("contact-form");
if (bar && form && "IntersectionObserver" in window) {
  new IntersectionObserver((entries) => bar.classList.toggle("is-hidden", entries[0].isIntersecting), { threshold: 0.15 }).observe(form);
}

// Sections below the first screen fade up once as they scroll into view. Only for visitors who haven't asked for less motion;
// everyone else (and anyone without JavaScript or IntersectionObserver) sees the content immediately.
if ("IntersectionObserver" in window && matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  const targets = [...document.querySelectorAll("main > section > div")].filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  targets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}
