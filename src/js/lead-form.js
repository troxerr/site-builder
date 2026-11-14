// Sends the contact form through Web3Forms (delivers to the site's email) and shows a call/email fallback if that fails.
// __CONTACT__ is filled in at build time from src/data/site.json.
/* global __CONTACT__ */
const { phone, tel, email } = __CONTACT__;

/** options: subject(form) -> string, redirect(form) -> path, success text, idle button label. */
export function leadForm({ subject, redirect, success, idle }) {
  const form = document.getElementById("contact-form"), status = document.getElementById("form-status");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]"), data = new FormData(form);
    data.set("subject", subject(form.elements));
    const destination = redirect(form.elements);
    const idleLabel = typeof idle === "function" ? idle() : idle;
    btn.disabled = true; btn.textContent = "Sending...";
    fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) throw new Error(res.message);
        const to = destination;
        form.reset();
        status.className = "text-sm font-semibold text-emerald-300 sm:col-span-2";
        status.textContent = success;
        btn.textContent = "Sent";
        // A /thanks/ page view is how Cloudflare Web Analytics counts a lead; the message above stays if this navigation fails
        window.location.assign(to);
      })
      .catch(() => {
        btn.disabled = false; btn.textContent = idleLabel;
        status.className = "text-sm font-semibold text-red-300 sm:col-span-2";
        status.innerHTML = `Something went wrong. Please call or text <a class="link" href="tel:${tel}">${phone}</a> or email <a class="link" href="mailto:${email}">${email}</a>.`;
      });
  });
}

