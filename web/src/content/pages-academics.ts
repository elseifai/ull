import { img } from "./assets";
import type { Page } from "./types";

const bc = [{ label: "Academics", href: "/academics/" }];
const visitCta = {
  type: "cta" as const,
  heading: "See learning in action",
  text: "Visit any working day by appointment, or come to our next Term Showcase.",
  primary: { label: "Book a campus visit", href: "/admissions/visit/" },
  secondary: { label: "Enquire now", href: "/admissions/enquire/" },
};

export const academicsPages: Page[] = [
  {
    slug: "academics",
    title: "Academics: our approach",
    description:
      "CBSE curriculum shaped by NCF 2023, taught through the five-step Auremont Learning Cycle: Connect, Experience, Clarify, Apply, Reflect. Nursery to Grade 10.",
    hero: {
      image: img.primary,
      eyebrow: "Academics",
      heading: "Understand first. Then remember.",
      lead: "Children understand before they memorise, do before they are told, and reflect before they move on.",
      accent: "navy",
    },
    blocks: [
      {
        type: "text",
        eyebrow: "Our curriculum",
        heading: "CBSE, shaped by NCF 2023",
        body: [
          "ULL Auremont follows the CBSE curriculum, shaped by the National Curriculum Framework for School Education (NCF 2023). Our curriculum moves through the four stages the framework sets out: Foundational, Preparatory, Middle and Secondary.",
        ],
      },
      {
        type: "subnav",
        heading: "Four stages, Nursery to Grade 10",
        items: [
          { title: "Foundational", tag: "Nursery–Grade 2", image: img.nursery, href: "/academics/foundational/", text: "Learning through play, stories and wonder.", accent: "gold" },
          { title: "Preparatory", tag: "Grades 3–5", image: img.primary, href: "/academics/preparatory/", text: "From play to purposeful learning.", accent: "orange" },
          { title: "Middle", tag: "Grades 6–8", image: img.senior, href: "/academics/middle/", text: "Thinking like mathematicians, scientists and historians.", accent: "teal" },
          { title: "Secondary", tag: "Grades 9–10", image: img.vocal, href: "/academics/secondary/", text: "Depth, discipline and readiness for the board exam.", accent: "navy" },
        ],
      },
      {
        type: "cards",
        tone: "cream",
        eyebrow: "What we believe",
        heading: "Six beliefs behind every lesson",
        columns: 3,
        items: [
          { title: "Understanding over rote learning", text: "Every lesson builds the why and the how, not just the what.", accent: "navy" },
          { title: "Learning by doing", text: "Children explore, question and discover.", accent: "orange" },
          { title: "Skills as well as knowledge", text: "Communication, critical thinking, collaboration and creativity are built into every unit.", accent: "teal" },
          { title: "Values in every lesson", text: "Taught through stories, real dilemmas and discussion.", accent: "gold" },
          { title: "Rooted in India, open to the world", accent: "orange" },
          { title: "Reading and writing everywhere", text: "A culture of reading and writing in every subject.", accent: "teal" },
        ],
      },
      {
        type: "steps",
        eyebrow: "The Auremont Learning Cycle",
        heading: "Five steps, every lesson, every grade",
        lead: "The five steps stay the same from Nursery to Grade 10. What changes is the form: play, rhymes and objects in the Foundational Stage; experiments and group tasks in the Preparatory Stage; investigations and debates in the Middle Stage; case studies, research and board-style problems in the Secondary Stage.",
        items: [
          { title: "Connect", text: "A question, story, picture or puzzle sparks curiosity and links to what children already know." },
          { title: "Experience", text: "Children explore hands-on: they handle materials, investigate, experiment and work in groups." },
          { title: "Clarify", text: "Children explain what they found in their own words; the teacher builds the correct concept and terms." },
          { title: "Apply", text: "Children use the learning to solve a new problem, design something or argue with evidence." },
          { title: "Reflect", text: "Children say or write what they learned and what is still unclear; the teacher uses this to plan the next lesson." },
        ],
      },
      {
        type: "text",
        image: img.passage,
        eyebrow: "Indian roots",
        heading: "A lens, not a subject",
        body: [
          "Indian knowledge is woven into lessons through the Learning Cycle. A lesson may connect through an Indian story or Karnataka example, clarify through the work of an Indian mathematician or scientist, and apply to a real problem in our own city. Indian and world knowledge are always taught side by side, and every example is checked for accuracy.",
        ],
      },
      {
        type: "text",
        eyebrow: "In every Auremont classroom",
        heading: "What you will see",
        bullets: [
          "Children talking, investigating and explaining for most of the lesson.",
          "Open questions, and time to think before answering.",
          "Every child taking part, not only the confident few.",
          "New vocabulary every day, and reading and writing in every subject.",
          "A link to real life, to values or to India in every lesson.",
        ],
      },
      {
        type: "quote",
        tone: "cream",
        text: "A child who finds a concept hard gets smaller steps, visual support and more check-ins. A child ready for more gets deeper challenges, not just more of the same.",
        cite: "Every learner, every lesson",
      },
      visitCta,
    ],
  },
  {
    slug: "academics/foundational",
    title: "Foundational Stage: Nursery to Grade 2",
    description:
      "Nursery, LKG, UKG, Grade 1 and Grade 2 at ULL Auremont: learning through play, stories, rhymes and movement, with no tests in the early years.",
    breadcrumb: bc,
    hero: {
      image: img.nursery,
      eyebrow: "Nursery to Grade 2",
      heading: "Learning through play, stories and wonder",
      lead: "The first five years build the foundations for everything that follows: language, number sense, curiosity, confidence and the joy of learning.",
      accent: "gold",
    },
    blocks: [
      {
        type: "text",
        body: [
          "In Nursery, LKG and UKG, children learn through play, toys, rhymes, stories, conversation and movement, with no formal textbooks. In Grades 1 and 2, books are introduced gently, and play remains at the heart of the day.",
        ],
      },
      {
        type: "cards",
        tone: "cream",
        eyebrow: "Five areas of development",
        heading: "Growing the whole child",
        lead: "Together with good learning habits such as attention, curiosity and persistence, these follow the National Curriculum Framework for the Foundational Stage.",
        columns: 3,
        items: [
          { title: "Physical", accent: "teal", text: "Running, balancing, throwing and catching; holding a crayon, cutting and threading; healthy habits and safety." },
          { title: "Socio-emotional and ethical", accent: "orange", text: "Making friends, sharing, taking turns, naming feelings, caring for others." },
          { title: "Cognitive", accent: "navy", text: "Observing, sorting, comparing, counting, noticing patterns and asking questions." },
          { title: "Language and literacy", accent: "gold", text: "Listening, speaking, sounds and letters, early reading and writing." },
          { title: "Aesthetic and cultural", accent: "teal", text: "Drawing, music, dance, drama and the stories and festivals of India." },
        ],
      },
      {
        type: "table",
        eyebrow: "What children learn",
        heading: "Subjects in the early years",
        columns: ["Area", "What it covers"],
        rows: [
          ["Languages", "English and Hindi through rhymes, stories, picture talk and phonics; Kannada from Grade 1. Themes include my family and me, life around us, food and seasons."],
          ["Mathematics", "Numbers and counting with real objects, shapes, patterns, comparing, measuring, and adding and subtracting through stories and games."],
          ["Our world", "My body and senses, my home and neighbourhood, plants and animals, seasons and water, festivals, transport and community helpers."],
          ["Arts and movement", "Drawing, colouring, clay, music, dance and free play every day."],
        ],
      },
      {
        type: "text",
        image: img.toddler,
        eyebrow: "Each day",
        heading: "Circle Time, then short, active sessions",
        body: [
          "Each day opens with Circle Time around a weekly theme: a song, a conversation about a real object or picture, a story children help to tell, a rhyme and a movement game. Short, active sessions in language, number and our world follow. Letters are traced in the air and in sand before they are written, and numbers are counted with beads and blocks before they are written.",
        ],
      },
      {
        type: "cards",
        columns: 2,
        items: [
          {
            title: "By the end of Grade 2, your child will",
            accent: "navy",
            bullets: [
              "Read short, simple texts with understanding, and write simple sentences.",
              "Count, read and write numbers, and add and subtract with confidence.",
              "Speak with confidence in a group, and listen to others.",
              "Look after their own belongings, follow routines and play fairly.",
            ],
          },
          {
            title: "Indian roots in the Foundational Stage",
            accent: "orange",
            bullets: [
              "Indian rhymes, folk tales and traditional games, alongside English ones.",
              "Festivals, national symbols and Karnataka’s culture, explored through stories, songs and celebrations.",
              "Kannada and Hindi heard, sung and spoken from the start.",
            ],
          },
        ],
      },
      {
        type: "text",
        tone: "cream",
        eyebrow: "How progress is shared",
        heading: "No tests in the early years",
        body: [
          "Teachers observe each child, keep samples of their work and share a holistic progress report covering every area of development.",
        ],
      },
      visitCta,
    ],
  },
  {
    slug: "academics/preparatory",
    title: "Preparatory Stage: Grades 3 to 5",
    description:
      "Grades 3 to 5 at ULL Auremont: fluent reading, confident maths, hands-on EVS, arts, PE, computing and robotics, with Indian roots in every subject.",
    breadcrumb: bc,
    hero: {
      image: img.primary,
      eyebrow: "Grades 3 to 5",
      heading: "From play to purposeful learning",
      lead: "Children move from learning through play to more structured learning, while keeping it active, hands-on and joyful. They become fluent readers, confident with numbers and curious about the world around them.",
      accent: "orange",
    },
    blocks: [
      {
        type: "table",
        eyebrow: "What children learn",
        heading: "Subjects in Grades 3 to 5",
        columns: ["Subject", "What it covers"],
        rows: [
          ["English", "Stories, poems and folk tales from India and the world; reading for meaning; writing paragraphs, letters and stories; speaking and listening"],
          ["Hindi and Kannada", "Reading, writing and conversation; poems, stories and everyday language"],
          ["Mathematics", "Numbers into the thousands and beyond; the four operations; fractions as fair shares; shapes and patterns; length, weight, capacity, time and money; collecting and reading data, often set in fairs, festivals and family life"],
          ["The World Around Us (EVS)", "Families and communities; plants, animals and life around us; water, food and health; things we make and use; taking care of waste; different lands and the sky above us"],
          ["Arts", "Visual arts, music, dance and theatre as full subjects"],
          ["Physical education", "Running, jumping and balance; kicking, catching and striking; local and traditional games; yoga"],
          ["Computing and robotics", "Digital basics, block coding, simple machines with motors and sensors"],
        ],
      },
      {
        type: "text",
        image: img.primary,
        eyebrow: "In the classroom",
        heading: "Experiments, groups and real problems",
        body: [
          "Children carry out simple experiments, work in groups, solve real-life word problems and create something in every unit. Reading corners and vocabulary logs build a love of reading.",
        ],
      },
      {
        type: "cards",
        columns: 2,
        items: [
          {
            title: "By the end of Grade 5, your child will",
            accent: "navy",
            bullets: [
              "Read longer texts fluently and with understanding, and write clearly for different purposes.",
              "Calculate with large numbers, fractions and measurements, and explain their method.",
              "Observe, question and explain how things work in the world around them.",
              "Work in a team, present to the class and take responsibility for their tasks.",
            ],
          },
          {
            title: "Indian roots in the Preparatory Stage",
            accent: "orange",
            bullets: [
              "Mathematics problems set in Indian fairs, festivals and family life.",
              "Panchatantra, Jataka and folk tales in reading, used to discuss values such as honesty and kindness.",
              "Karnataka’s lakes, crops, foods and crafts as the first examples studied in EVS.",
              "Traditional games such as Chowka Bara and Ali Guli Mane for counting and strategy, and rangoli for patterns and symmetry.",
              "Indian music, dance and art forms in the arts.",
            ],
          },
        ],
      },
      {
        type: "text",
        tone: "teal",
        eyebrow: "How progress is checked",
        heading: "Short assessments, with the whole picture",
        body: [
          "Short written assessments begin in this stage, alongside teacher observation, portfolios, projects, and self and peer reflection.",
        ],
      },
      visitCta,
    ],
  },
  {
    slug: "academics/middle",
    title: "Middle Stage: Grades 6 to 8",
    description:
      "Grades 6 to 8 at ULL Auremont: NCERT Ganita Prakash, Curiosity and Exploring Society, investigations, debate, skills for work, computing and the Summit Pathway.",
    breadcrumb: bc,
    hero: {
      image: img.senior,
      eyebrow: "Grades 6 to 8",
      heading: "Thinking like mathematicians, scientists and historians",
      lead: "Children meet each subject on its own terms. They learn to reason, investigate, analyse sources and argue with evidence, and they begin to take charge of their own learning.",
      accent: "teal",
    },
    blocks: [
      {
        type: "text",
        body: [
          "Mathematics, Science and Social Science are taught from the NCERT textbooks Ganita Prakash, Curiosity and Exploring Society: India and Beyond.",
        ],
      },
      {
        type: "table",
        eyebrow: "What children learn",
        heading: "Subjects in Grades 6 to 8",
        columns: ["Subject", "What it covers"],
        rows: [
          ["Mathematics", "Patterns, number play and primes; fractions, decimals and integers; algebra with letter-numbers; perimeter, area, symmetry and constructions; squares, cubes and powers; proportional reasoning; data handling"],
          ["Science", "The diversity of living things; food and health; magnets, measurement and motion; materials, temperature and states of water; electricity and light; physical and chemical changes; the microbial world; forces and pressure; the particle nature of matter; the Earth, Moon, Sun and beyond"],
          ["Social Science", "Five themes across three years: India and the world, land and people; the tapestry of India’s past; our cultural heritage and knowledge traditions; governance and democracy; economic life around us"],
          ["Languages", "English, Hindi and Kannada: literature, grammar, and writing for real purposes, such as arguments, reports and reflections"],
          ["Arts", "Visual arts, music, dance and theatre"],
          ["Physical education and well-being", "Sport-specific skills, fitness, yoga and well-being"],
          ["Skills for work", "Hands-on projects in three kinds of work: growing living things, making with machines and materials, and serving people, through Ruchi"],
          ["Computing and robotics", "Spreadsheets, research skills, coding, programmable boards and how AI tools work"],
        ],
      },
      {
        type: "text",
        image: img.senior,
        eyebrow: "In the classroom",
        heading: "Investigate, analyse, debate",
        body: [
          "Children run investigations, collect data, work through case studies and debate questions using evidence. Each chapter ends with a project, a reflection or a real-world application.",
        ],
      },
      {
        type: "cards",
        columns: 2,
        items: [
          {
            title: "By the end of Grade 8, your child will",
            accent: "navy",
            bullets: [
              "Reason with numbers, algebra and shapes, and explain their thinking.",
              "Plan a simple investigation, record observations and draw conclusions.",
              "Read maps, sources and timelines, and explain how India is governed.",
              "Write a clear argument, and speak in a discussion or debate.",
              "Complete a real project from start to finish and present it.",
            ],
          },
          {
            title: "Indian roots in the Middle Stage",
            accent: "orange",
            bullets: [
              "Mathematics: Brahmagupta’s rules for zero, negative numbers and fractions, and the Virahanka sequence, as presented in the textbooks.",
              "Science: traditional Indian units of length, Acharya Kanad’s idea of the parmanu (atom), early Indian practice of variolation against smallpox, and Indian scientists such as J.C. Bose, alongside India’s space missions.",
              "Social Science: India’s cultural roots, unity in diversity, knowledge traditions and the story of Indian democracy.",
              "Arts: Indian dance and theatre forms, including Karnataka’s Yakshagana.",
              "Languages: Kannada and Hindi poetry and prose, read and discussed.",
            ],
          },
        ],
      },
      {
        type: "text",
        tone: "teal",
        eyebrow: "How progress is checked",
        heading: "Reasoning and application, not only recall",
        body: [
          "Tests focus on reasoning and application, not only recall. They are combined with projects, experiments, a portfolio and at least one real-world project each term. The Summit Pathway begins in Grade 6.",
        ],
      },
      visitCta,
    ],
  },
  {
    slug: "academics/secondary",
    title: "Secondary Stage: Grades 9 and 10",
    description:
      "Grades 9 and 10 at ULL Auremont: deep subject understanding and full preparation for the CBSE Class 10 board exam, with stream guidance.",
    breadcrumb: bc,
    hero: {
      image: img.senior,
      eyebrow: "Grades 9 and 10",
      heading: "Depth, discipline and readiness for the board exam",
      lead: "Grades 9 and 10 build deep understanding of each subject and prepare students for the CBSE Class 10 board examination.",
      accent: "navy",
    },
    blocks: [
      {
        type: "text",
        body: [
          "Students learn to analyse, apply concepts to unfamiliar problems and think critically, the skills that competency-based board questions now test.",
        ],
      },
      {
        type: "table",
        eyebrow: "What students learn",
        heading: "Subjects in Grades 9 and 10",
        columns: ["Subject", "What it covers"],
        rows: [
          ["Mathematics", "Number systems; polynomials, identities and equations; sequences and progressions; coordinate and Euclidean geometry; triangles, quadrilaterals and circles; mensuration; trigonometry; statistics and probability"],
          ["Science", "Cells, tissues and the diversity of life; motion, force, work and energy; atoms and matter; sound, light and electricity; chemical reactions, acids and bases; life processes, heredity and the environment; the Earth as a system"],
          ["Social Science", "The Earth’s physical systems and India’s geography; Indian and world history; democracy, the Constitution and elections; economics, markets, development and personal finance"],
          ["Languages", "English, Hindi and Kannada: literature, writing and analysis"],
          ["Skill subject", "A CBSE technology skill subject with hands-on projects"],
          ["Physical education, well-being and arts", "Fitness, sport, yoga, managing stress, and the arts"],
        ],
      },
      {
        type: "text",
        tone: "cream",
        eyebrow: "Preparing for the board",
        heading: "Planned, practised, prepared",
        bullets: [
          "Competency-based, board-pattern questions in every Grade 9 and 10 test.",
          "A planned revision calendar, timed practice papers and past-paper analysis, with detailed feedback.",
          "Preparation for both phases of the Class 10 board examination: the main exam and the optional improvement exam.",
          "Extra support for those who need it, and stretch work for those ready for more.",
        ],
      },
      {
        type: "cards",
        columns: 2,
        items: [
          {
            title: "By the end of Grade 10, your child will",
            accent: "navy",
            bullets: [
              "Be fully prepared for the board examination.",
              "Apply concepts to real and unfamiliar problems, and explain their reasoning in writing.",
              "Analyse data, sources and case studies, and form a reasoned view.",
              "Know their strengths, and have a plan for choosing a stream after Grade 10.",
            ],
          },
          {
            title: "Indian roots in the Secondary Stage",
            accent: "orange",
            bullets: [
              "Mathematics: the contributions of Baudhayana, Aryabhata, Brahmagupta, Bhaskara and Madhava, as featured in the NCERT textbooks.",
              "Science: Acharya Kanad’s parmanu, the acoustics of Karnataka’s Gol Gumbaz whispering gallery, and the work of C.V. Raman and other Indian scientists.",
              "Social Science: Indian knowledge systems in medicine, mathematics and astronomy; ideas of governance from Kautilya; the Constitution and Indian democracy.",
              "Languages: Kannada and Hindi literature.",
            ],
          },
        ],
      },
      {
        type: "text",
        tone: "teal",
        eyebrow: "Beyond the exam",
        heading: "Ready for what comes next",
        body: [
          "The Summit Pathway continues with aptitude, current affairs, debate, national competitions, career conversations and stream guidance. The weekly Life Skill period builds practical skills for adult life.",
        ],
      },
      visitCta,
    ],
  },
  {
    slug: "academics/assessment",
    title: "Assessment and progress",
    description:
      "How ULL Auremont assesses learning at each stage, and the whole-child report: subjects, skills, fitness, hobbies, life skills and a Strengths Profile.",
    breadcrumb: bc,
    hero: {
      image: img.parent,
      eyebrow: "Assessment and progress",
      heading: "We check understanding, and we show you the whole child",
      accent: "gold",
    },
    blocks: [
      {
        type: "table",
        heading: "How learning is assessed at each stage",
        columns: ["Stage", "How learning is assessed"],
        rows: [
          ["Foundational (Nursery–Grade 2)", "No tests. Teachers observe, keep samples of work and report on every area of development"],
          ["Preparatory (Grades 3–5)", "Short written assessments, with observation, portfolios, projects, and self and peer reflection"],
          ["Middle (Grades 6–8)", "Unit and term assessments that test reasoning and application, plus projects, experiments and portfolios"],
          ["Secondary (Grades 9–10)", "Board-pattern assessments, timed practice and detailed feedback"],
        ],
      },
      {
        type: "text",
        tone: "cream",
        eyebrow: "Every report shows the whole child",
        heading: "More than marks",
        bullets: [
          "Subject progress and teacher comments",
          "Skills observed in Pulse",
          "Fitness record and sports participation",
          "Hobby progress (Grades 1–8) and life skills achieved",
          "A Strengths Profile: one strength and one next step, written for your child, passed from teacher to teacher",
        ],
      },
      {
        type: "text",
        eyebrow: "Support and stretch",
        heading: "Help where it’s needed, challenge where it’s wanted",
        body: [
          "Children who need help get smaller steps and targeted support classes. Children ready for more get deeper, more challenging work.",
        ],
      },
      visitCta,
    ],
  },
];
