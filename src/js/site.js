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
