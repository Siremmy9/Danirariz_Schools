/* ==========================================================================
   storage.js  -  helpers, localStorage wrapper, settings, activity log, demo seed
   Frontend-only demo: every "database" table is a localStorage key.
   To move to a real backend later, replace the Store methods with fetch() calls.
   ========================================================================== */

const KEYS = {
  admissions: "school_admissions",
  staff: "school_staff",
  fees: "school_fees",
  news: "school_news",
  gallery: "school_gallery",
  messages: "school_messages",
  activities: "school_activities",
  settings: "school_settings",
  testimonials: "school_testimonials",
  students: "school_students",
  facilities: "school_facilities",
  academics: "school_academics",
  seeded: "school_seeded_v1",
};

/* ---------------------------------- Icons --------------------------------- */
const ICON_PATHS = {
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  facebook: "M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z",
  instagram:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01",
  youtube:
    "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 9l5 3-5 3z",
  tiktok: "M14 3v11a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.5 2 4.2 4.5 4.5",
  whatsapp:
    "M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21zM9 8.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 8.5z",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13",
  shield: "M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z",
  target:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
  scale:
    "M12 4v16M5 20h14M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0L5 8zM19 8l-2.5 6a3 3 0 0 0 5 0L19 8z",
  crown: "M3 18l1.5-10 5 4L12 6l2.5 6 5-4L21 18H3zM4 21h16",
  heart:
    "M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  check: "M5 12l4 4L19 7",
  chevL: "M15 5l-7 7 7 7",
  chevR: "M9 5l7 7-7 7",
  download: "M12 4v11M7 11l5 5 5-5M5 20h14",
  bank: "M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  building: "M4 21V8l8-5 8 5v13M9 21v-6h6v6",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  dashboard: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z",
  clipboard: "M9 4h6v3H9zM6 5h3M15 5h3v16H6V5M9 12h6M9 16h4",
  students: "M12 4l10 5-10 5L2 9l10-5zM6 12v5c3 2.5 9 2.5 12 0v-5",
  users:
    "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8",
  fees: "M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  news: "M5 4h11v16H5zM16 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h3",
  image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M8 9.5h.01",
  chat: "M4 5h16v11H9l-5 4V5z",
  activity: "M3 12h4l3-8 4 16 3-8h4",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .5-1.5-1.5L17 5l-3-1-1 2h-2L10 4 7 5l.5 2L6 8.5 4 8l-1 3 2 1v1l-2 1 1 3 2-.5L7.5 18 7 20l3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1v-1z",
  logout: "M9 4H5v16h4M16 8l4 4-4 4M20 12H9",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  plus: "M12 5v14M5 12h14",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
};
function icon(name, size = 22, cls = "") {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${ICON_PATHS[name] || ""}"/></svg>`;
}

/* --------------------------------- Utilities ------------------------------- */
const Utils = {
  $: (s, r = document) => r.querySelector(s),
  $$: (s, r = document) => Array.from(r.querySelectorAll(s)),
  esc(v) {
    return String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  },
  uid(p = "id") {
    return (
      p + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
    );
  },
  isObj: (o) => o && typeof o === "object" && !Array.isArray(o),
  merge(base, over) {
    if (!Utils.isObj(base)) return over === undefined ? base : over;
    const out = { ...base };
    for (const k in over || {})
      out[k] =
        Utils.isObj(base[k]) && Utils.isObj(over[k])
          ? Utils.merge(base[k], over[k])
          : over[k];
    return out;
  },
  fmtDate(iso) {
    const d = new Date(iso);
    return isNaN(d)
      ? ""
      : d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  },
  fmtTime(iso) {
    const d = new Date(iso);
    return isNaN(d)
      ? ""
      : d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  },
  daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  },
  initials(name) {
    return (
      String(name || "?")
        .replace(/[^\p{L}\s]/gu, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("") || "?"
    );
  },
  /* On-brand generated placeholder image (SVG data URI). Replace with real photos. */
  ph(label = "", i = 0, w = 800, h = 600, sub = "Replace with school photo") {
    const PAL = [
      ["#6D1230", "#1E6B3F"],
      ["#8A1B3D", "#D4A017"],
      ["#1E6B3F", "#0F3D24"],
      ["#4A0D22", "#6D1230"],
      ["#B8860B", "#6D1230"],
      ["#14532D", "#D4A017"],
    ];
    const [a, b] = PAL[Math.abs(i) % PAL.length];
    const s = Math.min(w, h);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="${w * 0.82}" cy="${h * 0.2}" r="${s * 0.28}" fill="#fff" fill-opacity=".07"/><circle cx="${w * 0.12}" cy="${h * 0.9}" r="${s * 0.36}" fill="#fff" fill-opacity=".06"/><path d="M${w / 2 - s * 0.09} ${h * 0.42}h${s * 0.18}v${s * 0.14}h-${s * 0.18}z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${s * 0.012}"/><text x="50%" y="${h * 0.66}" text-anchor="middle" font-family="Georgia,serif" font-size="${Math.max(18, s * 0.07)}" fill="#fff" fill-opacity=".92">${Utils.esc(label)}</text><text x="50%" y="${h * 0.74}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${Math.max(12, s * 0.035)}" fill="#fff" fill-opacity=".6">${Utils.esc(sub)}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  },
  assetUrl(p) {
    if (!p) return "";
    if (/^(data:|https?:|\/\/|blob:)/.test(p)) return p;
    return (document.body.dataset.root || "") + p;
  },
  /* Resize an uploaded image and return {src,w,h} (keeps localStorage small). */
  fileToImage(file, { maxW = 1000, quality = 0.82, type = "image/jpeg" } = {}) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/"))
        return reject(new Error("Please choose an image file."));
      const fr = new FileReader();
      fr.onerror = () => reject(new Error("Could not read that file."));
      fr.onload = () => {
        if (file.type === "image/svg+xml")
          return resolve({ src: fr.result, w: 800, h: 600 });
        const img = new Image();
        img.onerror = () =>
          reject(new Error("That image could not be opened."));
        img.onload = () => {
          const r = Math.min(1, maxW / img.width);
          const w = Math.round(img.width * r),
            h = Math.round(img.height * r);
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve({ src: c.toDataURL(type, quality), w, h });
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  },
  toast(msg, type = "ok") {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    const t = document.createElement("div");
    t.className = "toast toast--" + type;
    t.setAttribute("role", type === "error" ? "alert" : "status");
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => t.classList.add("out"), 3400);
    setTimeout(() => t.remove(), 3900);
  },
  /* Normalise a Nigerian/international phone number to digits for wa.me */
  waDigits(phone) {
    let d = String(phone || "").replace(/\D/g, "");
    if (d.startsWith("0")) d = "234" + d.slice(1);
    return d;
  },
  validDigits(v) {
    return /^\d{10,15}$/.test(Utils.waDigits(v));
  },
  waLink(msg, number) {
    const cfg = Settings.get();
    const digits = Utils.waDigits(number || cfg.whatsapp);
    const text = encodeURIComponent(msg || cfg.whatsappMessage);
    return Utils.validDigits(digits)
      ? `https://wa.me/${digits}?text=${text}`
      : `https://wa.me/?text=${text}`;
  },
  download(filename, text, mime = "text/csv;charset=utf-8") {
    const url = URL.createObjectURL(
      new Blob(["\ufeff" + text], { type: mime }),
    );
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: filename,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};

/* ----------------------------------- Store -------------------------------- */
const Store = {
  get(k, fb = null) {
    try {
      const r = localStorage.getItem(k);
      return r === null ? fb : JSON.parse(r);
    } catch (e) {
      return fb;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch (e) {
      Utils.toast(
        "Browser storage is full. Use smaller images or image paths.",
        "error",
      );
      return false;
    }
  },
  all(k) {
    const v = Store.get(k, []);
    return Array.isArray(v) ? v : [];
  },
  add(k, item, { front = false } = {}) {
    const a = Store.all(k);
    item.id = item.id || Utils.uid();
    front ? a.unshift(item) : a.push(item);
    return Store.set(k, a) ? item : null;
  },
  update(k, id, patch) {
    const a = Store.all(k),
      i = a.findIndex((x) => x.id === id);
    if (i < 0) return null;
    a[i] = { ...a[i], ...patch };
    return Store.set(k, a) ? a[i] : null;
  },
  remove(k, id) {
    return Store.set(
      k,
      Store.all(k).filter((x) => x.id !== id),
    );
  },
  clearAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

/* --------------------------------- Settings -------------------------------- */
const Settings = {
  _c: null,
  get() {
    if (!Settings._c)
      Settings._c = Utils.merge(schoolConfig, Store.get(KEYS.settings, {}));
    return Settings._c;
  },
  overrides() {
    return Store.get(KEYS.settings, {});
  },
  saveOverrides(o) {
    Store.set(KEYS.settings, o);
    Settings._c = null;
  },
};

function applyTheme() {
  const c = Settings.get().colors || {},
    r = document.documentElement.style;
  if (c.primary) r.setProperty("--wine", c.primary);
  if (c.secondary) r.setProperty("--gold", c.secondary);
}

/* ------------------------------ Activity log ------------------------------- */
const Activity = {
  log(text, admin = "System") {
    const a = Store.all(KEYS.activities);
    a.unshift({
      id: Utils.uid("act"),
      text,
      admin,
      iso: new Date().toISOString(),
    });
    Store.set(KEYS.activities, a.slice(0, 300));
  },
};

/* ----------------------------------- Fees ---------------------------------- */
const FEE_FIELDS = [
  ["tuition", "Tuition fee"],
  ["registration", "Registration fee"],
  ["levy", "Development levy"],
  ["books", "Books"],
  ["uniform", "Uniform"],
  ["other", "Other applicable fees"],
];
function defaultFees() {
  const row = () =>
    Object.fromEntries(FEE_FIELDS.map(([k]) => [k, "Contact School"]));
  return {
    levels: { creche: row(), nursery: row(), primary: row(), secondary: row() },
    payment: {
      note: "Fees and payment information can be updated by the school administrator.",
      bankName: "Bank Name",
      accountName: "Account Name",
      accountNumber: "XXXXXXXXXX",
      instructions:
        "Please use your child's full name and class as the payment reference, and send proof of payment to the school office or via WhatsApp.",
      methods: [
        {
          name: "Bank Transfer",
          desc: "Transfer to the school account shown below and keep your receipt.",
        },
        { name: "POS", desc: "Pay by card at the school payment office." },
        {
          name: "School Payment Office",
          desc: "Pay in person at the bursary during opening hours.",
        },
        {
          name: "Online Payment",
          desc: "Online payment link to be provided by the school.",
        },
      ],
    },
  };
}

/* ------------------------------- Demo seed data ---------------------------- */
const Seed = {
  run() {
    if (Store.get(KEYS.seeded)) return;
    const ph = Utils.ph,
      d = Utils.daysAgo;
    const cfg = Settings.get();

    Store.set(KEYS.fees, defaultFees());

    const staff = [
      ["Principal", "Administration", "Principal's Name"],
      ["Vice Principal", "Administration", "Vice Principal's Name"],
      ["Head Teacher", "Primary", "Head Teacher's Name"],
      ["Class Teacher", "Nursery", "Class Teacher's Name"],
      ["Subject Teacher", "Secondary", "Subject Teacher's Name"],
      ["Administrator", "School Office", "Administrator's Name"],
    ];
    Store.set(
      KEYS.staff,
      staff.map(([position, department, name], i) => ({
        id: Utils.uid("stf"),
        name,
        position,
        department,
        phone: "",
        email: "",
        bio: "Add a short biography here: qualifications, years of experience and what this person brings to the school.",
        photo: ph("Staff photo", i, 600, 700, "Upload a portrait"),
      })),
    );

    const ex = (t) =>
      `${t} Replace this sample text with the real announcement from the school.`;
    const news = [
      [
        "School Resumption",
        "Announcement",
        3,
        "Resumption dates, school hours and first-week arrangements are shared here once confirmed.",
      ],
      [
        "Inter-House Sports",
        "Sports",
        10,
        "Highlights, house points and photos from the school's sports competition.",
      ],
      [
        "Graduation Ceremony",
        "Events",
        18,
        "Details of the ceremony for graduating pupils, with a guide for families.",
      ],
      [
        "Parents Meeting",
        "Parents",
        25,
        "Date, time and agenda for the next parents' meeting.",
      ],
      [
        "Cultural Day",
        "Events",
        33,
        "A day to celebrate Nigerian cultures through food, dress, music and dance.",
      ],
      [
        "Excursion",
        "Events",
        41,
        "Where our pupils are going, what to bring and how to give consent.",
      ],
      [
        "Examination Timetable",
        "Academics",
        50,
        "The examination timetable and guidance for parents and pupils.",
      ],
      [
        "Admission Announcement",
        "Admissions",
        58,
        "Admission is open. Read how to begin the process for your child.",
      ],
    ];
    Store.set(
      KEYS.news,
      news.map(([title, category, ago, excerpt], i) => ({
        id: Utils.uid("nws"),
        title,
        category,
        date: d(ago).slice(0, 10),
        excerpt,
        content:
          ex(excerpt) +
          "\n\nContact the school office or message us on WhatsApp if you have questions.",
        image: ph(title, i + 1, 800, 500),
        published: i !== 6, // one unpublished draft to demo the toggle
      })),
    );

    const g = [
      ["Bright classroom", "Classrooms"],
      ["Reading time", "Students"],
      ["Sports day", "Sports"],
      ["Graduation day", "Graduation"],
      ["Cultural parade", "Cultural Activities"],
      ["Science corner", "Facilities"],
      ["Assembly", "Students"],
      ["Inter-house relay", "Sports"],
      ["Art lesson", "Classrooms"],
      ["Open day", "Events"],
      ["Playground", "Facilities"],
      ["Traditional dance", "Cultural Activities"],
    ];
    const dims = [
      [800, 600],
      [600, 800],
      [800, 520],
      [700, 700],
    ];
    Store.set(
      KEYS.gallery,
      g.map(([caption, category], i) => {
        const [w, h] = dims[i % dims.length];
        return {
          id: Utils.uid("gal"),
          caption,
          category,
          w,
          h,
          src: ph(caption, i, w, h),
        };
      }),
    );

    const fac = [
      [
        "Modern Classrooms",
        "Bright, well-ventilated classrooms arranged for active learning.",
      ],
      [
        "ICT Laboratory",
        "Computers for hands-on digital skills from the early years.",
      ],
      [
        "Science Laboratory",
        "Safe space for experiments that bring science to life.",
      ],
      ["Library", "A quiet reading space with age-appropriate books."],
      ["Playground", "Safe outdoor play areas for the youngest learners."],
      [
        "Sports Facilities",
        "Space for football, athletics and inter-house competitions.",
      ],
      ["School Bus", "Safe, supervised transport on set routes."],
      ["Security", "Controlled access and attentive staff on duty."],
      ["Cafeteria", "Clean, supervised space for meals and snacks."],
      [
        "Medical and First Aid",
        "First-aid support for minor injuries and emergencies.",
      ],
      ["Creative Arts Area", "A dedicated area for art, music and drama."],
    ];
    Store.set(
      KEYS.facilities,
      fac.map(([title, description], i) => ({
        id: Utils.uid("fac"),
        title,
        description,
        image: ph(title, i + 2, 800, 600),
      })),
    );

    const approach = [
      [
        "Curriculum",
        "A structured, age-appropriate curriculum that builds strong foundations in literacy, numeracy, science and the arts.",
      ],
      [
        "ICT education",
        "Computer skills, safe internet use and early coding ideas taught at each stage.",
      ],
      [
        "Co-curricular activities",
        "Clubs and societies that let pupils explore interests beyond the classroom.",
      ],
      [
        "Sports",
        "Regular physical education, team games and inter-house competitions.",
      ],
      [
        "Creative arts",
        "Art, music, drama and dance to build expression and confidence.",
      ],
      [
        "Leadership development",
        "Prefect roles, public speaking and service projects for every age group.",
      ],
      [
        "Moral and character education",
        "Lessons and daily routines that build honesty, respect and responsibility.",
      ],
    ];
    const subjects = [
      "Mathematics",
      "English Language",
      "Basic Science",
      "Computer Studies",
      "Social Studies",
      "Civic Education",
      "Literature",
      "Creative Arts",
      "Physical Education",
      "Religious and Moral Education",
    ];
    Store.set(KEYS.academics, [
      ...approach.map(([title, description]) => ({
        id: Utils.uid("acd"),
        type: "Approach",
        title,
        description,
      })),
      ...subjects.map((title) => ({
        id: Utils.uid("acd"),
        type: "Subject",
        title,
        description: "",
      })),
    ]);

    const tq = [
      [
        "We are grateful for the quality of education and care our child receives.",
        "Parent, Primary 4",
      ],
      [
        "The teachers know every child by name, and our son looks forward to school every morning.",
        "Parent, Nursery 2",
      ],
      [
        "Discipline and academics go together here. We have seen real growth in confidence.",
        "Parent, JSS 2",
      ],
      [
        "Communication with the school is quick and clear, and the staff are always welcoming.",
        "Parent, Crèche",
      ],
    ];
    Store.set(
      KEYS.testimonials,
      tq.map(([quote, childClass], i) => ({
        id: Utils.uid("tst"),
        name: "Parent Name",
        childClass,
        quote,
        photo: "",
      })),
    );

    const names = [
      ["Chidera Okafor", "Primary 3"],
      ["Amara Bello", "Nursery 2"],
      ["Tunde Adeyemi", "JSS 1"],
      ["Zainab Musa", "Primary 5"],
      ["Emeka Nwosu", "SS 2"],
      ["Ife Balogun", "Crèche"],
      ["Chioma Eze", "Primary 1"],
      ["David Ojo", "JSS 3"],
      ["Halima Yusuf", "Nursery 1"],
      ["Kelechi Obi", "Primary 6"],
      ["Tomiwa Coker", "SS 1"],
      ["Ngozi Ibe", "Nursery 3"],
      ["Samuel Ade", "Primary 2"],
      ["Fatima Aliyu", "JSS 2"],
    ];
    Store.set(
      KEYS.students,
      names.map(([name, cls], i) => ({
        id: Utils.uid("stu"),
        name,
        className: cls,
        parent: "Parent / Guardian",
        phone: "",
        admitted: d(40 + i * 9).slice(0, 10),
      })),
    );

    const adm = [
      ["Ada Johnson", 4, "Chinwe Johnson", "Nursery 2", "Pending", 1],
      ["Femi Lawal", 9, "Bola Lawal", "Primary 5", "Reviewed", 4],
      ["Maryam Sani", 2, "Aisha Sani", "Crèche", "Contacted", 7],
      ["Obinna Uche", 12, "Ngozi Uche", "JSS 1", "Approved", 12],
      ["Kemi Ola", 6, "Tayo Ola", "Primary 1", "Rejected", 19],
    ];
    Store.set(
      KEYS.admissions,
      adm.map(([child, age, parent, cls, status, ago], i) => ({
        id: Utils.uid("adm"),
        child,
        childAge: age,
        parent,
        email: "parent@example.com",
        phone: "08000000000",
        classApplying: cls,
        contactMethod: i % 2 ? "Email" : "Phone call",
        message: "Sample enquiry for demo purposes.",
        status,
        iso: d(ago),
      })),
    );

    const msgs = [
      [
        "Sample Parent",
        "Can I book a school visit?",
        "Hello, please what days are available for a school tour?",
        "Unread",
        0,
      ],
      [
        "Sample Guardian",
        "Bus routes",
        "Does the school bus cover Lekki-Epe? Kindly advise.",
        "Read",
        3,
      ],
      [
        "Sample Visitor",
        "Admission requirements",
        "What documents are needed for Primary 1 admission?",
        "Replied",
        6,
      ],
    ];
    Store.set(
      KEYS.messages,
      msgs.map(([name, subject, message, status, ago]) => ({
        id: Utils.uid("msg"),
        name,
        email: "visitor@example.com",
        phone: "08000000000",
        subject,
        message,
        status,
        iso: d(ago),
      })),
    );

    Store.set(
      KEYS.activities,
      [
        ["Gallery image added.", "admin", 2],
        ["News article published.", "admin", 3],
        ["Fee information updated.", "admin", 5],
        ["New admission enquiry received.", "System", 7],
        ["Admin added a new staff member.", "admin", 9],
      ].map(([text, admin, ago]) => ({
        id: Utils.uid("act"),
        text,
        admin,
        iso: d(ago),
      })),
    );

    Store.set(KEYS.seeded, true);
  },
};
