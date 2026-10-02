/* ==========================================================================
   fees.js  -  public fee cards, payment details, downloadable fee schedule.
   Data comes from localStorage key "school_fees" (edited in Admin > School Fees).
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, esc } = Utils;
  const getFees = () => Store.get(KEYS.fees) || defaultFees();
  const isPlaceholder = (v) =>
    /^contact school$/i.test(String(v).trim()) ||
    /X{3,}/.test(v) ||
    !String(v).trim();

  App.renderers["fees-cards"] = (el) => {
    const cfg = Settings.get(),
      fees = getFees();
    el.innerHTML = cfg.levels
      .map((l) => {
        const row = fees.levels?.[l.id] || {};
        return `<article class="fee-card reveal"><header><h3>${esc(l.name)}</h3><p>${esc(l.age)}</p></header>
        <dl>${FEE_FIELDS.map(([k, label]) => {
          const v = row[k] || "Contact School";
          return `<div><dt>${label}</dt><dd${isPlaceholder(v) ? ' class="is-muted"' : ""}>${esc(v)}</dd></div>`;
        }).join("")}</dl>
        <a class="btn btn-outline btn-sm" data-wa="Hello ${esc(cfg.name)}, please I would like to know the current fees for ${esc(l.name)}." target="_blank" rel="noopener">${icon("whatsapp", 18)} Ask about ${esc(l.name)} fees</a></article>`;
      })
      .join("");
  };

  App.renderers["fees-payment"] = (el) => {
    const p = getFees().payment || defaultFees().payment;
    const mIcons = ["bank", "card", "building", "globe"];
    el.innerHTML = `<div class="pay-methods">${(p.methods || []).map((m, i) => `<article class="pay-method reveal"><span class="value__icon">${icon(mIcons[i % 4], 24)}</span><div><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p></div></article>`).join("")}</div>
      <aside class="bank-card reveal" aria-label="School bank details">
        <h3>Bank details</h3>
        <dl><div><dt>Bank name</dt><dd>${esc(p.bankName)}</dd></div><div><dt>Account name</dt><dd>${esc(p.accountName)}</dd></div><div><dt>Account number</dt><dd class="acct">${esc(p.accountNumber)}</dd></div></dl>
        <p>${esc(p.instructions)}</p>
      </aside>`;
    const note = $("#fees-note");
    if (note) {
      note.textContent = p.note || "";
      note.hidden = !p.note;
    }
  };

  function csvCell(v) {
    return '"' + String(v ?? "").replace(/"/g, '""') + '"';
  }
  App.onReady(() => {
    const btn = $("#download-fees");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const cfg = Settings.get(),
        fees = getFees();
      const rows = [
        [`${cfg.name} - Fee Schedule`],
        [],
        ["Item", ...cfg.levels.map((l) => l.name)],
      ];
      FEE_FIELDS.forEach(([k, label]) =>
        rows.push([
          label,
          ...cfg.levels.map(
            (l) => fees.levels?.[l.id]?.[k] || "Contact School",
          ),
        ]),
      );
      const p = fees.payment || {};
      rows.push(
        [],
        ["Bank name", p.bankName],
        ["Account name", p.accountName],
        ["Account number", p.accountNumber],
        [],
        [p.note || ""],
      );
      Utils.download(
        "fee-schedule.csv",
        rows.map((r) => r.map(csvCell).join(",")).join("\r\n"),
      );
      Utils.toast(
        "Fee schedule downloaded. Open it in Excel or Google Sheets.",
      );
    });
  });
})();
