/* ==========================================================================
   admissions.js  -  admission enquiry form + contact form (localStorage demo)
   In production, replace the two save functions with fetch() calls to your API.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, esc } = Utils;

  /* Shared accessible validation: native rules + inline messages */
  function validate(form) {
    $$(".field-error", form).forEach((e) => e.remove());
    let firstBad = null;
    $$("input, select, textarea", form).forEach((f) => {
      f.removeAttribute("aria-invalid");
      if (f.name === "website" || f.checkValidity()) return;
      f.setAttribute("aria-invalid", "true");
      const err = document.createElement("p");
      err.className = "field-error"; err.id = f.id + "-err"; err.textContent = f.validationMessage;
      f.setAttribute("aria-describedby", err.id);
      f.closest(".field").appendChild(err);
      firstBad = firstBad || f;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function wire(form, onValid) {
    form.noValidate = true;
    form.addEventListener("input", (e) => {
      const f = e.target; f.removeAttribute("aria-invalid");
      const err = f.closest(".field")?.querySelector(".field-error"); if (err) err.remove();
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if ($("[name=website]", form)?.value) return; // honeypot: bots fill this hidden field
      if (validate(form)) onValid(Object.fromEntries(new FormData(form)));
    });
  }

  function showSuccess(form, html) {
    const box = document.createElement("div");
    box.className = "success-panel"; box.setAttribute("role", "status"); box.tabIndex = -1;
    box.innerHTML = html;
    form.hidden = true;
    form.after(box);
    box.focus();
    $(".again", box)?.addEventListener("click", () => { box.remove(); form.reset(); form.hidden = false; form.querySelector("input,select,textarea")?.focus(); });
    App.refresh(box);
  }

  /* ------------------------------- Admission form ------------------------------ */
  function initAdmission() {
    const form = $("#admission-form");
    if (!form) return;
    const cfg = Settings.get();
    const sel = $("#classApplying", form);
    sel.innerHTML = `<option value="">Select a class</option>` + cfg.levels.map((l) => `<optgroup label="${esc(l.name)}">${l.classes.map((c) => `<option>${esc(c)}</option>`).join("")}</optgroup>`).join("");
    const lvl = new URLSearchParams(location.search).get("level");
    const found = cfg.levels.find((l) => l.id === lvl);
    if (found) sel.value = found.classes[0];

    wire(form, (v) => {
      const rec = {
        id: Utils.uid("adm"), child: v.child.trim(), childAge: v.childAge, parent: v.parent.trim(), email: v.email.trim(),
        phone: v.phone.trim(), classApplying: v.classApplying, contactMethod: v.contactMethod, message: (v.message || "").trim(),
        status: "Pending", iso: new Date().toISOString()
      };
      if (!Store.add(KEYS.admissions, rec, { front: true })) return;
      Activity.log("New admission enquiry received.", "System");
      const ref = "ADM-" + rec.id.slice(-5).toUpperCase();
      showSuccess(form, `<h3>Thank you, ${esc(rec.parent)}.</h3>
        <p>We have received the admission enquiry for <strong>${esc(rec.child)}</strong> (${esc(rec.classApplying)}). Our team will contact you by ${esc(rec.contactMethod.toLowerCase())} soon.</p>
        <p class="ref">Your reference: <strong>${ref}</strong></p>
        <div class="btn-row"><a class="btn btn-wine" data-wa="Hello ${esc(cfg.name)}, I have just submitted an admission enquiry for ${esc(rec.child)} (${esc(rec.classApplying)}). Reference: ${ref}." target="_blank" rel="noopener">${icon("whatsapp", 18)} Message us on WhatsApp</a>
        <button type="button" class="btn btn-outline again">Submit another enquiry</button></div>`);
    });
  }

  /* -------------------------------- Contact form ------------------------------- */
  function initContact() {
    const form = $("#contact-form");
    if (!form) return;
    wire(form, (v) => {
      const rec = { id: Utils.uid("msg"), name: v.name.trim(), email: v.email.trim(), phone: (v.phone || "").trim(), subject: v.subject.trim(), message: v.message.trim(), status: "Unread", iso: new Date().toISOString() };
      if (!Store.add(KEYS.messages, rec, { front: true })) return;
      Activity.log("New contact message received.", "System");
      showSuccess(form, `<h3>Message sent</h3><p>Thank you, ${esc(rec.name)}. We will reply to ${esc(rec.email)} as soon as we can.</p>
        <div class="btn-row"><button type="button" class="btn btn-outline again">Send another message</button></div>`);
    });
  }

  App.onReady(() => { initAdmission(); initContact(); });
})();
