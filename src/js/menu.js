// Mobile menu: the toggle button opens the nav panel; picking a link closes it.
export function initMenu() {
  const nav = document.getElementById("nav"), toggle = document.getElementById("menu-toggle");
  if (!nav || !toggle) return;
  const set = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") set(false); });
}
