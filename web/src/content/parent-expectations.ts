// Wording is the public contract for the Parent Expectation Form.
// Keep these strings identical in cms/src/collections/ParentExpectations.ts and its migration.

export const parentExpectationQuestions = [
  {
    name: "priority",
    label: "What is your biggest priority while choosing a school?",
    options: [
      "Quality of education",
      "Communication skills",
      "Overall personality development",
      "Sports and extracurricular activities",
      "Safety and security",
      "Discipline and values",
    ],
  },
  {
    name: "learningEnvironment",
    label: "What kind of learning environment are you looking for?",
    options: [
      "Play-based learning",
      "Activity-based learning",
      "Academic-focused learning",
      "Balanced learning approach",
    ],
  },
  {
    name: "teachers",
    label: "What matters most to you about teachers?",
    options: [
      "Experienced teachers",
      "Individual attention",
      "Friendly and caring teachers",
      "Regular parent communication",
    ],
  },
  {
    name: "skills",
    label: "Which skills would you like your child to develop?",
    options: ["English communication", "Confidence", "Creativity", "Social skills", "Leadership"],
  },
  {
    name: "concern",
    label: "What is your biggest concern about your child's schooling?",
    options: [
      "Difficulty adjusting",
      "Lack of individual attention",
      "Academic pressure",
      "Safety concerns",
      "Communication development",
    ],
  },
  {
    name: "longTerm",
    label: "What are your long-term expectations from the school?",
    options: [
      "Strong academic foundation",
      "Confidence and independence",
      "Good communication skills",
      "Well-rounded personality",
      "Preparation for future grades",
    ],
  },
] as const;

export type ParentExpectationQuestionName = (typeof parentExpectationQuestions)[number]["name"];
