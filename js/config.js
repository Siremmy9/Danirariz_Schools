/* ==========================================================================
   config.js  -  THE ONE FILE TO EDIT WHEN CLONING THIS TEMPLATE FOR ANOTHER SCHOOL
   --------------------------------------------------------------------------
   Everything on the public website and in the admin dashboard reads from this
   object. Values saved from Admin > Settings (localStorage) override these
   defaults in the browser where they were saved.

   Placeholders (e.g. "234XXXXXXXXXX") are deliberate. Replace them with real
   details before going live. Nothing here is invented: where the school did
   not provide a fact, a clearly marked placeholder is used.
   ========================================================================== */

const schoolConfig = {
  /* ---- Identity ---- */
  name: "Danirariz Schools",
  tagline: "Home of Leaders... Where The Future Begins!",
  heroTitle: "Home of Leaders",
  heroSubtitle: "Where The Future Begins!",
  heroText:
    "Building confident, knowledgeable and responsible young minds through quality education, discipline and character.",

  /* ---- Address ---- */
  location: "Majek, opposite Fara Park Estate, Epe-Ajah Expressway, Lagos",
  addressLines: [
    "Majek, opposite Fara Park Estate,",
    "Epe-Ajah Expressway,",
    "Lagos, Nigeria.",
  ],

  /* ---- Contact (replace the placeholders) ---- */
  phone: "+234 903 010 9127",
  email: "info@danirarizschool.com",
  whatsapp: "2349030109127", // international format, digits only, no "+"
  whatsappMessage:
    "Hello Danirariz Schools, I would like to make an enquiry about admission.",
  openingHours:
    "Monday to Friday, 8:00am to 4:00pm (update in Admin > Settings)",

  /* ---- Media ---- */
  // Logo: replace assets/logo/logo.svg with your logo file, or point to a new path.
  logo: "assets/images/logo.jpg",
  // Hero video: put your MP4 at this path. If the file is missing, the poster/hero image is shown.
  heroVideo: "assets/videos/school-hero.mp4",
  // Optional: path to a hero fallback image (JPG/WebP). Empty = generated placeholder.
  heroPoster: "assets/images/logo.jpg",
  // Optional section images (paths). Empty = generated placeholders you can spot and replace.
  images: {
    about: "assets/images/logo.jpg",
    creche: "",
    nursery: "",
    primary: "",
    secondary: "",
  },

  /* ---- Google Maps ---- */
  // PASTE GOOGLE MAP EMBED URL HERE (Google Maps > Share > Embed a map > copy the src="..." value)
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.4164415064893!2d3.6547908000000002!3d6.4688142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf94e2cc199a5%3A0xdfb25373f783331d!2sDanirariz%20School!5e0!3m2!1sen!2sng!4v1790916884033!5m2!1sen!2sng",
  // <!-- <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.4164415064893!2d3.6547908000000002!3d6.4688142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf94e2cc199a5%3A0xdfb25373f783331d!2sDanirariz%20School!5e0!3m2!1sen!2sng!4v1790916884033!5m2!1sen!2sng" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>, -->

  /* ---- Social links (leave empty to show a "not set" placeholder) ---- */
  social: { facebook: "", instagram: "", youtube: "", tiktok: "" },

  /* ---- Brand colours (editable in Admin > Settings) ---- */
  colors: { primary: "#6D1230", secondary: "#D4A017" },

  /* ---- Footer credit (editable in Admin > Settings) ---- */
  designer: "[Emmanuel | Sowftech]",

  /* ---- Homepage statistics: SAMPLE numbers, update in Admin > Settings ---- */
  stats: { years: 10, students: 500, staff: 40, programs: 12 },

  /* ---- Sections of the school ---- */
  levels: [
    {
      id: "creche",
      name: "Crèche",
      age: "Ages 0 to 2 ",
      desc: "A safe, nurturing and stimulating environment for our youngest learners.",
      focus: [
        "Caring, closely supervised daily routines",
        "Sensory play and early movement",
        "First words, songs and stories",
      ],
      classes: ["Crèche"],
    },
    {
      id: "nursery",
      name: "Nursery",
      age: "Ages 3 to 5 ",
      desc: "Building strong foundations through play, discovery and early learning.",
      focus: [
        "Early literacy and numeracy through play",
        "Creative arts, rhymes and music",
        "Social skills, sharing and good manners",
      ],
      classes: ["Nursery 1", "Nursery 2", "Nursery 3"],
    },
    {
      id: "primary",
      name: "Primary",
      age: "Primary 1 to Primary 6",
      desc: "Developing academic knowledge, confidence, creativity and character.",
      focus: [
        "Strong core subjects: English, Mathematics and Science",
        "ICT, sports and creative arts every week",
        "Moral education and leadership roles",
      ],
      classes: [
        "Primary 1",
        "Primary 2",
        "Primary 3",
        "Primary 4",
        "Primary 5",
        "Primary 6",
      ],
    },
    {
      id: "secondary",
      name: "Secondary",
      age: "JSS 1 to SS 3",
      desc: "Preparing students for higher education, leadership and future opportunities.",
      focus: [
        "Rigorous subject teaching and examination preparation",
        "Mentoring, clubs and student leadership",
        "Guidance towards university and career paths",
      ],
      classes: ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"],
    },
  ],

  /* ---- About page copy (sample text, edit freely) ---- */
  about: {
    intro:
      "Danirariz Schools is a family-focused school offering Crèche, Nursery, Primary and Secondary education. We partner with parents to raise children who are confident, knowledgeable and responsible, and who are ready to lead.",
    mission:
      "To provide quality education in a safe, disciplined and caring environment that develops the whole child: mind, character and talent.",
    vision:
      "To be the home of leaders: a school where every child discovers their potential and is prepared for the future.",
    philosophy:
      "Children learn best when they feel safe, known and challenged. We combine firm discipline with warm relationships, and strong academics with character, creativity and service.",
  },

  values: [
    {
      title: "Discipline",
      icon: "shield",
      text: "Clear routines and high standards that help children grow in self-control.",
    },
    {
      title: "Excellence",
      icon: "target",
      text: "We aim for the best in every lesson, every activity and every result.",
    },
    {
      title: "Integrity",
      icon: "scale",
      text: "Honesty and fairness guide how our pupils and staff behave.",
    },
    {
      title: "Leadership",
      icon: "crown",
      text: "Every child gets chances to lead, speak up and serve others.",
    },
    {
      title: "Character",
      icon: "heart",
      text: "Respect, kindness and responsibility are taught as carefully as mathematics.",
    },
    {
      title: "Innovation",
      icon: "bulb",
      text: "Curious minds are encouraged to ask questions and try new ideas.",
    },
  ],

  admissionSteps: [
    {
      title: "Submit enquiry",
      text: "Fill in the enquiry form below or message us on WhatsApp.",
    },
    {
      title: "Schedule a visit",
      text: "Tour the school and meet our team at a time that suits you.",
    },
    {
      title: "Complete admission form",
      text: "Provide your child's details and the required documents.",
    },
    {
      title: "Assessment or interview",
      text: "A friendly, age-appropriate assessment for your child.",
    },
    {
      title: "Admission confirmation",
      text: "We confirm the outcome and share the next steps.",
    },
    {
      title: "Enrollment",
      text: "Complete payment and welcome your child to the school.",
    },
  ],

  galleryCategories: [
    "Classrooms",
    "Students",
    "Events",
    "Sports",
    "Graduation",
    "Cultural Activities",
    "Facilities",
  ],
  newsCategories: [
    "Announcement",
    "Admissions",
    "Events",
    "Sports",
    "Academics",
    "Parents",
  ],

  /* ---- Demo admin account: see js/admin.js (DEMO AUTH ONLY) ---- */
  siteUrl: "", // e.g. "https://www.danirariz.com" (used for SEO; update canonical tags in the HTML too)
};
