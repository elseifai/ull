// Brand imagery from the ULL Auremont concept (design visualisations, owned by ULL).
// Drop the files into web/public/assets/ with these names; missing files fall back to brand artwork.
// A deploy with CDN_BUCKET set rewrites cdn-assets.json so each file is served from the stage CDN
// at assets/{content-hash}/{filename}.
import versions from "./cdn-assets.json";

const cdn = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, "");
const versioned = versions as Record<string, string>;

export function assetPath(file: string) {
  if (cdn && versioned[file]) return `${cdn}/assets/${versioned[file]}`;
  return `/assets/${file}`;
}

export const img = {
  logo: assetPath("ull-auremont-logo.jpeg"),
  jonty: assetPath("jonty-ambassador.jpeg"),
  arrival: assetPath("arrival-concept.png"),
  courtyard: assetPath("courtyard-concept.png"),
  toddler: assetPath("toddler-space.png"),
  nursery: assetPath("nursery-space.png"),
  primary: assetPath("primary-space.png"),
  senior: assetPath("senior-space.png"),
  vocal: assetPath("vocal-space.png"),
  music: assetPath("music-space.png"),
  dance: assetPath("dance-space.png"),
  indoorGames: assetPath("indoor-games-space.png"),
  dining: assetPath("kitchen-dining-space.png"),
  passage: assetPath("passage-space.png"),
  parent: assetPath("parent-conversation-concept.png"),
  counselling: assetPath("counselling-concept.png"),
  admissionsForm: assetPath("admissions-form-concept.png"),
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
