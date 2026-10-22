import { img } from "./assets";
import type { Page } from "./types";

export const aboutPages: Page[] = [
  {
    slug: "about",
    title: "About ULL Auremont",
    description:
      "ULL Auremont is a CBSE school in Nagarbhavi, Bengaluru, for Nursery to Grade 10. Discover our name, motto, vision, mission and the Auremont Way.",
    hero: {
      image: img.arrival,
      eyebrow: "About us",
      heading: "Rooted deep. Rising high.",
      lead: "ULL Auremont is a CBSE school in Nagarbhavi, Bengaluru, for children from Nursery to Grade 10, and part of the United Learning League.",
      accent: "orange",
    },
    blocks: [
      {
        type: "text",
        image: img.arrival,
        eyebrow: "The name",
        heading: "Auremont: the golden mountain",
        lead: "Auremont means the golden mountain: from aurum, gold, and mont, mountain.",
        bullets: [
          "Gold is the talent inside every child. Our job is to find it and refine it through effort and good teaching.",
          "The mountain is the climb of learning: step by step, toward a summit worth reaching.",
          "Deep roots keep a mountain standing firm, as our children are rooted in India and Karnataka.",
          "The dawn touches the mountain top first: a new beginning for every child who joins us.",
        ],
      },
      {
        type: "cards",
        tone: "cream",
        eyebrow: "What guides us",
        heading: "Our vision and mission",
        columns: 2,
        items: [
          {
            title: "Our vision",
            accent: "teal",
            text: "Every child at ULL Auremont discovers the gold within and rises to lead a life of purpose: strong in knowledge, fit in body and mind, rooted in India and ready to serve the world.",
          },
          {
            title: "Our mission",
            accent: "orange",
            text: "To help every child develop deep understanding, a healthy body and mind, values rooted in Indian culture, and the skills and confidence to lead, through thoughtfully planned, experiential teaching and close partnership with families.",
          },
        ],
      },
      {
        type: "cards",
        eyebrow: "Our values",
        heading: "The Auremont Way",
        lead: "Five values for how we climb together, every day.",
        columns: 3,
        items: [
          { title: "Excellence", accent: "gold", text: "We do our best work, and then improve it." },
          { title: "Integrity", accent: "navy", text: "We are honest, even when no one is watching." },
          { title: "Curiosity", accent: "teal", text: "We ask why, and we go and find out." },
          { title: "Resilience", accent: "orange", text: "We keep climbing when the path is steep." },
          { title: "Service", accent: "gold", text: "We use what we learn to help others." },
        ],
      },
      {
        type: "subnav",
        heading: "Explore more",
        items: [
          { title: "What makes us unique", image: img.passage, accent: "orange", href: "/about/why-auremont/", text: "Nine things that are planned, connected and visible to parents." },
          { title: "Our teachers", image: img.counselling, accent: "teal", href: "/about/teachers/", text: "Teachers who plan. Children who think." },
          { title: "Our approach to learning", image: img.primary, accent: "gold", href: "/academics/", text: "The Auremont Learning Cycle, in every lesson." },
        ],
      },
      {
        type: "cta",
        heading: "Ready to see it for yourself?",
        text: "Visit the campus, meet our teachers and watch learning in action.",
        primary: { label: "Book a campus visit", href: "/admissions/visit/" },
        secondary: { label: "Enquire now", href: "/admissions/enquire/" },
      },
    ],
  },
  {
    slug: "about/why-auremont",
    title: "What makes ULL Auremont unique",
    description:
      "Planned lessons, Indian roots in every subject, sport as a pillar, a skill and a hobby every week, a life skill every month, and learning you can see.",
    breadcrumb: [{ label: "About", href: "/about/" }],
    hero: {
      image: img.passage,
      eyebrow: "About us",
      heading: "What makes us unique",
      lead: "Many schools list the same things: academics, sport, robotics, activities. What makes ULL Auremont different is that each of these is planned, connected and visible to parents.",
      accent: "teal",
    },
    blocks: [
      {
        type: "cards",
        columns: 3,
        items: [
          { title: "Every lesson is planned", accent: "navy", text: "Teachers follow written lesson plans built on the Auremont Learning Cycle, aligned to the National Curriculum Framework and reviewed before they are taught.", href: "/academics/" },
          { title: "Indian roots in every subject", accent: "orange", text: "Not a separate period: Indian thinkers, Karnataka examples, Kannada and values are part of everyday lessons." },
          { title: "Sport is a pillar, not a period", accent: "teal", text: "Every child plays, is assessed for fitness and competes for their house; talented children train for school teams.", href: "/student-life/sports/" },
          { title: "A skill every week", accent: "gold", text: "Pulse, our activity calendar, builds one named skill every week, linked to what the class is studying.", href: "/student-life/pulse/" },
          { title: "A hobby every week", accent: "orange", text: "Ruchi lets children from Grade 1 to Grade 8 discover and build an interest, from Kathak to kitchen gardening to robotics.", href: "/student-life/ruchi/" },
          { title: "A life skill every month", accent: "teal", text: "Kushala builds independence, practised at school and at home.", href: "/student-life/kushala/" },
          { title: "Hands-on science and technology", accent: "navy", text: "The Aurora Lab, robotics and a computing curriculum reviewed every year.", href: "/student-life/aurora-lab/" },
          { title: "Aiming high", accent: "gold", text: "The Summit Pathway builds the foundations for olympiads, competitive exams and leadership from Grade 6.", href: "/student-life/summit-pathway/" },
          { title: "You see the learning", accent: "orange", text: "Monthly Pulse notes, a Term Showcase every term and a Strengths Profile that follows your child from class to class.", href: "/parents/" },
        ],
      },
      {
        type: "cta",
        heading: "See the difference on a campus visit",
        primary: { label: "Book a campus visit", href: "/admissions/visit/" },
      },
    ],
  },
  {
    slug: "about/teachers",
    title: "Our teachers",
    description:
      "How ULL Auremont trains, coaches and supports its teachers, and how we keep teaching quality consistent across every classroom.",
    breadcrumb: [{ label: "About", href: "/about/" }],
    hero: {
      image: img.counselling,
      eyebrow: "About us",
      heading: "Teachers who plan. Children who think.",
      accent: "navy",
    },
    blocks: [
      {
        type: "cards",
        eyebrow: "How we support our teachers",
        heading: "Trained, coached and planning together",
        columns: 3,
        items: [
          { title: "Planned lessons", accent: "navy", text: "Every chapter has a written lesson plan built on the Auremont Learning Cycle and reviewed before it is taught." },
          { title: "Training before the year begins", accent: "teal", text: "An induction on how we teach, plan and assess." },
          { title: "Training every month", accent: "gold", text: "Subject sessions, demonstration lessons and peer observation." },
          { title: "Coaching, not inspection", accent: "orange", text: "After every classroom observation, the teacher receives one strength and one next step." },
          { title: "Teamwork", accent: "teal", text: "Subject teams plan together and review student work together." },
        ],
      },
      {
        type: "text",
        tone: "cream",
        eyebrow: "Quality",
        heading: "How we keep quality consistent",
        body: [
          "School leaders observe lessons regularly, review notebooks, portfolios and results every term, and the school’s academics are independently reviewed twice a year.",
        ],
      },
      {
        type: "cta",
        heading: "Join our team",
        text: "We are always glad to hear from teachers who love to plan, teach and grow.",
        primary: { label: "Contact us", href: "/contact/" },
      },
    ],
  },
];
