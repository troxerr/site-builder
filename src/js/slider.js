// Before/after slider: drag, tap, arrow keys, or the quick buttons; plus the roofing/auto trade tabs.
const TRADES = {
  roofing: { title: "Generic Mid-South Roofing Co.", copy: "We pride ourselves on quality roofs. If you have hail damage or a roof leak, please fill out our 9-field email form and our office will check the inbox within 3 to 5 business days.", link: ["/demos/", "See the sample demos"] },
  auto: { title: "Old Memphis Auto & Muffler Shop", copy: "Welcome to our repair shop website. Call our landline during shop hours and hope nobody is running an impact wrench, or leave a voicemail after the beep.", link: ["/demos/", "See the sample demos"] },
};

export function initSlider() {
  const stage = document.getElementById("comparison-stage"), before = document.getElementById("before-overlay"),
    inner = document.getElementById("before-inner"), handle = document.getElementById("slider-handle");
  if (!stage) return;
  let pos = 50, dragging = false;
  const syncWidth = () => { inner.style.width = stage.offsetWidth + "px"; };
  function setPos(p, animate) {
    pos = Math.max(4, Math.min(96, p));
    before.classList.toggle("slide-anim", !!animate); handle.classList.toggle("slide-anim", !!animate);
    before.style.width = pos + "%"; handle.style.left = pos + "%";
    handle.setAttribute("aria-valuenow", Math.round(pos));
    handle.setAttribute("aria-valuetext", pos > 66 ? "Mostly the old site" : pos < 34 ? "Mostly the new site" : "Half old site, half new site");
  }
  const fromX = (x) => { const r = stage.getBoundingClientRect(); setPos((x - r.left) / r.width * 100); };
  window.addEventListener("resize", syncWidth); syncWidth();
  stage.addEventListener("pointerdown", (e) => { dragging = true; fromX(e.clientX); });
  window.addEventListener("pointermove", (e) => { if (dragging) fromX(e.clientX); });
  window.addEventListener("pointerup", () => { dragging = false; });
  window.addEventListener("pointercancel", () => { dragging = false; });
  handle.addEventListener("keydown", (e) => {
    const k = e.key, step = e.shiftKey ? 20 : 5;
    if (k === "ArrowLeft" || k === "ArrowDown") setPos(pos - step, true);
    else if (k === "ArrowRight" || k === "ArrowUp") setPos(pos + step, true);
    else if (k === "Home") setPos(4, true); else if (k === "End") setPos(96, true); else return;
    e.preventDefault();
  });
  document.querySelectorAll("[data-slide]").forEach((b) => b.addEventListener("click", () => setPos(+b.getAttribute("data-slide"), true)));

  document.querySelectorAll(".trade-tab").forEach((tab) => tab.addEventListener("click", () => {
    const t = tab.getAttribute("data-trade"), d = TRADES[t];
    document.querySelectorAll(".trade-tab").forEach((x) => { const on = x === tab; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", on); });
    document.querySelectorAll(".after-pane").forEach((p) => { const on = p.id === "after-" + t; p.classList.toggle("hidden", !on); p.classList.toggle("flex", on); });
    document.getElementById("before-title").textContent = d.title;
    document.getElementById("before-copy").textContent = d.copy;
    const l = document.getElementById("showcase-link"); l.href = d.link[0]; l.textContent = d.link[1];
    setPos(50, true);
  }));
}
