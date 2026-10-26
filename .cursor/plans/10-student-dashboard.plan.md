---
name: 10 Student dashboard
overview: A student-facing dashboard showing the academic calendar, current grade, subjects and curriculum, progress reports, and a portfolio of everything the student does (learning, quizzes, Q&A, sports, participation, psychometric tests). Metrics follow CBSE/NEP 2020's Holistic Progress Card for Auremont and IB learner profile and criteria for Global. 1 Feb – 9 Apr 2027, beta for one grade band.
todos:
  - id: data-source
    content: Identify the school ERP/LMS (attendance, marks, timetable) and agree an import or API
    status: pending
  - id: metrics-signoff
    content: Academic heads sign off the metric framework below for CBSE and IB
    status: pending
  - id: models
    content: Add academic years, terms, grades, sections, subjects, curriculum units, assessments, results, attendance, activities and achievements collections
    status: pending
  - id: ui
    content: Build the dashboard (home, calendar, subjects, progress, portfolio, tests) under /portal/student
    status: pending
  - id: teacher-input
    content: Give teachers a quick-entry screen for observations, participation and competency ratings
    status: pending
  - id: consent
    content: Parental consent and age-appropriate design (no ads, no tracking, no public profiles)
    status: pending
isProject: false
---

# 10 · Student dashboard

URL: `ullindia.com/portal/student` (login from plan 09). Under 13, the parent opens it in "student view" (plan 11).

## Screens

| Screen | Content |
|---|---|
| **Home** | Greeting, today's timetable, homework due, next test, latest teacher note, streak/badges, upcoming events |
| **Academic calendar** | Term dates, holidays, exams, PTMs, events, sports days; per grade/section; `.ics` subscribe link |
| **My grade** | Current grade and section, class teacher, subjects and teachers, timetable |
| **Subjects** | Per subject: curriculum units for the year (from the CBSE syllabus / IB unit planner), unit status (upcoming, in progress, done), resources, quizzes, Q&A, marks |
| **Progress** | Term reports, competency progress, trend charts, teacher comments, Holistic Progress Card view |
| **Portfolio (digital footprint)** | Projects, artwork, robotics builds, presentations, certificates, sports results, clubs, competitions, reflections; photos and files |
| **Tests and reports** | Psychometric tests from `ullindia.aptitudetest.in` with status and report PDFs (plan 20) |
| **Wellbeing** | Mood check-in (optional, 13+), counsellor booking, Kushala programme |

## Metric framework (suggested)

### 1. Academic

| Metric | Source | Shown as |
|---|---|---|
| Attendance % (term, year) | ERP | Number + trend |
| Assessment scores per subject (periodic tests, half-yearly, annual) | ERP / teacher | Score, class average band (not rank) |
| Competency mastery per learning outcome | Teacher ratings, quizzes | Beginner / Proficient / Advanced per outcome |
| Homework completion rate and on-time rate | LMS / teacher | % |
| Quiz accuracy and attempts | In-app quizzes | % + improvement |
| Questions asked / answered (Q&A) | In-app Q&A | Count, quality badge |
| Reading log (books, minutes) | Student / parent | Count |
| Curriculum coverage | Unit status | % of year done |

### 2. Holistic (CBSE / NEP 2020 Holistic Progress Card, PARAKH)

HPC asks for self, peer and teacher assessment across domains. Track:

- Physical development, socio-emotional skills, cognitive development, language and literacy, aesthetic and cultural development, positive learning habits.
- Self-assessment and peer feedback each term (simple rubrics with emojis for the Foundational stage).

### 3. IB (ULL Global)

- PYP: learner profile attributes (inquirer, thinker, communicator, risk-taker, knowledgeable, principled, open-minded, caring, balanced, reflective), units of inquiry, exhibition.
- MYP: criteria A–D per subject group (1–8), Approaches to Learning skills (thinking, communication, social, self-management, research), service as action, personal project.

### 4. Sports and fitness

- Fitness test results (Khelo India fitness protocol by age: BMI, flexibility, speed, endurance, strength).
- Sports chosen, coaching sessions attended, matches, medals, house points.

### 5. Participation and co-curricular

- Clubs (Pulse, Ruchi, Aurora Lab, Summit Pathway), events, competitions, Olympiads, MUN, performances, leadership roles, service hours.

### 6. Future readiness

- Psychometric results summary (interest, aptitude, learning style; plan 20).
- Stream selector and career test recommendations (Grades 8–10).

Rules: show growth against the student's own past, not class rank. No public leaderboards. Badges for effort and consistency, not only scores.

## Data sources

| Data | Where it comes from |
|---|---|
| Timetable, attendance, marks, fees | The school ERP. **Unknown today**: common ones in India are Entab, Fedena, Teachmint, MyClassboard, Edunext. We import nightly (API or CSV drop to S3) |
| Curriculum units | Academic team in CMS (one-time per year per grade) |
| Quizzes, Q&A | Built in this portal (simple MCQ + short answer), or from the LMS if there is one |
| Observations, participation, competency ratings | Teacher quick-entry screen (mobile-friendly, 30 seconds per entry) |
| Sports | Coaches enter results |
| Psychometric | aptitudetest.in webhook + API (plan 20) |
| Portfolio | Student / teacher uploads to the private documents bucket (plan 02) |

## Data model (new collections)

`academicYears`, `terms`, `grades`, `sections`, `subjects`, `curriculumUnits`, `enrolments` (student ↔ section ↔ year), `assessments`, `results`, `attendance`, `competencyRatings`, `activities`, `achievements`, `portfolioItems`, `quizzes`, `quizAttempts`, `questions`. Students are `children` from the CRM (plan 08) with an `enrolled` status, so the admissions record carries into school life.

## Teacher input

- Mobile web screen: pick section → student(s) → type (observation, participation, competency, achievement) → rubric → optional photo.
- Bulk entry for a whole class after an event.
- AI help: turn a teacher's short note into a parent-friendly comment (Claude), teacher approves.

## Privacy and safety

- Verifiable parental consent before a student account is active (plan 09).
- No third-party trackers or ads on `/portal/*`.
- Students see only their own data; no messaging between students.
- Files served with presigned URLs only.

## Build order

1. Feb: data model, ERP import, calendar, grade and subjects screens.
2. Mar: progress, portfolio, teacher entry, aptitude test tiles.
3. 9 Apr: beta for one grade band (for example Grades 6–8), feedback, then roll out at the start of 2027-28.

## Acceptance

- A student sees their timetable, calendar, subjects and the latest results without asking a teacher.
- Teachers can log an observation in under 30 seconds.
- Each metric in the framework has a defined source and an owner.

## Open questions

1. Which ERP/LMS does ULL Auremont use, and does it have an API?
2. Does the academic team want HPC-style reports generated from this system?
3. Are students given devices or school accounts?
