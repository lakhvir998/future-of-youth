// DRAFT: client to approve. Lists what donations support using only activities
// the organization already describes; no dollar-amount impact claims.

export const DONATE_INTRO =
  'Help us nurture the next generation of bright minds. Your contribution keeps our programs free for Detroit families and gives young people the skills, support, and opportunities to build a brighter future.';

export type ImpactArea = { title: string; description: string };

export const IMPACT_AREAS: ImpactArea[] = [
  {
    title: 'AI & technology education',
    description:
      'Devices, software, and learning materials so students can learn AI, cybersecurity, and digital skills hands-on.',
  },
  {
    title: 'Entrepreneurship & financial literacy',
    description:
      'Workshops and real-world learning experiences that teach students how to manage money and start a business.',
  },
  {
    title: 'Tutoring & academic support',
    description:
      'Personalized support that helps students close learning gaps and build a strong academic foundation.',
  },
  {
    title: 'Free, nutritious meals',
    description:
      'Lunches served during all sessions, so every child can focus and thrive.',
  },
  {
    title: 'Career & leadership development',
    description:
      'Mentoring and hands-on practice in communication, leadership, and professional skills.',
  },
];

export const OTHER_WAYS_TO_GIVE =
  'Interested in sponsoring a program, making an in-kind donation, or giving through your employer? Contact us and we will be glad to help.';
