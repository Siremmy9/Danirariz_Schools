/* ==========================================================================
   main.js  -  shared chrome (header/footer/WhatsApp), section renderers,
   scroll effects, counters, testimonial carousel.
   Other scripts register renderers: App.renderers["name"] = (el) => {...}
   and run code after setup with App.onReady(fn).
   ========================================================================== */

const App = {
  renderers: {},
  readyFns: [],
  onReady(fn) {
    this.readyFns.push(fn);
  },
  reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

(function () {
  "use strict";
  const { $, $$, esc } = Utils;
  Seed.run();
  applyTheme();
  const cfg = Settings.get();
  const page = location.pathname.split("/").pop() || "index.html";
  const img = (src, label, i, w, h) =>
    Utils.assetUrl(src) || Utils.ph(label, i, w, h);

  /* ------------------------------ Header / footer ------------------------------ */
  const NAV = [
    ["Home", "index.html"],
    ["About", "about.html"],
    ["Our Schools", "schools.html"],
    ["Academics", "academics.html"],
    ["Admissions", "admissions.html"],
    ["Fees", "fees.html"],
    ["Facilities", "facilities.html"],
    ["Gallery", "gallery.html"],
    ["News", "news.html"],
    ["Contact", "contact.html"],
  ];
  const isActive = (href) =>
    href === page || (href === "index.html" && page === "");

  function brand() {
    return `<a class="brand" href="index.html" aria-label="${esc(cfg.name)} home"><img class="brand-logo" src="${esc(Utils.assetUrl(cfg.logo))}" alt="" width="48" height="48"><span class="brand-name">${esc(cfg.name)}</span></a>`;
  }
  function navLinks() {
    return NAV.map(
      ([t, h]) =>
        `<li><a href="${h}"${isActive(h) ? ' aria-current="page"' : ""}>${t}</a></li>`,
    ).join("");
  }

  function buildHeader() {
    const h = $("#site-header");
    if (!h) return;
    h.innerHTML = `
      <div class="header-inner">
        ${brand()}
        <nav class="nav" aria-label="Main navigation"><ul>${navLinks()}</ul></nav>
        <div class="header-actions">
          <a class="icon-btn" data-wa target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon("whatsapp", 22)}</a>
          <a class="btn btn-gold btn-sm header-cta" href="admissions.html#apply">Apply Now</a>
          <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${icon("menu", 26)}</button>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
        <div class="mobile-menu__bar">${brand()}<button class="menu-close" type="button" aria-label="Close menu">${icon("close", 26)}</button></div>
        <nav aria-label="Mobile navigation"><ul>${navLinks()}</ul></nav>
        <div class="mobile-menu__cta">
          <a class="btn btn-gold" href="admissions.html#apply">Apply Now</a>
          <a class="btn btn-ghost-light" data-wa target="_blank" rel="noopener">${icon("whatsapp", 20)} WhatsApp us</a>
        </div>
      </div>`;

    const menu = $("#mobile-menu"),
      openBtn = $(".menu-btn", h),
      closeBtn = $(".menu-close", h);
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      openBtn.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("no-scroll", open);
      if (open) closeBtn.focus();
      else if (document.activeElement && menu.contains(document.activeElement))
        openBtn.focus();
    };
    openBtn.addEventListener("click", () => setOpen(true));
    closeBtn.addEventListener("click", () => setOpen(false));
    $$("a", menu).forEach((a) =>
      a.addEventListener("click", () => setOpen(false)),
    );
    document.addEventListener("keydown", (e) => {
      if (!menu.classList.contains("is-open")) return;
      if (e.key === "Escape") return setOpen(false);
      if (e.key === "Tab") {
        // simple focus trap
        const f = $$("a[href],button", menu).filter(
          (x) => x.offsetParent !== null,
        );
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    window
      .matchMedia("(min-width: 1180px)")
      .addEventListener("change", (m) => m.matches && setOpen(false));

    const onScroll = () => h.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function buildFooter() {
    const f = $("#site-footer");
    if (!f) return;
    const soc = (k, label) => {
      const url = cfg.social?.[k];
      return `<li><a class="social${url ? "" : " is-placeholder"}" href="${url ? esc(url) : "#"}" aria-label="${label}${url ? "" : " (link not set)"}" ${url ? 'target="_blank" rel="noopener"' : `data-missing="${label}"`}>${icon(k, 20)}</a></li>`;
    };
    f.innerHTML = `
      <div class="container footer-grid">
        <div class="footer-brand">
          ${brand()}
          <p class="footer-tag">${esc(cfg.tagline)}</p>
          <a class="btn btn-gold btn-sm" data-wa target="_blank" rel="noopener">${icon("whatsapp", 18)} Chat on WhatsApp</a>
        </div>
        <div><h2 class="footer-h">Quick links</h2><ul class="footer-list">
          <li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="admissions.html">Admissions</a></li>
          <li><a href="fees.html">Fees</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="contact.html">Contact</a></li></ul></div>
        <div><h2 class="footer-h">School sections</h2><ul class="footer-list">
          ${cfg.levels.map((l) => `<li><a href="schools.html#${l.id}">${esc(l.name)}</a></li>`).join("")}</ul></div>
        <div><h2 class="footer-h">Contact</h2><ul class="footer-list footer-contact">
          <li>${icon("phone", 18)}<a data-tel>${esc(cfg.phone)}</a></li>
          <li>${icon("mail", 18)}<a data-mail>${esc(cfg.email)}</a></li>
          <li>${icon("whatsapp", 18)}<a data-wa target="_blank" rel="noopener">WhatsApp us</a></li>
          <li>${icon("pin", 18)}<span>${cfg.addressLines.map(esc).join("<br>")}</span></li></ul>
          <ul class="social-row" aria-label="Social media">${soc("facebook", "Facebook")}${soc("instagram", "Instagram")}${soc("tiktok", "TikTok")}${soc("youtube", "YouTube")}</ul></div>
      </div>
      <div class="footer-bottom"><div class="container footer-bottom__in">
        <p>&copy; 2026 ${esc(cfg.name)}. All Rights Reserved.</p>
        <p>Website designed by <span>${esc(cfg.designer)}</span></p>
        <p><a href="admin/login.html">Admin login</a></p></div></div>
      <a class="wa-float" data-wa target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon("whatsapp", 28)}<span>Chat with us</span></a>`;
    $$(".social.is-placeholder", f).forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        Utils.toast(
          `${a.dataset.missing} link not set yet. Add it in Admin > Settings.`,
        );
      }),
    );
  }

  /* ------------------------------ Config bindings ------------------------------ */
  const getPath = (o, p) =>
    p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  function bindConfig(scope = document) {
    $$("[data-cfg]", scope).forEach((el) => {
      const v = getPath(cfg, el.dataset.cfg);
      if (v != null) el.textContent = v;
    });
    $$("[data-logo]", scope).forEach((i) => (i.src = Utils.assetUrl(cfg.logo)));
    $$("[data-wa]", scope).forEach((a) => {
      a.href = Utils.waLink(a.dataset.wa || undefined);
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-tel]", scope).forEach((a) => {
      if (Utils.validDigits(cfg.phone))
        a.href = "tel:+" + Utils.waDigits(cfg.phone);
      else a.removeAttribute("href");
    });
    $$("[data-mail]", scope).forEach((a) => (a.href = "mailto:" + cfg.email));
    $$("[data-icon]:not([data-icon-done])", scope).forEach((el) => {
      el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon, 20));
      el.dataset.iconDone = "1";
    });
    $$("[data-img]", scope).forEach((im) => {
      im.src =
        Utils.assetUrl(cfg.images?.[im.dataset.img]) ||
        Utils.ph(
          im.dataset.label || im.dataset.img,
          Number(im.dataset.i) || 0,
          800,
          1000,
        );
    });
    $$("[data-directions]", scope).forEach((a) => {
      a.href =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        encodeURIComponent(cfg.location);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* --------------------------------- Renderers --------------------------------- */
  const R = App.renderers;

  R.stats = (el) => {
    const s = cfg.stats || {};
    const items = [
      ["years", "Years of Excellence", "+"],
      ["students", "Students", "+"],
      ["staff", "Qualified Staff", "+"],
      ["programs", "School Programs", ""],
    ];
    el.innerHTML = items
      .map(
        ([k, label, suf]) =>
          `<div class="stat"><strong data-count="${Number(s[k]) || 0}" data-suffix="${suf}">0${suf}</strong><span>${label}</span></div>`,
      )
      .join("");
  };

  R.schools = (el) => {
    const full = el.dataset.variant === "full";
    el.innerHTML = cfg.levels
      .map((l, i) => {
        const src = img(cfg.images?.[l.id], l.name, i, 640, 800);
        if (!full)
          return `<article class="school-card reveal">
        <div class="arch"><img src="${esc(src)}" alt="Pupils in the ${esc(l.name)} section of ${esc(cfg.name)}" width="640" height="800" loading="lazy" decoding="async"></div>
        <div class="school-card__body"><p class="chip">${esc(l.age)}</p><h3>${esc(l.name)}</h3><p>${esc(l.desc)}</p>
        <a class="btn btn-outline btn-sm" href="schools.html#${l.id}">Learn More<span class="sr-only"> about ${esc(l.name)}</span></a></div></article>`;
        return `<article class="level-block reveal" id="${l.id}">
        <div class="arch arch--lg"><img src="${esc(src)}" alt="${esc(l.name)} section at ${esc(cfg.name)}" width="640" height="800" loading="lazy" decoding="async"></div>
        <div class="level-block__text"><h2>${esc(l.name)}</h2><p class="chip">${esc(l.age)}</p><p class="lead">${esc(l.desc)}</p>
        <h3>What children experience</h3><ul class="ticks">${l.focus.map((f) => `<li>${icon("check", 18)}${esc(f)}</li>`).join("")}</ul>
        <div class="btn-row"><a class="btn btn-wine" href="admissions.html?level=${l.id}#apply">Apply to ${esc(l.name)}</a>
        <a class="btn btn-outline" data-wa="Hello ${esc(cfg.name)}, I would like to know more about your ${esc(l.name)} section." target="_blank" rel="noopener">${icon("whatsapp", 18)} Ask on WhatsApp</a></div></div></article>`;
      })
      .join("");
  };

  R["hero-levels"] = (el) => {
    el.innerHTML = cfg.levels.map((l) => `<li>${esc(l.name)}</li>`).join("");
  };

  R.values = (el) => {
    el.innerHTML = cfg.values
      .map(
        (v) =>
          `<li class="value reveal"><span class="value__icon">${icon(v.icon, 26)}</span><div><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div></li>`,
      )
      .join("");
  };

  R.about = (el) => {
    const a = cfg.about;
    el.innerHTML = `<article class="about-card reveal"><h3>Our mission</h3><p>${esc(a.mission)}</p></article>
      <article class="about-card reveal"><h3>Our vision</h3><p>${esc(a.vision)}</p></article>
      <article class="about-card reveal"><h3>Educational philosophy</h3><p>${esc(a.philosophy)}</p></article>`;
  };

  R["admission-steps"] = (el) => {
    el.innerHTML = cfg.admissionSteps
      .map(
        (s, i) =>
          `<li class="step reveal"><span class="step__n" aria-hidden="true">${i + 1}</span><div><h3><span class="sr-only">Step ${i + 1}: </span>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`,
      )
      .join("");
  };

  R["academics-approach"] = (el) => {
    const items = Store.all(KEYS.academics).filter(
      (x) => x.type === "Approach",
    );
    el.innerHTML =
      items
        .map(
          (x) =>
            `<article class="approach reveal"><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></article>`,
        )
        .join("") || `<p class="empty">No content yet.</p>`;
  };
  R["academics-subjects"] = (el) => {
    const limit = Number(el.dataset.limit) || 999;
    const items = Store.all(KEYS.academics)
      .filter((x) => x.type === "Subject")
      .slice(0, limit);
    el.innerHTML = items
      .map(
        (x) =>
          `<li class="subject reveal">${icon("book", 20)}<span>${esc(x.title)}</span></li>`,
      )
      .join("");
  };

  R.facilities = (el) => {
    el.innerHTML = Store.all(KEYS.facilities)
      .map(
        (f, i) => `<article class="facility reveal" tabindex="0">
      <img src="${esc(img(f.image, f.title, i, 800, 600))}" alt="${esc(f.title)} at ${esc(cfg.name)}" width="800" height="600" loading="lazy" decoding="async">
      <div class="facility__text"><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p></div></article>`,
      )
      .join("");
  };

  R.staff = (el) => {
    const list = Store.all(KEYS.staff);
    el.innerHTML =
      list
        .map(
          (s, i) => `<article class="staff-card reveal">
      <div class="arch arch--sm"><img src="${esc(img(s.photo, s.name, i, 600, 700))}" alt="Photo of ${esc(s.name)}" width="600" height="700" loading="lazy" decoding="async"></div>
      <h3>${esc(s.name)}</h3><p class="staff-pos">${esc(s.position)}</p>${s.department ? `<p class="chip">${esc(s.department)}</p>` : ""}
      <p class="staff-bio">${esc(s.bio)}</p></article>`,
        )
        .join("") || `<p class="empty">Staff profiles will appear here.</p>`;
  };

  function openArticle(a) {
    let d = $("#article-dialog");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "article-dialog";
      d.className = "modal modal--article";
      d.setAttribute("aria-label", "News article");
      d.addEventListener("click", (e) => e.target === d && d.close());
      document.body.appendChild(d);
    }
    const paras = String(a.content || a.excerpt || "")
      .split(/\n{2,}/)
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");
    d.innerHTML = `<button class="modal-close" type="button" aria-label="Close article">${icon("close", 22)}</button>
      <img src="${esc(img(a.image, a.title, 1, 800, 500))}" alt="" width="800" height="500">
      <div class="modal-body"><p class="meta"><span class="chip">${esc(a.category)}</span> <time datetime="${esc(a.date)}">${Utils.fmtDate(a.date)}</time></p><h2>${esc(a.title)}</h2>${paras}</div>`;
    $(".modal-close", d).addEventListener("click", () => d.close());
    d.showModal();
  }
  R.news = (el) => {
    const limit = Number(el.dataset.limit) || 999;
    const list = Store.all(KEYS.news)
      .filter((n) => n.published)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, limit);
    el.innerHTML =
      list
        .map(
          (n, i) => `<article class="news-card reveal">
      <img src="${esc(img(n.image, n.title, i, 800, 500))}" alt="" width="800" height="500" loading="lazy" decoding="async">
      <div class="news-card__body"><p class="meta"><span class="chip">${esc(n.category)}</span> <time datetime="${esc(n.date)}">${Utils.fmtDate(n.date)}</time></p>
      <h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p>
      <button class="link-btn" type="button" data-id="${n.id}">Read More<span class="sr-only">: ${esc(n.title)}</span></button></div></article>`,
        )
        .join("") ||
      `<p class="empty">No news published yet. Please check back soon.</p>`;
    $$(".link-btn", el).forEach((b) =>
      b.addEventListener("click", () =>
        openArticle(list.find((x) => x.id === b.dataset.id)),
      ),
    );
  };

  R.testimonials = (el) => {
    const items = Store.all(KEYS.testimonials);
    if (!items.length) {
      el.innerHTML = `<p class="empty">Parent stories will appear here.</p>`;
      return;
    }
    el.innerHTML = `<div class="tcar" role="region" aria-roledescription="carousel" aria-label="Parent testimonials">
      <div class="tcar-viewport"><div class="tcar-track">${items
        .map(
          (
            t,
            i,
          ) => `<figure class="tslide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}">
        <blockquote><p>${esc(t.quote)}</p></blockquote>
        <figcaption>${t.photo ? `<img class="avatar" src="${esc(Utils.assetUrl(t.photo))}" alt="" width="52" height="52" loading="lazy">` : `<span class="avatar avatar--init" aria-hidden="true">${esc(Utils.initials(t.name))}</span>`}
        <span><strong>${esc(t.name)}</strong><br>${esc(t.childClass)}</span></figcaption></figure>`,
        )
        .join("")}</div></div>
      <div class="tcar-controls"><button class="round-btn" type="button" data-dir="-1" aria-label="Previous testimonial">${icon("chevL", 22)}</button>
      <div class="tcar-dots">${items.map((_, i) => `<button type="button" data-i="${i}" aria-label="Show testimonial ${i + 1}"></button>`).join("")}</div>
      <button class="round-btn" type="button" data-dir="1" aria-label="Next testimonial">${icon("chevR", 22)}</button></div></div>`;
    const track = $(".tcar-track", el),
      slides = $$(".tslide", el),
      dots = $$(".tcar-dots button", el),
      car = $(".tcar", el);
    let i = 0,
      timer = null;
    const go = (n) => {
      i = (n + items.length) % items.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      slides.forEach((s, k) => s.setAttribute("aria-hidden", String(k !== i)));
      dots.forEach((d, k) =>
        k === i
          ? d.setAttribute("aria-current", "true")
          : d.removeAttribute("aria-current"),
      );
    };
    $$("[data-dir]", el).forEach((b) =>
      b.addEventListener("click", () => go(i + Number(b.dataset.dir))),
    );
    dots.forEach((d) =>
      d.addEventListener("click", () => go(Number(d.dataset.i))),
    );
    const stop = () => {
      clearInterval(timer);
      timer = null;
    };
    const start = () => {
      if (!App.reduced && !timer && items.length > 1)
        timer = setInterval(() => go(i + 1), 7000);
    };
    car.addEventListener("mouseenter", stop);
    car.addEventListener("mouseleave", start);
    car.addEventListener("focusin", stop);
    car.addEventListener("focusout", start);
    car.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    });
    go(0);
    start();
  };

  R["contact-details"] = (el) => {
    el.innerHTML = `<h3>${esc(cfg.name)}</h3>
      <ul class="contact-list">
        <li>${icon("pin", 22)}<div><strong>Address</strong><br>${cfg.addressLines.map(esc).join("<br>")}</div></li>
        <li>${icon("phone", 22)}<div><strong>Phone</strong><br><a data-tel>${esc(cfg.phone)}</a></div></li>
        <li>${icon("mail", 22)}<div><strong>Email</strong><br><a data-mail>${esc(cfg.email)}</a></div></li>
        <li>${icon("whatsapp", 22)}<div><strong>WhatsApp</strong><br><a data-wa target="_blank" rel="noopener">Start a chat</a></div></li>
        <li>${icon("clock", 22)}<div><strong>Opening hours</strong><br>${esc(cfg.openingHours)}</div></li>
      </ul>`;
  };

  /* Google Maps: paste the embed URL in config.js (mapUrl) or Admin > Settings. */
  R.map = (el) => {
    const url = (cfg.mapUrl || "").trim();
    const ok =
      /^https:\/\/www\.google\.com\/maps\/embed/.test(url) ||
      /^https:\/\/maps\.google\.com\//.test(url);
    el.innerHTML = ok
      ? `<iframe title="Map showing ${esc(cfg.name)}" src="${esc(url)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
      : `<!-- PASTE GOOGLE MAP EMBED URL HERE (config.js > mapUrl, or Admin > Settings > Google Maps) -->
         <div class="map-placeholder">${icon("pin", 40)}<p><strong>Google Map goes here</strong></p>
         <p>Paste the Google Maps embed URL in <code>js/config.js</code> (mapUrl) or in Admin &gt; Settings.</p></div>`;
  };

  /* ------------------------------ Page behaviours ------------------------------ */
  function initReveal(scope = document) {
    const els = $$(".reveal:not(.in)", scope);
    if (App.reduced || !("IntersectionObserver" in window))
      return els.forEach((e) => e.classList.add("in"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((e) => io.observe(e));
  }
  App.refresh = (scope) => {
    bindConfig(scope);
    initReveal(scope);
  };

  function initCounters() {
    const els = $$("[data-count]");
    const fmt = (n, el) =>
      Math.round(n).toLocaleString("en-NG") + (el.dataset.suffix || "");
    const run = (el) => {
      const target = Number(el.dataset.count) || 0;
      if (App.reduced) return (el.textContent = fmt(target, el));
      const t0 = performance.now(),
        dur = 1600;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), el);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) return els.forEach(run);
    const io = new IntersectionObserver(
      (en) =>
        en.forEach((e) => {
          if (e.isIntersecting) {
            run(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.4 },
    );
    els.forEach((e) => io.observe(e));
  }

  function initHero() {
    const hero = $(".hero");
    if (!hero) return;
    const poster =
      Utils.assetUrl(cfg.heroPoster) ||
      Utils.ph(
        "Your school video poster",
        0,
        1600,
        900,
        "Add assets/videos/school-hero.mp4",
      );
    hero.style.backgroundImage = `url("${poster}")`;
    const v = $(".hero-video", hero);
    if (!v) return;
    v.poster = poster;
    const conn = navigator.connection;
    if (App.reduced || (conn && conn.saveData)) return v.remove(); // respect motion/data-saver: show poster only
    const src = $("source", v);
    if (src && cfg.heroVideo) {
      src.src = Utils.assetUrl(cfg.heroVideo);
      v.load();
    }
    v.addEventListener("error", () => v.remove(), true); // missing file: fall back to the poster image
    v.muted = true;
    const p = v.play && v.play();
    if (p && p.catch) p.catch(() => {});
  }

  function initAnchors() {
    $$("[data-missing-link]").forEach((a) =>
      a.addEventListener("click", (e) => e.preventDefault()),
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildHeader();
    buildFooter();
    $$("[data-render]").forEach((el) => {
      const fn = App.renderers[el.dataset.render];
      if (fn) fn(el);
    });
    bindConfig();
    initHero();
    initReveal();
    initCounters();
    initAnchors();
    App.readyFns.forEach((fn) => fn());
    bindConfig();
    document.dispatchEvent(new Event("school:ready"));
  });
})();
