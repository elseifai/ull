// Brand imagery from the ULL Auremont concept (design visualisations, owned by ULL).
// Drop the files into web/public/assets/ with these names; missing files fall back to brand artwork.

export const img = {
  logo: "/assets/ull-auremont-logo.jpeg",
  jonty: "/assets/jonty-ambassador.jpeg",
  arrival: "/assets/arrival-concept.png",
  courtyard: "/assets/courtyard-concept.png",
  toddler: "/assets/toddler-space.png",
  nursery: "/assets/nursery-space.png",
  primary: "/assets/primary-space.png",
  senior: "/assets/senior-space.png",
  vocal: "/assets/vocal-space.png",
  music: "/assets/music-space.png",
  dance: "/assets/dance-space.png",
  indoorGames: "/assets/indoor-games-space.png",
  dining: "/assets/kitchen-dining-space.png",
  passage: "/assets/passage-space.png",
  parent: "/assets/parent-conversation-concept.png",
  counselling: "/assets/counselling-concept.png",
  admissionsForm: "/assets/admissions-form-concept.png",
};

export const alts: Record<string, string> = {
  [img.logo]: "ULL Auremont School",
  [img.jonty]: "Jonty Rhodes with the ULL team",
  [img.arrival]: "ULL Auremont school building with its signage",
  [img.courtyard]: "Courtyard with two badminton courts and a volleyball court",
  [img.toddler]: "Playgroup space for ages 1 to 3",
  [img.nursery]: "Bright kindergarten classroom with a reading nook",
  [img.primary]: "Primary classroom with children working on a project",
  [img.senior]: "Classroom for Grades 5 to 9",
  [img.vocal]: "Vocal studio with students and a vocal coach",
  [img.music]: "Music studio",
  [img.dance]: "Dance and movement studio",
  [img.indoorGames]: "Chess and indoor games room",
  [img.dining]: "Kitchen and dining space",
  [img.passage]: "Colourful campus passage",
  [img.parent]: "A child in school uniform talking with a parent",
  [img.counselling]: "Counsellor explaining programmes to a visiting family",
  [img.admissionsForm]: "Counsellor helping parents complete an admission form",
};
