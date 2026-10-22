import { img } from "./assets";
import type { Page } from "./types";

export const faqs = [
  { q: "Is ULL Auremont a CBSE school?", a: "Yes, from Nursery to Grade 10, following the National Curriculum Framework (NCF 2023) and NEP guidelines." },
  // TODO: replace "for many years" with the number of years once confirmed.
  { q: "Is ULL Auremont a new school?", a: "No. ULL has served Nagarbhavi for many years. As ULL Auremont, its academic programme has been renewed from the ground up." },
  { q: "Which textbooks do you use?", a: "NCERT textbooks for Mathematics, Science and Social Science from Grade 6. For Grades 1–5, and for languages, we use carefully chosen textbooks from established publishers, aligned with the NCERT curriculum." },
  { q: "Which languages are taught?", a: "English is the medium of instruction. Hindi and Kannada are taught; Kannada from Grade 1 to Grade 10." },
  { q: "How important is sport at ULL Auremont?", a: "Very. Sport is one of our four pillars. Every child has physical education, a fitness report card and house competitions, and talented children train for school teams and inter-school tournaments." },
  { q: "With all these activities, will academics suffer?", a: "No. Pulse and Ruchi take one period each a week, and Pulse activities are linked to the chapters being studied." },
  { q: "How do you prepare students for the Grade 10 board exam?", a: "With board-pattern questions in every Grade 9–10 test, a revision calendar, timed practice papers, past-paper analysis and preparation for both board exam phases." },
  { q: "Do you prepare children for competitive exams?", a: "The Summit Pathway, from Grade 6, builds the reasoning, reading, current affairs and debate skills that olympiads, competitive exams and the civil services rely on." },
  { q: "What does “Indian roots” mean? Is it religious?", a: "It means Indian and Karnataka knowledge, language and examples are part of everyday lessons, alongside world knowledge. ULL Auremont is inclusive and does not give religious instruction." },
  { q: "How will I know how my child is doing?", a: "Through term reports covering subjects, skills, fitness, hobbies and life skills; the Strengths Profile; parent–teacher meetings; and the Term Showcase." },
  { q: "When can I visit?", a: "Any working day by appointment, or at our next Term Showcase." },
];

export const morePages: Page[] = [
  {
    slug: "admissions",
    title: "Admissions: Nursery to Grade 10",
    description:
      "Admissions are open at ULL Auremont, a CBSE school in Nagarbhavi, Bengaluru, for Nursery to Grade 10. Enquire, visit the campus and join in five simple steps.",
    hero: {
      image: img.counselling,
      eyebrow: "Admissions",
      heading: "Admissions open, Nursery to Grade 10",
      lead: "The best way to understand ULL Auremont is to see it. Visit, meet our teachers and watch learning in action.",
      accent: "orange",
      actions: [
        { label: "Book a campus visit", href: "/admissions/visit/" },
        { label: "Enquire now", href: "/admissions/enquire/" },
      ],
    },
    blocks: [
      {
        type: "steps",
        eyebrow: "How to join",
        heading: "Five simple steps",
        items: [
          { title: "Enquire", text: "Enquire online or call our admissions team." },
          { title: "Visit", text: "Visit the campus and meet our academic team." },
          { title: "Meet", text: "A relaxed, age-appropriate interaction with your child." },
          { title: "Confirm", text: "Confirm admission and complete documents." },
          { title: "Orientation", text: "Orientation for you and your child before the year begins." },
        ],
      },
      { type: "enquiry", heading: "Start with an enquiry", lead: "Tell us a little about your child and we’ll call you back to plan your visit.", mode: "enquiry" },
      { type: "faq", eyebrow: "Questions parents ask", heading: "Frequently asked questions", items: faqs, tone: "cream" },
    ],
  },
  {
    slug: "admissions/visit",
    title: "Book a campus visit",
    description:
      "Book a visit to ULL Auremont in Nagarbhavi, Bengaluru. See classrooms, meet our teachers and watch learning in action, any working day by appointment.",
    breadcrumb: [{ label: "Admissions", href: "/admissions/" }],
    hero: {
      image: img.arrival,
      eyebrow: "Visit us",
      heading: "Ready to see it for yourself?",
      lead: "Visit any working day by appointment, or come to our next Term Showcase. Pick a date and we’ll confirm your slot on WhatsApp and email.",
      accent: "teal",
    },
    blocks: [{ type: "enquiry", mode: "visit" }],
  },
  {
    slug: "admissions/enquire",
    title: "Admissions enquiry",
    description:
      "Send an admissions enquiry to ULL Auremont, a CBSE school for Nursery to Grade 10 in Nagarbhavi, Bengaluru. Our team will call you back.",
    breadcrumb: [{ label: "Admissions", href: "/admissions/" }],
    hero: {
      image: img.admissionsForm,
      eyebrow: "Enquire",
      heading: "We’d love to hear about your child",
      lead: "Share a few details and our admissions team will get in touch.",
      accent: "orange",
    },
    blocks: [{ type: "enquiry", mode: "enquiry" }],
  },
  {
    slug: "campus",
    title: "Campus and facilities",
    description:
      "The ULL Auremont campus in Nagarbhavi, Bengaluru: classrooms, the Aurora Lab, computer and robotics lab, library, sports, arts studios and safety.",
    hero: {
      image: img.arrival,
      eyebrow: "Campus",
      heading: "A colourful world of learning",
      lead: "Classrooms, creative studios and room to play, in Nagarbhavi, Bengaluru.",
      accent: "teal",
    },
    blocks: [
      {
        type: "gallery",
        eyebrow: "A colourful world of learning",
        heading: "Find your rhythm. Discover your strengths.",
        lead: "Classrooms, creative studios and room to play.",
        note: "Campus design visualisations. Facilities subject to final confirmation.",
        items: [
          { image: img.arrival, title: "An Auremont welcome", caption: "Bold signage, cream walls and the school’s navy, yellow, orange and turquoise." },
          { image: img.toddler, title: "Playgroup", caption: "Ages 1–3" },
          { image: img.nursery, title: "Nursery & kindergarten", caption: "Reading corners and child-sized activity tables" },
          { image: img.primary, title: "Grades 3–5", caption: "Project work and group learning" },
          { image: img.senior, title: "Grades 5–9", caption: "Investigation and discussion" },
          { image: img.courtyard, title: "Sports courtyard", caption: "Two badminton courts and a volleyball court" },
          { image: img.vocal, title: "Aria Vocal Studio" },
          { image: img.music, title: "Music studio" },
          { image: img.dance, title: "Dance & movement studio" },
          { image: img.indoorGames, title: "Chess & indoor games" },
          { image: img.dining, title: "Kitchen & dining" },
          { image: img.passage, title: "Campus passage" },
        ],
      },
      {
        // TODO: replace with the confirmed facility list, descriptions and photos.
        type: "cards",
        tone: "cream",
        eyebrow: "Facilities",
        heading: "Spaces for every kind of learning",
        columns: 3,
        items: [
          { title: "Classrooms", accent: "navy", text: "Bright, child-sized spaces with reading corners." },
          { title: "Aurora Lab", accent: "gold", text: "A hands-on science lab where ideas dawn.", href: "/student-life/aurora-lab/" },
          { title: "Computer and robotics lab", accent: "teal", text: "Coding, programmable boards and creative media." },
          { title: "Library and reading corners", accent: "orange", text: "A culture of reading in every subject." },
          { title: "Sports", accent: "teal", text: "Courts and play spaces for every child.", href: "/student-life/sports/" },
          { title: "Art, music and dance rooms", accent: "gold", text: "Visual arts, music, dance and theatre as full subjects." },
          { title: "Infirmary", accent: "navy", text: "Care on hand through the school day." },
          { title: "Safety and security", accent: "orange", text: "Managed visitor entry and a safe, supervised campus." },
          { title: "Transport", accent: "teal", text: "Details on routes coming soon." },
        ],
      },
      {
        type: "cta",
        heading: "The best tour is in person",
        primary: { label: "Book a campus visit", href: "/admissions/visit/" },
      },
    ],
  },
  {
    slug: "parents",
    title: "For parents",
    description:
      "How ULL Auremont partners with parents: monthly Pulse notes, Kushala practice cards, Term Showcases, fitness report cards and parent–teacher meetings.",
    hero: {
      image: img.parent,
      eyebrow: "Parents",
      heading: "You will see the learning, not just hear about it",
      accent: "gold",
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "Partnering with parents",
        heading: "How we keep you close",
        columns: 3,
        items: [
          { title: "Monthly Pulse note", accent: "teal", text: "This month’s activities and the skill each one builds." },
          { title: "Kushala practice cards", accent: "orange", text: "A life skill to practise together at home." },
          { title: "Term Showcase", accent: "gold", text: "Every class presents what it has made and learned." },
          { title: "Fitness report card", accent: "navy", text: "Twice a year." },
          { title: "Parent–teacher meetings", accent: "teal", text: "Every term, built around your child’s Strengths Profile." },
          { title: "How you can help", accent: "orange", text: "Read with your child every day, ask them to teach you one thing they learned this week, and share your own work or skill with a class." },
        ],
      },
      {
        type: "table",
        tone: "cream",
        eyebrow: "A week at ULL Auremont",
        heading: "Meet Anika, 9, in Grade 4",
        lead: "Here are the moments she might tell you about at dinner.",
        columns: ["Day", "The moment she tells you about"],
        rows: [
          ["Monday", "In EVS she measured how much water her family uses in a day, after learning how Bengaluru’s old lakes once stored the city’s water."],
          ["Tuesday", "In Maths her group cut paper strips to compare fractions, then argued about which share was biggest."],
          ["Wednesday", "In Pulse she was a news anchor for two minutes, reading her own report on the school garden. In robotics, her motor finally made the model turn."],
          ["Thursday", "In Ruchi, the whole of Grade 4 split up: Anika went to the kitchen garden; her best friend went to Kathak."],
          ["Friday", "In the Aurora Lab she tested which materials float, guessed wrong twice, and worked out why."],
          ["Saturday", "In PE her house won the kho-kho round, and she beat her own sprint time. She brought home this month’s Kushala card: setting the table for a family meal."],
        ],
      },
      {
        type: "cta",
        heading: "Parent portal",
        text: "Register once, add your children and follow every application in one place.",
        primary: { label: "Go to the parent portal", href: "/portal/" },
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact us",
    description: "Contact ULL Auremont in Nagarbhavi, Bengaluru: admissions, visits and general enquiries.",
    hero: {
      image: img.arrival,
      eyebrow: "Contact",
      heading: "We’re here to help",
      lead: "Call, WhatsApp or send us a message. Our admissions team will get back to you.",
      accent: "navy",
    },
    blocks: [{ type: "enquiry", heading: "Send us a message", mode: "enquiry" }],
  },
  {
    slug: "portal",
    title: "Parent portal",
    description: "Register once, add your children and track every application to ULL Auremont.",
    hero: {
      image: img.admissionsForm,
      eyebrow: "Parent portal",
      heading: "One account for every application",
      lead: "Register once with your mobile number, add your children, apply, upload documents and follow progress. The portal opens with the next admissions cycle.",
      accent: "teal",
      actions: [{ label: "Enquire now", href: "/admissions/enquire/" }],
    },
    blocks: [],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    description: "How ULL Auremont collects, uses and protects personal data shared through this website.",
    hero: { eyebrow: "Legal", heading: "Privacy policy", accent: "navy" },
    blocks: [
      {
        // DRAFT: to be reviewed by the school before launch.
        type: "text",
        body: [
          "We collect the details you share with us through enquiry, visit and application forms (such as your name, phone number, email address and your child’s details) only to respond to you and to process admissions.",
          "We do not sell your data. We share it only with service providers who help us run admissions, such as our email, SMS and WhatsApp providers, and only for that purpose.",
          "You can ask us to see, correct or delete your data at any time by contacting the school office.",
          "This policy follows the Digital Personal Data Protection Act, 2023.",
        ],
      },
    ],
  },
];
