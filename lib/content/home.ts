// Page copy reused outside the visible page (structured data, llms.txt), kept
// in one place so every surface says exactly the same thing.

// Headline and intro: the client's exact wording.
export const HERO_HEADLINE = 'Preparing Today’s Youth for Tomorrow’s Economy';

export const HERO_INTRO =
  'Future of the Youth empowers underserved youth through entrepreneurship, financial literacy, artificial intelligence education, mentorship, and real-world career and business skills. Our goal is to give young people the knowledge, confidence, and tools they need to succeed in a rapidly changing economy.';

// Primary homepage call to action (client wording; displayed in capitals via CSS).
export const HERO_CTA_LABEL = 'Support Our Mission';

// Original homepage introduction, now used on the About page.
export const ORIGINAL_INTRO =
  'Our nonprofit program is dedicated to empowering students from minority and underserved communities by providing access to free academic support and resources. We believe that every student deserves the opportunity to reach their full potential, regardless of background or circumstance. Through tutoring, mentorship, and skill-building workshops, we create a safe and encouraging space where students can strengthen their academic foundation, build confidence, and prepare for future success.';

// Mission: the client's exact wording.
export const MISSION_TITLE = 'Our Mission';

export const MISSION_PARAGRAPHS = [
  'Future of the Youth is a 501(c)(3) nonprofit organization committed to preparing young people for economic opportunity and the future of work.',
  'We provide practical education in entrepreneurship, financial literacy, artificial intelligence, technology, and career readiness. Our programs are designed to expose youth to skills and opportunities that can help them become financially capable, technologically prepared, and confident about their futures.',
] as const;

/** Single-string form for structured data and llms.txt. */
export const MISSION_STATEMENT = MISSION_PARAGRAPHS.join(' ');

// DRAFT: client to approve.
export const PROGRAMS_INTRO =
  'Every program is free for participating families and is designed to work together, so students grow academically, financially, and personally at the same time.';
