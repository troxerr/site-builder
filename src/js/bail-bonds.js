import { leadForm } from "./lead-form.js";

leadForm({
  idle: "Start my free trial",
  success: "Got it, thanks! I'll reply within 1–3 business days to set up your free trial.",
  subject: (f) => "Bail bond assistant inquiry: " + f.business.value,
  redirect: () => "/thanks/booking-agent/",
});

