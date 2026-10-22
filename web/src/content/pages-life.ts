import { img } from "./assets";
import type { Page } from "./types";

const bc = [{ label: "Student Life", href: "/student-life/" }];
const cta = {
  type: "cta" as const,
  heading: "Come and see a school week in action",
  primary: { label: "Book a campus visit", href: "/admissions/visit/" },
  secondary: { label: "Enquire now", href: "/admissions/enquire/" },
};

export const lifePages: Page[] = [
  {
    slug: "student-life",
    title: "Student life: sport, skills and hobbies",
    description:
      "Sport for every child, a skill and a hobby every week, a life skill every month, plus the Aurora Lab, robotics and the Summit Pathway at ULL Auremont.",
    hero: {
      image: img.courtyard,
      eyebrow: "Student life",
      heading: "Learning for life, planned every week",
      lead: "A skill every week, a hobby every week and a life skill every month, alongside sport and fitness for every child.",
      accent: "teal",
    },
    blocks: [
      {
        type: "subnav",
        items: [
          { title: "Sports & Fitness", tag: "Nursery–Grade 10", image: img.courtyard, href: "/student-life/sports/", text: "Fit body. Sharp mind. Strong character.", accent: "orange" },
          { title: "Pulse", tag: "Weekly skills", image: img.primary, href: "/student-life/pulse/", text: "A skill every week. For every child.", accent: "teal" },
          { title: "Ruchi", tag: "Hobby hour · Grades 1–8", image: img.dance, href: "/student-life/ruchi/", text: "Find what you love. Then get good at it.", accent: "gold" },
          { title: "Kushala", tag: "Life skills", image: img.dining, href: "/student-life/kushala/", text: "Capable at school. Capable at home.", accent: "navy" },
          { title: "Aurora Lab & robotics", tag: "Grades 1–8", image: img.senior, href: "/student-life/aurora-lab/", text: "Touch it. Test it. Build it. Code it.", accent: "teal" },
          { title: "Summit Pathway", tag: "Grades 6–10", image: img.vocal, href: "/student-life/summit-pathway/", text: "Aim high.", accent: "orange" },
        ],
      },
      cta,
    ],
  },
  {
    slug: "student-life/sports",
    title: "Sports & Fitness",
    description:
      "At ULL Auremont every child plays, is measured, competes for their house and can excel: athletics, football, cricket, basketball, kabaddi, yoga and more.",
    breadcrumb: bc,
    hero: {
      image: img.courtyard,
      eyebrow: "Sports & Fitness",
      heading: "Fit body. Sharp mind. Strong character.",
      lead: "At ULL Auremont, sport is a pillar of education, as important as academics. On the field, children learn discipline, teamwork, courage, fair play and how to win and lose with grace. A fit child learns better, focuses longer and handles pressure well.",
      accent: "orange",
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "Our sports promise",
        heading: "Every child…",
        columns: 4,
        items: [
          { title: "…plays", accent: "orange", text: "Physical education is a timetabled subject for every class from Nursery to Grade 10, following a structured programme for each age." },
          { title: "…is measured", accent: "teal", text: "Fitness assessments at the start and end of the year (strength, speed, stamina, flexibility and coordination), reported on a fitness report card." },
          { title: "…competes", accent: "gold", text: "Every child belongs to a house and competes in inter-house events through the year." },
          { title: "…can excel", accent: "navy", text: "Children who show talent are selected for school teams, trained for competition and represent ULL Auremont in inter-school and zonal tournaments." },
        ],
      },
      {
        type: "table",
        tone: "cream",
        eyebrow: "A programme that grows with your child",
        heading: "Sport at every stage",
        columns: ["Stage", "Focus"],
        rows: [
          ["Foundational (Nursery–Grade 2)", "Movement skills through play: running, jumping, balancing, throwing and catching; rhythm and dance"],
          ["Preparatory (Grades 3–5)", "Coordination, agility and team play; kicking, catching and striking; introduction to major sports; local and traditional games; yoga"],
          ["Middle (Grades 6–8)", "Sport-specific skills, rules and fair play; fitness and stamina; school teams and competition"],
          ["Secondary (Grades 9–10)", "Personal fitness plans, competitive sport and staying active and calm through the board year"],
        ],
      },
      {
        type: "text",
        image: img.indoorGames,
        eyebrow: "Sports at ULL Auremont",
        heading: "Athletics · Football · Cricket · Basketball · Volleyball · Table Tennis · Boxing · Chess · Yoga · Kho-kho · Kabaddi",
        body: [
          "Indian roots on the field: yoga and breathing practice for focus and calm; traditional games such as kho-kho, kabaddi, Chowka Bara and Ali Guli Mane; and the stories of Indian sporting heroes.",
        ],
      },
      {
        type: "cards",
        tone: "teal",
        eyebrow: "The sports calendar",
        heading: "Something to train for all year",
        columns: 2,
        items: [
          { title: "Annual Sports Meet", text: "Athletics and house competitions, with every child taking part.", accent: "orange" },
          { title: "Health and Fitness Week", text: "Fitness challenges, yoga, healthy eating and well-being.", accent: "teal" },
          { title: "Inter-house tournaments", text: "Through the year.", accent: "gold" },
          { title: "Inter-school and zonal competitions", text: "For school teams.", accent: "navy" },
        ],
      },
      {
        type: "text",
        eyebrow: "Sport across the school week",
        heading: "Movement beyond PE",
        body: [
          "Sport also runs through our other programmes: sport and yoga options in Ruchi hobby hour, physical well-being as one of the eight Pulse skill families, and self-defence basics in Kushala life skills.",
        ],
      },
      cta,
    ],
  },
  {
    slug: "student-life/pulse",
    title: "Pulse: a skill every week",
    description:
      "Pulse is ULL Auremont’s activity calendar: one period a week, Nursery to Grade 10, building one named skill linked to the chapter being studied.",
    breadcrumb: bc,
    hero: {
      image: img.primary,
      eyebrow: "Pulse · the heart of our week",
      heading: "A skill every week. For every child.",
      lead: "Pulse is our activity calendar: one period every week, for every class from Nursery to Grade 10, for a planned activity that builds one named skill. Each activity is linked to a chapter the class is studying, and roles rotate so every child takes part.",
      accent: "teal",
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "Eight skill families",
        heading: "What Pulse builds",
        columns: 4,
        items: [
          { title: "Communication", accent: "navy" },
          { title: "Collaboration", accent: "teal" },
          { title: "Creativity", accent: "orange" },
          { title: "Critical thinking", accent: "gold" },
          { title: "Leadership", accent: "navy" },
          { title: "Emotional and social skills", accent: "teal" },
          { title: "Physical well-being", accent: "orange" },
          { title: "Real-world skills", accent: "gold" },
        ],
      },
      {
        type: "text",
        image: img.vocal,
        eyebrow: "Examples",
        heading: "From a mystery bag to a budget",
        body: [
          "A mystery bag in Nursery, a puppet show in Grade 2, “Be a News Anchor” in Grade 4, a design challenge in Grade 7, a budgeting simulation in Grade 10.",
          "A theme every month for the whole school, and a Pulse note home every month.",
        ],
      },
      cta,
    ],
  },
  {
    slug: "student-life/ruchi",
    title: "Ruchi: hobby hour",
    description:
      "Ruchi is ULL Auremont’s weekly hobby hour for Grades 1–8: kitchen gardening, robotics, pottery, music, Bharatanatyam, Kathak, sport, chess and more.",
    breadcrumb: bc,
    hero: {
      image: img.dance,
      eyebrow: "Ruchi · hobby hour",
      heading: "Find what you love. Then get good at it.",
      lead: "Ruchi means taste, or interest. Once a week, from Grade 1 to Grade 8, children regroup by hobby. Grades 1–2 try different areas, Grades 3–5 choose and explore, and Grades 6–8 build real skill in three kinds of work, as set out in NCERT’s Kaushal Bodh.",
      accent: "gold",
    },
    blocks: [
      {
        type: "cards",
        heading: "Hobby groups",
        columns: 3,
        items: [
          { title: "Growing living things", accent: "teal", text: "Kitchen garden, plant nursery, biodiversity explorers, hydroponics" },
          { title: "Making with machines and materials", accent: "navy", text: "Robotics, maker skills, animation, AI builders, Channapatna-style toy making, textile crafts, pottery" },
          { title: "Serving people", accent: "orange", text: "Fireless cooking, puppetry and storytelling, young curators, first-aid champions, water auditors, young media makers" },
          { title: "Arts", accent: "gold", text: "Art, craft, photography, vocal music, flute, guitar, keyboard, drums, Bharatanatyam, Kathak, western dance" },
          { title: "Sport and mind", accent: "teal", text: "Basketball, football, cricket, volleyball, table tennis, boxing, chess, quiz, yoga, traditional games" },
        ],
      },
      cta,
    ],
  },
  {
    slug: "student-life/kushala",
    title: "Kushala: a life skill every month",
    description:
      "Kushala builds independence with one practical life skill every month, practised at school and at home, from tying laces to budgeting and safe online payments.",
    breadcrumb: bc,
    hero: {
      image: img.dining,
      eyebrow: "Kushala · life skills",
      heading: "Capable at school. Capable at home.",
      lead: "One practical life skill every month, practised at school and at home with a Kushala practice card.",
      accent: "navy",
    },
    blocks: [
      {
        type: "table",
        heading: "Examples through the grades",
        columns: ["Grade", "Life skill"],
        rows: [
          ["Nursery", "Putting on shoes"],
          ["Grade 1", "Tying laces"],
          ["Grade 3", "Basic first aid"],
          ["Grade 6", "Reading an electricity bill"],
          ["Grade 10", "Budgeting and safe online payments"],
        ],
      },
      {
        type: "quote",
        tone: "cream",
        text: "Kushala means skilful and capable; in Kannada, it also means being well.",
      },
      cta,
    ],
  },
  {
    slug: "student-life/aurora-lab",
    title: "Aurora Lab, robotics and computing",
    description:
      "Hands-on science in the Aurora Lab, robotics from Grade 1 to Grade 8, and computing from Grade 1: coding, data, AI, digital safety and creative media.",
    breadcrumb: bc,
    hero: {
      image: img.senior,
      eyebrow: "Aurora Lab, robotics and computing",
      heading: "Touch it. Test it. Build it. Code it.",
      accent: "teal",
    },
    blocks: [
      {
        type: "cards",
        columns: 3,
        items: [
          { title: "Aurora Lab, where ideas dawn", accent: "gold", text: "A hands-on science lab where children predict, test, get it wrong, think again and understand." },
          { title: "Robotics, Grades 1–8", accent: "orange", text: "From simple moving models to programmable boards that solve local problems such as water, waste and traffic." },
          { title: "Computing from Grade 1", accent: "navy", text: "Digital basics, coding, data and AI, digital safety and creative media, in a curriculum we review every year." },
        ],
      },
      cta,
    ],
  },
  {
    slug: "student-life/summit-pathway",
    title: "Summit Pathway: olympiads, debate and careers",
    description:
      "From Grade 6, the Summit Pathway builds reasoning, debate and olympiad skills; in Grades 9–10 it adds aptitude, career conversations and stream guidance.",
    breadcrumb: bc,
    hero: {
      image: img.vocal,
      eyebrow: "Summit Pathway · Grades 6–10",
      heading: "Aim high.",
      lead: "From Grade 6, the Summit Pathway builds the foundations for olympiads, competitive exams, the civil services and leadership.",
      accent: "orange",
    },
    blocks: [
      {
        type: "cards",
        columns: 2,
        items: [
          { title: "Grades 6–8", accent: "teal", bullets: ["Reasoning", "Current affairs", "Wide reading", "Debate and quizzes", "Olympiads"] },
          { title: "Grades 9–10", accent: "navy", bullets: ["Aptitude practice", "Career conversations with professionals", "Guidance on streams and entrance exams"] },
        ],
      },
      cta,
    ],
  },
];
