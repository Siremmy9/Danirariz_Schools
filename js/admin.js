/* ==========================================================================
   admin.js  -  admin login + dashboard (frontend-only demo)

   !!! DEMO AUTHENTICATION ONLY - NOT SUITABLE FOR PRODUCTION !!!
   The username/password below live in client-side JavaScript, so anyone can
   read them, and "login" is just a flag in the browser. It exists only so you
   can demonstrate the dashboard to clients. Before going live, replace the
   Auth object with real server-side authentication (sessions or JWT over
   HTTPS, hashed passwords) and move the localStorage Store calls to an API.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, esc } = Utils;
  const PAGE = document.body.dataset.adminPage;
  applyTheme();
  Seed.run();
  const cfg = Settings.get();

  /* ------------------------------ DEMO AUTH ONLY ------------------------------ */
  const Auth = {
    DEMO_USER: "admin",
    DEMO_PASS: "admin123",
    SESSION_KEY: "school_admin_session",
    // Replace this method with: fetch('/api/login', {method:'POST', body: ...})
    login(user, pass, remember) {
      const u = String(user).trim().toLowerCase();
      if (u === this.DEMO_USER && pass === this.DEMO_PASS) {
        const store = remember ? localStorage : sessionStorage;
        store.setItem(
          this.SESSION_KEY,
          JSON.stringify({ user: this.DEMO_USER, at: Date.now() }),
        );
        return { ok: true };
      }
      return {
        ok: false,
        error:
          "Incorrect username or password. Check the details and try again.",
      };
    },
    current() {
      try {
        return JSON.parse(
          sessionStorage.getItem(this.SESSION_KEY) ||
            localStorage.getItem(this.SESSION_KEY) ||
            "null",
        );
      } catch (e) {
        return null;
      }
    },
    logout() {
      sessionStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SESSION_KEY);
    },
  };
  const adminName = () => (Auth.current() || {}).user || "admin";

  /* --------------------------------- Helpers ---------------------------------- */
  function openModal(title, html, onMount, cls = "") {
    const d = document.createElement("dialog");
    d.className = "a-modal " + cls;
    d.setAttribute("aria-label", title);
    d.innerHTML = `<div class="a-modal__head"><h2>${esc(title)}</h2><button type="button" class="icon-x" aria-label="Close">${icon("close", 22)}</button></div><div class="a-modal__body">${html}</div>`;
    document.body.appendChild(d);
    $(".icon-x", d).addEventListener("click", () => d.close());
    d.addEventListener("close", () => d.remove());
    d.addEventListener("mousedown", (e) => {
      d._down = e.target === d;
    });
    d.addEventListener("click", (e) => {
      if (e.target === d && d._down) d.close();
    });
    d.showModal();
    if (onMount) onMount(d);
    return d;
  }
  function confirmBox(message, okLabel = "Delete") {
    return new Promise((resolve) => {
      const d = openModal(
        "Please confirm",
        `<p>${esc(message)}</p><div class="a-actions"><button type="button" class="btn btn-ghost" data-no>Cancel</button><button type="button" class="btn btn-danger" data-yes>${esc(okLabel)}</button></div>`,
        (dlg) => {
          $("[data-no]", dlg).addEventListener("click", () => dlg.close());
          $("[data-yes]", dlg).addEventListener("click", () => {
            dlg._yes = true;
            dlg.close();
          });
        },
        "a-modal--sm",
      );
      d.addEventListener("close", () => resolve(!!d._yes));
    });
  }
  const log = (text) => Activity.log(text, adminName());
  const statusClass = (s) => "s-" + String(s).toLowerCase();
  const levelOf = (cls) =>
    (cfg.levels.find((l) => l.classes.includes(cls)) || {}).name || "Other";
  const allClasses = () => cfg.levels.flatMap((l) => l.classes);
  const waPhone = (p) => {
    const d = Utils.waDigits(p);
    return Utils.validDigits(d) ? d : "";
  };

  /* ----------------------------------- Shell ---------------------------------- */
  const NAV = [
    ["dashboard", "Dashboard", "dashboard"],
    ["admissions", "Admissions", "clipboard"],
    ["students", "Students", "students"],
    ["staff", "Staff", "users"],
    ["fees", "School Fees", "fees"],
    ["news", "News & Events", "news"],
    ["gallery", "Gallery", "image"],
    ["facilities", "Facilities", "building"],
    ["academics", "Academics", "book"],
    ["testimonials", "Testimonials", "chat"],
    ["messages", "Messages", "mail"],
    ["activities", "Activities", "activity"],
    ["settings", "Settings", "settings"],
  ];
  function badge(key) {
    if (key === "admissions") {
      const n = Store.all(KEYS.admissions).filter(
        (a) => a.status === "Pending",
      ).length;
      return n
        ? `<span class="nav-badge" aria-label="${n} pending">${n}</span>`
        : "";
    }
    if (key === "messages") {
      const n = Store.all(KEYS.messages).filter(
        (m) => m.status === "Unread",
      ).length;
      return n
        ? `<span class="nav-badge" aria-label="${n} unread">${n}</span>`
        : "";
    }
    return "";
  }
  function shell() {
    const title = (NAV.find((n) => n[0] === PAGE) || [0, "Admin"])[1];
    document.title = `${title} | ${cfg.name} Admin`;
    document.body.innerHTML = `
      <a class="skip-link" href="#admin-content">Skip to content</a>
      <div class="admin-app">
        <aside class="sidebar" id="sidebar" aria-label="Admin navigation">
          <div class="sidebar__brand"><img src="${esc(Utils.assetUrl(cfg.logo))}" alt="" width="40" height="40"><div><strong>${esc(cfg.name)}</strong><span>Admin</span></div></div>
          <nav><ul>${NAV.map(([k, label, ic]) => `<li><a href="${k}.html"${k === PAGE ? ' aria-current="page"' : ""}>${icon(ic, 20)}<span>${label}</span>${badge(k)}</a></li>`).join("")}
            <li><button type="button" id="logout">${icon("logout", 20)}<span>Logout</span></button></li></ul></nav>
        </aside>
        <div class="sidebar-scrim" id="scrim"></div>
        <div class="admin-main">
          <header class="topbar">
            <button type="button" class="menu-toggle" id="menu-toggle" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false">${icon("menu", 24)}</button>
            <p class="topbar__title">${esc(title)}</p>
            <a class="btn btn-ghost btn-sm" href="../index.html" target="_blank" rel="noopener">${icon("external", 16)} View website</a>
            <span class="user-chip" title="Signed in (demo)"><span class="avatar-sm">${esc(Utils.initials(adminName()))}</span>${esc(adminName())}</span>
          </header>
          <main id="admin-content" class="admin-content" tabindex="-1"></main>
        </div>
      </div>`;
    const sb = $("#sidebar"),
      mt = $("#menu-toggle");
    const setNav = (open) => {
      sb.classList.toggle("open", open);
      $("#scrim").classList.toggle("show", open);
      mt.setAttribute("aria-expanded", String(open));
    };
    mt.addEventListener("click", () => setNav(!sb.classList.contains("open")));
    $("#scrim").addEventListener("click", () => setNav(false));
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && setNav(false),
    );
    $("#logout").addEventListener("click", () => {
      Auth.logout();
      location.href = "login.html";
    });
  }
  const refreshBadges = () =>
    $$(".sidebar nav a").forEach((a, i) => {
      const k = NAV[i][0];
      $(".nav-badge", a)?.remove();
      a.insertAdjacentHTML("beforeend", badge(k));
    });

  /* ------------------------------ Generic CRUD pages --------------------------- */
  const SCHEMAS = {
    students: {
      key: KEYS.students,
      title: "Students",
      one: "student",
      label: "name",
      sub: "Everyone currently enrolled.",
      fields: [
        { n: "name", l: "Full name", req: 1 },
        { n: "className", l: "Class", t: "select", opts: allClasses, req: 1 },
        { n: "parent", l: "Parent / guardian" },
        { n: "phone", l: "Phone", t: "tel" },
        { n: "admitted", l: "Date admitted", t: "date" },
      ],
      cols: [
        { n: "name", l: "Student" },
        { n: "className", l: "Class" },
        { n: "parent", l: "Parent" },
        { n: "phone", l: "Phone" },
        { n: "admitted", l: "Admitted", t: "date" },
      ],
    },
    staff: {
      key: KEYS.staff,
      title: "Staff",
      one: "staff member",
      label: "name",
      sub: "Shown on the About page under Meet Our Dedicated Team.",
      fields: [
        { n: "name", l: "Name", req: 1 },
        {
          n: "position",
          l: "Position",
          req: 1,
          hint: "For example Principal, Class Teacher",
        },
        { n: "department", l: "Department" },
        { n: "phone", l: "Phone", t: "tel" },
        { n: "email", l: "Email", t: "email" },
        { n: "bio", l: "Short biography", t: "textarea" },
        { n: "photo", l: "Photo", t: "image" },
      ],
      cols: [
        { n: "photo", l: "Photo", t: "image" },
        { n: "name", l: "Name" },
        { n: "position", l: "Position" },
        { n: "department", l: "Department" },
      ],
    },
    news: {
      key: KEYS.news,
      title: "News & Events",
      one: "article",
      label: "title",
      publishable: true,
      sub: "Only published articles appear on the website.",
      sort: (a, b) => String(b.date).localeCompare(String(a.date)),
      fields: [
        { n: "title", l: "Title", req: 1 },
        {
          n: "category",
          l: "Category",
          t: "select",
          opts: () => cfg.newsCategories,
          req: 1,
        },
        { n: "date", l: "Date", t: "date", req: 1 },
        { n: "image", l: "Featured image", t: "image" },
        {
          n: "excerpt",
          l: "Short description",
          t: "textarea",
          rows: 2,
          req: 1,
        },
        { n: "content", l: "Full article", t: "textarea", rows: 7 },
        {
          n: "published",
          l: "Published (visible on the website)",
          t: "checkbox",
        },
      ],
      defaults: () => ({
        date: new Date().toISOString().slice(0, 10),
        published: true,
      }),
      cols: [
        { n: "image", l: "Image", t: "image" },
        { n: "title", l: "Title" },
        { n: "category", l: "Category" },
        { n: "date", l: "Date", t: "date" },
        { n: "published", l: "Status", t: "bool" },
      ],
    },
    gallery: {
      key: KEYS.gallery,
      title: "Gallery",
      one: "gallery image",
      label: "caption",
      sub: "Photos appear on the Gallery page and the homepage preview.",
      fields: [
        { n: "src", l: "Image", t: "image", req: 1 },
        { n: "caption", l: "Caption" },
        {
          n: "category",
          l: "Category",
          t: "select",
          opts: () => cfg.galleryCategories,
          req: 1,
        },
      ],
      cols: [
        { n: "src", l: "Image", t: "image" },
        { n: "caption", l: "Caption" },
        { n: "category", l: "Category" },
      ],
    },
    facilities: {
      key: KEYS.facilities,
      title: "Facilities",
      one: "facility",
      label: "title",
      sub: "Cards on the Facilities page.",
      fields: [
        { n: "title", l: "Name", req: 1 },
        { n: "description", l: "Description", t: "textarea", rows: 3 },
        { n: "image", l: "Image", t: "image" },
      ],
      cols: [
        { n: "image", l: "Image", t: "image" },
        { n: "title", l: "Facility" },
        { n: "description", l: "Description" },
      ],
    },
    academics: {
      key: KEYS.academics,
      title: "Academics",
      one: "academic item",
      label: "title",
      sub: "Approach items are cards; subjects form the subject grid on the Academics page.",
      sort: (a, b) => String(a.type).localeCompare(String(b.type)),
      fields: [
        {
          n: "type",
          l: "Type",
          t: "select",
          opts: () => ["Approach", "Subject"],
          req: 1,
        },
        { n: "title", l: "Title", req: 1 },
        {
          n: "description",
          l: "Description (optional for subjects)",
          t: "textarea",
          rows: 3,
        },
      ],
      cols: [
        { n: "type", l: "Type" },
        { n: "title", l: "Title" },
        { n: "description", l: "Description" },
      ],
    },
    testimonials: {
      key: KEYS.testimonials,
      title: "Testimonials",
      one: "testimonial",
      label: "name",
      sub: "Shown in the parent testimonials slider.",
      fields: [
        { n: "name", l: "Parent name", req: 1 },
        {
          n: "childClass",
          l: "Child's class",
          hint: "For example Parent, Primary 4",
        },
        { n: "quote", l: "Testimonial", t: "textarea", rows: 4, req: 1 },
        { n: "photo", l: "Photo (optional)", t: "image" },
      ],
      cols: [
        { n: "name", l: "Parent" },
        { n: "childClass", l: "Child's class" },
        { n: "quote", l: "Testimonial" },
      ],
    },
  };

  function fieldHTML(f, val) {
    const id = "f_" + f.n,
      req = f.req ? " required" : "";
    const lab = `<label for="${id}">${esc(f.l)}${f.req ? ' <span class="req" aria-hidden="true">*</span>' : ""}</label>`;
    const hint = f.hint ? `<p class="hint">${esc(f.hint)}</p>` : "";
    if (f.t === "textarea")
      return `<div class="field">${lab}<textarea id="${id}" name="${f.n}" rows="${f.rows || 4}"${req}>${esc(val)}</textarea>${hint}</div>`;
    if (f.t === "select")
      return `<div class="field">${lab}<select id="${id}" name="${f.n}"${req}><option value="">Select</option>${f
        .opts()
        .map((o) => `<option${o === val ? " selected" : ""}>${esc(o)}</option>`)
        .join("")}</select></div>`;
    if (f.t === "checkbox")
      return `<div class="field field--check"><label><input type="checkbox" name="${f.n}"${val ? " checked" : ""}> ${esc(f.l)}</label></div>`;
    if (f.t === "image") {
      const isData = /^data:/.test(val || "");
      return `<div class="field">${lab}<div class="img-field"><img class="img-prev" src="${esc(Utils.assetUrl(val) || Utils.ph("No image", 0, 200, 200, ""))}" alt="Image preview" width="96" height="96">
        <div class="img-inputs"><input type="file" id="${id}" accept="image/*" data-file>
        <input type="text" data-url placeholder="or paste an image path / URL" value="${isData ? "" : esc(val || "")}" aria-label="Image path or URL">
        <input type="hidden" name="${f.n}" value="${esc(val || "")}"></div></div><p class="hint">Uploads are resized and stored in this browser. For a live site, use image paths such as assets/images/photo.jpg.</p></div>`;
    }
    return `<div class="field">${lab}<input id="${id}" name="${f.n}" type="${f.t || "text"}" value="${esc(val)}"${req}>${hint}</div>`;
  }
  function wireImages(form, dims) {
    $$(".img-field", form).forEach((box) => {
      const hidden = $("input[type=hidden]", box),
        prev = $(".img-prev", box),
        url = $("[data-url]", box),
        file = $("[data-file]", box);
      file.addEventListener("change", async () => {
        if (!file.files[0]) return;
        try {
          const r = await Utils.fileToImage(file.files[0], { maxW: 1000 });
          hidden.value = r.src;
          prev.src = r.src;
          url.value = "";
          dims.w = r.w;
          dims.h = r.h;
        } catch (e) {
          Utils.toast(e.message, "error");
        }
      });
      url.addEventListener("input", () => {
        hidden.value = url.value.trim();
        prev.src = Utils.assetUrl(hidden.value) || prev.src;
      });
    });
  }

  function crud(S) {
    const c = $("#admin-content");
    let q = "";
    c.innerHTML = `<div class="page-head"><div><h1>${esc(S.title)}</h1><p>${esc(S.sub)}</p></div><button type="button" class="btn btn-wine" id="add">${icon("plus", 18)} Add ${esc(S.one)}</button></div>
      <div class="toolbar"><label class="search">${icon("search", 18)}<span class="sr-only">Search ${esc(S.title)}</span><input type="search" id="q" placeholder="Search ${esc(S.title.toLowerCase())}"></label><span class="count" id="count" role="status"></span></div>
      <div class="table-wrap" id="tbl"></div>`;

    const cell = (col, r) => {
      const v = r[col.n];
      if (col.t === "image")
        return `<td><img class="thumb" src="${esc(Utils.assetUrl(v) || Utils.ph("", 0, 120, 120, ""))}" alt="" width="48" height="48" loading="lazy"></td>`;
      if (col.t === "date") return `<td>${esc(Utils.fmtDate(v))}</td>`;
      if (col.t === "bool")
        return `<td><span class="badge ${v ? "s-approved" : "s-pending"}">${v ? "Published" : "Draft"}</span></td>`;
      return `<td class="${col.n === S.label ? "strong" : "trunc"}">${esc(v)}</td>`;
    };
    function draw() {
      let rows = Store.all(S.key);
      if (S.sort) rows = rows.slice().sort(S.sort);
      const total = rows.length;
      if (q)
        rows = rows.filter((r) =>
          JSON.stringify(
            Object.values(r).filter(
              (x) => typeof x === "string" && !x.startsWith("data:"),
            ),
          )
            .toLowerCase()
            .includes(q),
        );
      $("#count").textContent = `${rows.length} of ${total}`;
      $("#tbl").innerHTML = rows.length
        ? `<table class="a-table"><thead><tr>${S.cols.map((x) => `<th scope="col">${x.l}</th>`).join("")}<th scope="col" class="actions-h">Actions</th></tr></thead><tbody>${rows
            .map(
              (
                r,
              ) => `<tr data-id="${r.id}">${S.cols.map((x) => cell(x, r)).join("")}<td class="actions">
        ${S.publishable ? `<button type="button" class="btn btn-ghost btn-xs" data-act="toggle">${r.published ? "Unpublish" : "Publish"}</button>` : ""}
        <button type="button" class="icon-btn-a" data-act="edit" aria-label="Edit ${esc(r[S.label])}">${icon("edit", 18)}</button>
        <button type="button" class="icon-btn-a danger" data-act="del" aria-label="Delete ${esc(r[S.label])}">${icon("trash", 18)}</button></td></tr>`,
            )
            .join("")}</tbody></table>`
        : `<div class="empty-state">${icon("plus", 28)}<p>${q ? "No matches for your search." : `No ${esc(S.title.toLowerCase())} yet.`}</p>${q ? "" : `<button type="button" class="btn btn-wine" data-empty-add>Add the first ${esc(S.one)}</button>`}</div>`;
      $("[data-empty-add]")?.addEventListener("click", () => openForm());
    }
    function openForm(item) {
      const editing = !!item,
        val = item || (S.defaults ? S.defaults() : {});
      const dims = {};
      openModal(
        `${editing ? "Edit" : "Add"} ${S.one}`,
        `<form class="a-form" novalidate>${S.fields.map((f) => fieldHTML(f, val[f.n])).join("")}
        <div class="a-actions"><button type="button" class="btn btn-ghost" data-cancel>Cancel</button><button type="submit" class="btn btn-wine">${editing ? "Save changes" : "Add " + esc(S.one)}</button></div></form>`,
        (d) => {
          const form = $("form", d);
          wireImages(form, dims);
          $("[data-cancel]", d).addEventListener("click", () => d.close());
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const rec = {};
            for (const f of S.fields) {
              const el = form.elements[f.n];
              rec[f.n] =
                f.t === "checkbox" ? el.checked : String(el.value || "").trim();
              if (f.req && !rec[f.n]) {
                el.focus();
                return Utils.toast(`${f.l} is required.`, "error");
              }
            }
            if (dims.w) {
              rec.w = dims.w;
              rec.h = dims.h;
            }
            const name = rec[S.label] || S.one;
            if (editing) {
              if (!Store.update(S.key, item.id, rec)) return;
              log(`Admin updated ${S.one}: ${name}.`);
              Utils.toast("Changes saved.");
            } else {
              if (!Store.add(S.key, rec)) return;
              log(
                S.key === KEYS.staff
                  ? `Admin added a new staff member: ${name}.`
                  : S.key === KEYS.gallery
                    ? `Gallery image added: ${name}.`
                    : S.key === KEYS.news && rec.published
                      ? `News article published: ${name}.`
                      : `Admin added ${S.one}: ${name}.`,
              );
              Utils.toast(`${S.one[0].toUpperCase() + S.one.slice(1)} added.`);
            }
            d.close();
            draw();
          });
          form.elements[S.fields[0].n]?.focus();
        },
        "a-modal--wide",
      );
    }
    $("#add").addEventListener("click", () => openForm());
    $("#q").addEventListener("input", (e) => {
      q = e.target.value.trim().toLowerCase();
      draw();
    });
    $("#tbl").addEventListener("click", async (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const id = b.closest("tr").dataset.id,
        item = Store.all(S.key).find((x) => x.id === id);
      if (b.dataset.act === "edit") openForm(item);
      if (b.dataset.act === "toggle") {
        Store.update(S.key, id, { published: !item.published });
        log(
          item.published
            ? `News article unpublished: ${item.title}.`
            : `News article published: ${item.title}.`,
        );
        Utils.toast(
          item.published ? "Article unpublished." : "Article published.",
        );
        draw();
      }
      if (
        b.dataset.act === "del" &&
        (await confirmBox(`Delete "${item[S.label]}"? This cannot be undone.`))
      ) {
        Store.remove(S.key, id);
        log(`Admin deleted ${S.one}: ${item[S.label]}.`);
        Utils.toast("Deleted.");
        draw();
      }
    });
    draw();
  }

  /* ---------------------------------- Dashboard ------------------------------- */
  function colChart(data, label) {
    const W = 420,
      H = 210,
      pt = 26,
      pb = 34,
      px = 12,
      gap = 14,
      n = data.length,
      bw = (W - px * 2 - gap * (n - 1)) / n;
    const max = Math.max(1, ...data.map((d) => d.v));
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}: ${data.map((d) => d.l + " " + d.v).join(", ")}">
      <line x1="0" x2="${W}" y1="${H - pb}" y2="${H - pb}" stroke="var(--line)"/>
      ${data
        .map((d, i) => {
          const h = Math.round(((H - pt - pb) * d.v) / max),
            x = px + i * (bw + gap),
            y = H - pb - h;
          return `<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(h, 2)}" rx="6" fill="var(--wine)"/><text x="${x + bw / 2}" y="${y - 7}" text-anchor="middle" class="chart-v">${d.v}</text><text x="${x + bw / 2}" y="${H - 12}" text-anchor="middle" class="chart-l">${esc(d.l)}</text>`;
        })
        .join("")}</svg>`;
  }
  function donut(data, label) {
    const total = data.reduce((s, d) => s + d.v, 0) || 1,
      R = 54,
      C = 2 * Math.PI * R;
    const cols = [
      "var(--wine)",
      "var(--gold)",
      "var(--green)",
      "#A8718A",
      "#8a8a8a",
    ];
    let off = 0;
    const segs = data
      .map((d, i) => {
        const len = (C * d.v) / total;
        const s = `<circle r="${R}" cx="70" cy="70" fill="none" stroke="${cols[i % 5]}" stroke-width="22" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"/>`;
        off += len;
        return s;
      })
      .join("");
    return `<div class="donut"><svg viewBox="0 0 140 140" role="img" aria-label="${esc(label)}: ${data.map((d) => d.l + " " + d.v).join(", ")}"><circle r="${R}" cx="70" cy="70" fill="none" stroke="var(--line)" stroke-width="22"/>${segs}<text x="70" y="75" text-anchor="middle" class="donut-n">${data.reduce((s, d) => s + d.v, 0)}</text></svg>
      <ul class="legend">${data.map((d, i) => `<li><span style="background:${cols[i % 5]}"></span>${esc(d.l)} <strong>${d.v}</strong></li>`).join("")}</ul></div>`;
  }
  function dashboard() {
    const adm = Store.all(KEYS.admissions),
      stu = Store.all(KEYS.students),
      msgs = Store.all(KEYS.messages);
    const cards = [
      ["Total Students", stu.length, "students", "students.html"],
      ["Admission Enquiries", adm.length, "clipboard", "admissions.html"],
      ["Staff", Store.all(KEYS.staff).length, "users", "staff.html"],
      [
        "Published News",
        Store.all(KEYS.news).filter((n) => n.published).length,
        "news",
        "news.html",
      ],
      [
        "Gallery Items",
        Store.all(KEYS.gallery).length,
        "image",
        "gallery.html",
      ],
      [
        "Unread Messages",
        msgs.filter((m) => m.status === "Unread").length,
        "mail",
        "messages.html",
      ],
    ];
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      months.push({
        y: d.getFullYear(),
        m: d.getMonth(),
        l: d.toLocaleDateString("en-GB", { month: "short" }),
        v: 0,
      });
    }
    adm.forEach((a) => {
      const d = new Date(a.iso);
      const m = months.find(
        (x) => x.y === d.getFullYear() && x.m === d.getMonth(),
      );
      if (m) m.v++;
    });
    const statuses = [
      "Pending",
      "Reviewed",
      "Contacted",
      "Approved",
      "Rejected",
    ].map((s) => ({ l: s, v: adm.filter((a) => a.status === s).length }));
    const maxS = Math.max(1, ...statuses.map((s) => s.v));
    const byLevel = [...cfg.levels.map((l) => l.name), "Other"]
      .map((n) => ({
        l: n,
        v: stu.filter((s) => levelOf(s.className) === n).length,
      }))
      .filter((x) => x.v);
    const acts = Store.all(KEYS.activities).slice(0, 6);
    $("#admin-content").innerHTML =
      `<div class="page-head"><div><h1>Dashboard</h1><p>Welcome back. Here is what is happening at ${esc(cfg.name)}.</p></div></div>
      <div class="stat-grid">${cards.map(([l, v, ic, href]) => `<a class="stat-card" href="${href}"><span class="stat-card__ic">${icon(ic, 22)}</span><strong>${v}</strong><span>${l}</span></a>`).join("")}</div>
      <div class="grid-2">
        <section class="panel"><h2>Enquiries in the last 6 months</h2>${colChart(months, "Admission enquiries per month")}</section>
        <section class="panel"><h2>Admission pipeline</h2><ul class="hbars">${statuses.map((s) => `<li><span>${s.l}</span><div class="hbar"><i class="${statusClass(s.l)}" style="width:${Math.round((s.v / maxS) * 100)}%"></i></div><b>${s.v}</b></li>`).join("")}</ul></section>
        <section class="panel"><h2>Students by section</h2>${byLevel.length ? donut(byLevel, "Students by section") : '<p class="muted">Add students to see this chart.</p>'}</section>
        <section class="panel"><h2>Recent activity</h2><ul class="feed">${acts.map((a) => `<li><span>${esc(a.text)}</span><time datetime="${a.iso}">${Utils.fmtDate(a.iso)} ${Utils.fmtTime(a.iso)}</time></li>`).join("") || '<li class="muted">No activity yet.</li>'}</ul><a class="link" href="activities.html">View all activity</a></section>
      </div>`;
  }

  /* --------------------------------- Admissions -------------------------------- */
  const ADM_STATUS = [
    "Pending",
    "Reviewed",
    "Contacted",
    "Approved",
    "Rejected",
  ];
  function admissionsPage() {
    const c = $("#admin-content");
    let filter = "All";
    c.innerHTML = `<div class="page-head"><div><h1>Admissions</h1><p>Enquiries submitted from the website. Update each status as you follow up.</p></div></div>
      <div class="chips" id="chips" role="group" aria-label="Filter by status"></div><div class="table-wrap" id="tbl"></div>`;
    function draw() {
      const all = Store.all(KEYS.admissions).sort((a, b) =>
        b.iso.localeCompare(a.iso),
      );
      $("#chips").innerHTML = ["All", ...ADM_STATUS]
        .map(
          (s) =>
            `<button type="button" class="chip-btn" aria-pressed="${s === filter}" data-s="${s}">${s} <span>${s === "All" ? all.length : all.filter((a) => a.status === s).length}</span></button>`,
        )
        .join("");
      const rows =
        filter === "All" ? all : all.filter((a) => a.status === filter);
      $("#tbl").innerHTML = rows.length
        ? `<table class="a-table"><thead><tr><th>Applicant</th><th>Parent</th><th>Class</th><th>Phone</th><th>Date</th><th>Status</th><th class="actions-h">Action</th></tr></thead><tbody>
        ${rows
          .map(
            (
              a,
            ) => `<tr data-id="${a.id}"><td class="strong">${esc(a.child)}<small>Age ${esc(a.childAge)}</small></td><td>${esc(a.parent)}<small>${esc(a.email)}</small></td><td>${esc(a.classApplying)}</td><td>${esc(a.phone)}</td><td>${Utils.fmtDate(a.iso)}</td>
        <td><select class="status-sel ${statusClass(a.status)}" aria-label="Status for ${esc(a.child)}">${ADM_STATUS.map((s) => `<option${s === a.status ? " selected" : ""}>${s}</option>`).join("")}</select></td>
        <td class="actions"><button type="button" class="icon-btn-a" data-act="view" aria-label="View ${esc(a.child)}">${icon("eye", 18)}</button><button type="button" class="icon-btn-a danger" data-act="del" aria-label="Delete enquiry for ${esc(a.child)}">${icon("trash", 18)}</button></td></tr>`,
          )
          .join("")}</tbody></table>`
        : `<div class="empty-state"><p>No enquiries${filter === "All" ? " yet" : " with this status"}.</p></div>`;
    }
    c.addEventListener("click", async (e) => {
      const chip = e.target.closest("[data-s]");
      if (chip) {
        filter = chip.dataset.s;
        return draw();
      }
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const id = b.closest("tr").dataset.id,
        a = Store.all(KEYS.admissions).find((x) => x.id === id);
      if (
        b.dataset.act === "del" &&
        (await confirmBox(`Delete the enquiry for ${a.child}?`))
      ) {
        Store.remove(KEYS.admissions, id);
        log(`Admin deleted admission enquiry: ${a.child}.`);
        draw();
        refreshBadges();
      }
      if (b.dataset.act === "view") {
        const wa = waPhone(a.phone);
        openModal(
          "Admission enquiry",
          `<dl class="detail"><div><dt>Child</dt><dd>${esc(a.child)}, age ${esc(a.childAge)}</dd></div><div><dt>Class applying for</dt><dd>${esc(a.classApplying)}</dd></div><div><dt>Parent / guardian</dt><dd>${esc(a.parent)}</dd></div>
          <div><dt>Email</dt><dd>${esc(a.email)}</dd></div><div><dt>Phone</dt><dd>${esc(a.phone)}</dd></div><div><dt>Preferred contact</dt><dd>${esc(a.contactMethod)}</dd></div><div><dt>Received</dt><dd>${Utils.fmtDate(a.iso)} at ${Utils.fmtTime(a.iso)}</dd></div><div><dt>Message</dt><dd>${esc(a.message) || "None"}</dd></div></dl>
          <div class="a-actions">${wa ? `<a class="btn btn-ghost" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent("Hello " + a.parent + ", thank you for your admission enquiry for " + a.child + " at " + cfg.name + ".")}">${icon("whatsapp", 18)} WhatsApp parent</a>` : ""}<a class="btn btn-wine" href="mailto:${esc(a.email)}">Email parent</a></div>`,
        );
      }
    });
    c.addEventListener("change", (e) => {
      const s = e.target.closest(".status-sel");
      if (!s) return;
      const id = s.closest("tr").dataset.id,
        a = Store.all(KEYS.admissions).find((x) => x.id === id);
      Store.update(KEYS.admissions, id, { status: s.value });
      log(`Admission status for ${a.child} changed to ${s.value}.`);
      Utils.toast(`Status set to ${s.value}.`);
      draw();
      refreshBadges();
    });
    draw();
  }

  /* ----------------------------------- Messages -------------------------------- */
  const MSG_STATUS = ["Unread", "Read", "Replied"];
  function messagesPage() {
    const c = $("#admin-content");
    c.innerHTML = `<div class="page-head"><div><h1>Messages</h1><p>Messages sent from the website contact form.</p></div></div><div class="table-wrap" id="tbl"></div>`;
    function draw() {
      const rows = Store.all(KEYS.messages).sort((a, b) =>
        b.iso.localeCompare(a.iso),
      );
      $("#tbl").innerHTML = rows.length
        ? `<table class="a-table"><thead><tr><th>Name</th><th>Subject</th><th>Message</th><th>Date</th><th>Status</th><th class="actions-h">Actions</th></tr></thead><tbody>
        ${rows
          .map(
            (
              m,
            ) => `<tr data-id="${m.id}" class="${m.status === "Unread" ? "is-unread" : ""}"><td class="strong">${esc(m.name)}<small>${esc(m.email)}${m.phone ? " · " + esc(m.phone) : ""}</small></td><td>${esc(m.subject)}</td><td class="trunc">${esc(m.message)}</td><td>${Utils.fmtDate(m.iso)}</td>
        <td><select class="status-sel m-${m.status.toLowerCase()}" aria-label="Status for message from ${esc(m.name)}">${MSG_STATUS.map((s) => `<option${s === m.status ? " selected" : ""}>${s}</option>`).join("")}</select></td>
        <td class="actions"><button type="button" class="icon-btn-a" data-act="view" aria-label="Open message from ${esc(m.name)}">${icon("eye", 18)}</button><button type="button" class="icon-btn-a danger" data-act="del" aria-label="Delete message from ${esc(m.name)}">${icon("trash", 18)}</button></td></tr>`,
          )
          .join("")}</tbody></table>`
        : `<div class="empty-state"><p>No messages yet. Messages sent from the Contact page appear here.</p></div>`;
    }
    c.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const id = b.closest("tr").dataset.id,
        m = Store.all(KEYS.messages).find((x) => x.id === id);
      if (
        b.dataset.act === "del" &&
        (await confirmBox(`Delete the message from ${m.name}?`))
      ) {
        Store.remove(KEYS.messages, id);
        log(`Admin deleted message from ${m.name}.`);
        draw();
        refreshBadges();
      }
      if (b.dataset.act === "view") {
        if (m.status === "Unread") {
          Store.update(KEYS.messages, id, { status: "Read" });
          draw();
          refreshBadges();
        }
        openModal(
          m.subject,
          `<dl class="detail"><div><dt>From</dt><dd>${esc(m.name)}</dd></div><div><dt>Email</dt><dd>${esc(m.email)}</dd></div><div><dt>Phone</dt><dd>${esc(m.phone) || "Not given"}</dd></div><div><dt>Received</dt><dd>${Utils.fmtDate(m.iso)} at ${Utils.fmtTime(m.iso)}</dd></div></dl><p class="msg-body">${esc(m.message)}</p>
          <div class="a-actions"><button type="button" class="btn btn-ghost" data-replied>Mark as replied</button><a class="btn btn-wine" href="mailto:${esc(m.email)}?subject=${encodeURIComponent("Re: " + m.subject)}">Reply by email</a></div>`,
          (d) => {
            $("[data-replied]", d).addEventListener("click", () => {
              Store.update(KEYS.messages, id, { status: "Replied" });
              log(`Admin replied to message from ${m.name}.`);
              d.close();
              draw();
            });
          },
        );
      }
    });
    c.addEventListener("change", (e) => {
      const s = e.target.closest(".status-sel");
      if (!s) return;
      Store.update(KEYS.messages, s.closest("tr").dataset.id, {
        status: s.value,
      });
      Utils.toast(`Marked as ${s.value.toLowerCase()}.`);
      draw();
      refreshBadges();
    });
    draw();
  }

  /* -------------------------------------- Fees ---------------------------------- */
  function feesPage() {
    const fees = Store.get(KEYS.fees) || defaultFees(),
      p = fees.payment;
    const inp = (name, label, v, extra = "") =>
      `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" value="${esc(v)}" ${extra}></div>`;
    $("#admin-content").innerHTML =
      `<div class="page-head"><div><h1>School Fees</h1><p>Type an amount such as ₦XX,XXX or "Contact School". Changes appear on the public Fees page straight away.</p></div><a class="btn btn-ghost" href="../fees.html" target="_blank" rel="noopener">${icon("external", 16)} View public page</a></div>
      <form class="a-form" id="fees-form" novalidate>
        <div class="grid-2">${cfg.levels.map((l) => `<fieldset class="panel"><legend>${esc(l.name)}</legend>${FEE_FIELDS.map(([k, lab]) => inp(`lv_${l.id}_${k}`, lab, (fees.levels[l.id] || {})[k] || "")).join("")}</fieldset>`).join("")}</div>
        <fieldset class="panel"><legend>Payment information</legend>
          <div class="grid-3">${inp("bankName", "Bank name", p.bankName)}${inp("accountName", "Account name", p.accountName)}${inp("accountNumber", "Account number", p.accountNumber, 'inputmode="numeric"')}</div>
          <div class="field"><label for="instructions">Payment instructions</label><textarea id="instructions" name="instructions" rows="3">${esc(p.instructions)}</textarea></div>
          <div class="field"><label for="note">Public notice under the fees heading</label><input id="note" name="note" value="${esc(p.note)}"><p class="hint">Leave empty to hide the notice.</p></div>
          <div class="grid-2">${p.methods.map((m, i) => `<div class="field"><label for="m${i}">Payment method ${i + 1}: description</label><input id="m${i}" name="m${i}" value="${esc(m.desc)}"><p class="hint">${esc(m.name)}</p></div>`).join("")}</div>
        </fieldset>
        <div class="a-actions sticky"><button type="submit" class="btn btn-wine">Save fee information</button></div></form>`;
    $("#fees-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target.elements,
        out = {
          levels: {},
          payment: {
            ...p,
            methods: p.methods.map((m, i) => ({
              ...m,
              desc: f["m" + i].value.trim(),
            })),
          },
        };
      cfg.levels.forEach((l) => {
        out.levels[l.id] = Object.fromEntries(
          FEE_FIELDS.map(([k]) => [
            k,
            f[`lv_${l.id}_${k}`].value.trim() || "Contact School",
          ]),
        );
      });
      [
        "bankName",
        "accountName",
        "accountNumber",
        "instructions",
        "note",
      ].forEach((k) => (out.payment[k] = f[k].value.trim()));
      if (Store.set(KEYS.fees, out)) {
        log("Fee information updated.");
        Utils.toast("Fees saved. The public Fees page is updated.");
      }
    });
  }

  /* ---------------------------------- Activities -------------------------------- */
  function activitiesPage() {
    const c = $("#admin-content");
    c.innerHTML = `<div class="page-head"><div><h1>Activities</h1><p>A record of what has happened on the website and in the dashboard.</p></div><button type="button" class="btn btn-ghost" id="clear">Clear log</button></div><div class="table-wrap" id="tbl"></div>`;
    const draw = () => {
      const rows = Store.all(KEYS.activities);
      $("#tbl").innerHTML = rows.length
        ? `<table class="a-table"><thead><tr><th>Activity</th><th>Admin</th><th>Date</th><th>Time</th></tr></thead><tbody>${rows.map((a) => `<tr><td class="strong">${esc(a.text)}</td><td>${esc(a.admin)}</td><td>${Utils.fmtDate(a.iso)}</td><td>${Utils.fmtTime(a.iso)}</td></tr>`).join("")}</tbody></table>`
        : `<div class="empty-state"><p>No activity recorded.</p></div>`;
    };
    $("#clear").addEventListener("click", async () => {
      if (await confirmBox("Clear the whole activity log?", "Clear log")) {
        Store.set(KEYS.activities, []);
        draw();
        Utils.toast("Activity log cleared.");
      }
    });
    draw();
  }

  /* ----------------------------------- Settings --------------------------------- */
  function settingsPage() {
    const o = Settings.overrides();
    const inp = (n, l, v, type = "text", extra = "") =>
      `<div class="field"><label for="${n}">${l}</label><input id="${n}" name="${n}" type="${type}" value="${esc(v)}" ${extra}></div>`;
    $("#admin-content").innerHTML =
      `<div class="page-head"><div><h1>Settings</h1><p>Update school details and branding. Changes apply to the public website in this browser.</p></div></div>
      <form class="a-form" id="settings-form" novalidate>
        <fieldset class="panel"><legend>School identity</legend>
          <div class="grid-2">${inp("name", "School name", cfg.name)}${inp("tagline", "Tagline", cfg.tagline)}</div>
          <div class="field"><label for="logo-file">Logo</label><div class="img-field"><img id="logo-prev" class="img-prev" src="${esc(Utils.assetUrl(cfg.logo))}" alt="Current logo" width="96" height="96"><div class="img-inputs"><input type="file" id="logo-file" accept="image/*"><button type="button" class="btn btn-ghost btn-xs" id="logo-reset">Use the logo from config.js</button></div></div></div>
          <div class="grid-2">${inp("heroTitle", "Hero headline", cfg.heroTitle)}${inp("heroSubtitle", "Hero sub-headline", cfg.heroSubtitle)}</div>
          <div class="field"><label for="heroText">Hero supporting text</label><textarea id="heroText" name="heroText" rows="2">${esc(cfg.heroText)}</textarea></div>
          ${inp("heroVideo", "Hero video path", cfg.heroVideo, "text", 'placeholder="assets/videos/school-hero.mp4"')}
        </fieldset>
        <fieldset class="panel"><legend>Contact</legend>
          <div class="grid-2">${inp("phone", "Phone", cfg.phone, "tel")}${inp("email", "Email", cfg.email, "email")}${inp("whatsapp", "WhatsApp number", cfg.whatsapp, "text", 'inputmode="numeric" aria-describedby="wa-h"')}${inp("openingHours", "Opening hours", cfg.openingHours)}</div>
          <p class="hint" id="wa-h">WhatsApp: international format, digits only, for example 2348012345678.</p>
          <div class="field"><label for="addressLines">Address (one line per row)</label><textarea id="addressLines" name="addressLines" rows="3">${esc(cfg.addressLines.join("\n"))}</textarea></div>
        </fieldset>
        <fieldset class="panel"><legend>Social media</legend><div class="grid-2">${["facebook", "instagram", "tiktok", "youtube"].map((k) => inp("social_" + k, k[0].toUpperCase() + k.slice(1) + " URL", cfg.social[k] || "", "url", 'placeholder="https://"')).join("")}</div></fieldset>
        <fieldset class="panel"><legend>Google Maps</legend><div class="field"><label for="mapUrl">Embed URL or full embed code</label><textarea id="mapUrl" name="mapUrl" rows="3" placeholder="Paste the Google Maps embed URL here">${esc(cfg.mapUrl)}</textarea><p class="hint">In Google Maps choose Share, then Embed a map, and paste the code or just the src address.</p></div></fieldset>
        <fieldset class="panel"><legend>Brand colours</legend><div class="grid-2 colors">
          <div class="field"><label for="c1">Primary colour</label><input id="c1" name="c1" type="color" value="${esc(cfg.colors.primary)}"></div>
          <div class="field"><label for="c2">Secondary colour</label><input id="c2" name="c2" type="color" value="${esc(cfg.colors.secondary)}"></div></div>
          <button type="button" class="btn btn-ghost btn-xs" id="colors-reset">Reset colours</button></fieldset>
        <fieldset class="panel"><legend>Homepage statistics</legend><div class="grid-4">${[
          ["years", "Years of Excellence"],
          ["students", "Students"],
          ["staff", "Qualified Staff"],
          ["programs", "School Programs"],
        ]
          .map(([k, l]) =>
            inp("stat_" + k, l, cfg.stats[k], "number", 'min="0"'),
          )
          .join("")}</div></fieldset>
        <fieldset class="panel"><legend>Footer</legend>${inp("designer", "Website designed by", cfg.designer)}</fieldset>
        <div class="a-actions sticky"><button type="submit" class="btn btn-wine">Save settings</button></div>
      </form>
      <section class="panel danger-zone"><h2>Demo data</h2><p>Export everything saved in this browser, or reset the demo to its original sample content.</p>
        <div class="a-actions left"><button type="button" class="btn btn-ghost" id="export">Download backup (JSON)</button><button type="button" class="btn btn-danger" id="reset">Reset demo data</button></div></section>`;

    const form = $("#settings-form");
    let logoData = o.logo;
    $("#logo-file").addEventListener("change", async (e) => {
      try {
        const r = await Utils.fileToImage(e.target.files[0], {
          maxW: 400,
          type: "image/png",
        });
        logoData = r.src;
        $("#logo-prev").src = r.src;
      } catch (err) {
        Utils.toast(err.message, "error");
      }
    });
    $("#logo-reset").addEventListener("click", () => {
      logoData = undefined;
      $("#logo-prev").src = Utils.assetUrl(schoolConfig.logo);
    });
    const previewColors = () => {
      document.documentElement.style.setProperty("--wine", form.c1.value);
      document.documentElement.style.setProperty("--gold", form.c2.value);
    };
    form.c1.addEventListener("input", previewColors);
    form.c2.addEventListener("input", previewColors);
    $("#colors-reset").addEventListener("click", () => {
      form.c1.value = schoolConfig.colors.primary;
      form.c2.value = schoolConfig.colors.secondary;
      previewColors();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = form.elements,
        v = (k) => f[k].value.trim();
      let map = v("mapUrl");
      const m = map.match(/src=["']([^"']+)["']/i);
      if (m) map = m[1];
      if (
        map &&
        !/^https:\/\/(www\.google\.com\/maps\/embed|maps\.google\.com\/)/.test(
          map,
        )
      ) {
        f.mapUrl.focus();
        return Utils.toast(
          "That does not look like a Google Maps embed URL.",
          "error",
        );
      }
      const lines = f.addressLines.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const next = {
        name: v("name"),
        tagline: v("tagline"),
        heroTitle: v("heroTitle"),
        heroSubtitle: v("heroSubtitle"),
        heroText: v("heroText"),
        heroVideo: v("heroVideo"),
        phone: v("phone"),
        email: v("email"),
        whatsapp: v("whatsapp"),
        openingHours: v("openingHours"),
        addressLines: lines,
        location: lines.join(", "),
        mapUrl: map,
        designer: v("designer"),
        social: Object.fromEntries(
          ["facebook", "instagram", "tiktok", "youtube"].map((k) => [
            k,
            v("social_" + k),
          ]),
        ),
        colors: { primary: f.c1.value, secondary: f.c2.value },
        stats: Object.fromEntries(
          ["years", "students", "staff", "programs"].map((k) => [
            k,
            Math.max(0, Number(v("stat_" + k)) || 0),
          ]),
        ),
      };
      if (logoData) next.logo = logoData;
      if (!next.name) {
        f.name.focus();
        return Utils.toast("School name is required.", "error");
      }
      Settings.saveOverrides(next);
      applyTheme();
      log("Website settings updated.");
      Utils.toast("Settings saved.");
    });
    $("#export").addEventListener("click", () => {
      const dump = Object.fromEntries(
        Object.values(KEYS).map((k) => [k, Store.get(k)]),
      );
      Utils.download(
        "school-backup.json",
        JSON.stringify(dump, null, 2),
        "application/json",
      );
    });
    $("#reset").addEventListener("click", async () => {
      if (
        await confirmBox(
          "Reset all demo data, settings and uploaded images in this browser?",
          "Reset everything",
        )
      ) {
        Store.clearAll();
        Settings._c = null;
        location.reload();
      }
    });
  }

  /* ------------------------------------ Login ----------------------------------- */
  function loginPage() {
    if (Auth.current()) return location.replace("dashboard.html");
    $$("[data-cfg]").forEach((el) => {
      const v = el.dataset.cfg.split(".").reduce((a, k) => a && a[k], cfg);
      if (v) el.textContent = v;
    });
    $$("[data-logo]").forEach((i) => (i.src = Utils.assetUrl(cfg.logo)));
    const form = $("#login-form"),
      err = $("#login-error"),
      pw = $("#password");
    $("#toggle-pw").addEventListener("click", (e) => {
      const show = pw.type === "password";
      pw.type = show ? "text" : "password";
      e.currentTarget.textContent = show ? "Hide" : "Show";
      e.currentTarget.setAttribute("aria-pressed", String(show));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const r = Auth.login(
        $("#username").value,
        pw.value,
        $("#remember").checked,
      );
      if (r.ok) {
        Activity.log("Admin signed in.", "admin");
        location.href = "dashboard.html";
      } else {
        err.textContent = r.error;
        err.hidden = false;
        pw.value = "";
        pw.focus();
      }
    });
    $("#forgot").addEventListener("click", () =>
      openModal(
        "Forgot password",
        `<p>This is a demo, so there is no email reset. Use the demo account shown on the login page.</p><p>On a live site, this link would send a secure reset email through your backend.</p><div class="a-actions"><button type="button" class="btn btn-wine" data-ok>Got it</button></div>`,
        (d) => $("[data-ok]", d).addEventListener("click", () => d.close()),
        "a-modal--sm",
      ),
    );
  }

  /* ------------------------------------ Router ---------------------------------- */
  if (PAGE === "login") return loginPage();
  if (!Auth.current()) return location.replace("login.html");
  shell();
  if (PAGE === "dashboard") dashboard();
  else if (PAGE === "admissions") admissionsPage();
  else if (PAGE === "messages") messagesPage();
  else if (PAGE === "fees") feesPage();
  else if (PAGE === "activities") activitiesPage();
  else if (PAGE === "settings") settingsPage();
  else if (SCHEMAS[PAGE]) crud(SCHEMAS[PAGE]);
})();
