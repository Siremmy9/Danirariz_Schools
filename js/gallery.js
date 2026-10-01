/* ==========================================================================
   gallery.js  -  masonry gallery, category filters and accessible lightbox
   Uses the native <dialog> element (focus trap, Esc to close, focus restore).
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, esc } = Utils;
  let lb, current = [], idx = 0;

  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("dialog");
    lb.className = "lightbox"; lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = `<button class="lb-btn lb-close" type="button" aria-label="Close image viewer">${icon("close", 26)}</button>
      <button class="lb-btn lb-prev" type="button" aria-label="Previous image">${icon("chevL", 28)}</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-btn lb-next" type="button" aria-label="Next image">${icon("chevR", 28)}</button>`;
    document.body.appendChild(lb);
    $(".lb-close", lb).addEventListener("click", () => lb.close());
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") lb.close(); });
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
    return lb;
  }
  function show(n) {
    idx = (n + current.length) % current.length;
    const it = current[idx], im = $("img", lb);
    im.src = it.src; im.alt = it.caption || "School gallery photo";
    $("figcaption", lb).textContent = `${it.caption || ""}${it.caption ? " · " : ""}${it.category} (${idx + 1} of ${current.length})`;
  }

  App.renderers.gallery = (el) => {
    const cfg = Settings.get();
    const limit = Number(el.dataset.limit) || 0;
    const filters = el.dataset.filters !== "off";
    const all = Store.all(KEYS.gallery);
    let active = "All";
    const cats = ["All", ...cfg.galleryCategories];

    el.innerHTML = `${filters ? `<div class="filters" role="group" aria-label="Filter gallery by category">${cats.map((c) => `<button type="button" class="filter" aria-pressed="${c === "All"}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>` : ""}<div class="masonry" aria-live="polite"></div>`;
    const grid = $(".masonry", el);

    function paint() {
      current = (active === "All" ? all : all.filter((g) => g.category === active));
      const list = limit ? current.slice(0, limit) : current;
      grid.innerHTML = list.map((g, i) => `<button type="button" class="g-item" data-i="${i}" aria-label="Open photo: ${esc(g.caption || g.category)}">
        <img src="${esc(Utils.assetUrl(g.src))}" alt="${esc(g.caption || g.category)}" width="${g.w || 800}" height="${g.h || 600}" loading="lazy" decoding="async">
        <span class="g-cap">${esc(g.caption || g.category)}</span></button>`).join("") || `<p class="empty">No photos in this category yet.</p>`;
      current = list;
    }
    paint();
    $$(".filter", el).forEach((b) => b.addEventListener("click", () => {
      active = b.dataset.cat;
      $$(".filter", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      paint();
    }));
    grid.addEventListener("click", (e) => {
      const b = e.target.closest(".g-item"); if (!b) return;
      ensureLightbox(); show(Number(b.dataset.i)); lb.showModal();
    });
  };
})();
