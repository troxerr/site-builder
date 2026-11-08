import { shuffle } from "./shuffle.js";

const list = document.querySelector(".demo-list");
if (list) {
  // Fresh order on every visit; without JS the list keeps its HTML order
  shuffle([...list.children]).forEach((li) => list.appendChild(li));

  // Industry filter. The chips are hidden in the HTML, so without JS visitors just see every demo.
  const bar = document.getElementById("demo-filter"), count = document.getElementById("demo-count");
  if (bar) {
    bar.hidden = false;
    bar.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter]");
      if (!chip) return;
      const key = chip.dataset.filter;
      bar.querySelectorAll("[data-filter]").forEach((c) => { const on = c === chip; c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", String(on)); });
      let shown = 0;
      for (const li of list.children) { const show = key === "all" || li.dataset.category === key; li.hidden = !show; if (show) shown++; }
      count.textContent = `Showing ${shown} demo${shown === 1 ? "" : "s"}`;
    });
  }
}
