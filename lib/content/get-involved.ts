// DRAFT: client to approve.
import type { ContactTopic } from '@/lib/contact';

export const GET_INVOLVED_INTRO =
  'Our programs are powered by people who believe in Detroit’s young people. Whether you have an hour, a skill, or resources to share, there is a place for you.';

export type InvolvementOption = {
  id: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  topic?: ContactTopic;
};

export const INVOLVEMENT_OPTIONS: InvolvementOption[] = [
  {
    id: 'volunteer',
    title: 'Volunteer',
    description:
      'Help with tutoring, workshops, sports, meals, and events. Volunteers make every session possible and give students more one-on-one attention.',
    cta: { label: 'Ask about volunteering', href: '/contact?topic=volunteer' },
    topic: 'volunteer',
  },
  {
    id: 'mentor',
    title: 'Become a mentor',
    description:
      'Share your experience in business, technology, finance, or your own career path. Mentors help students set goals, build confidence, and see what is possible.',
    cta: { label: 'Ask about mentoring', href: '/contact?topic=mentor' },
    topic: 'mentor',
  },
  {
    id: 'sponsor',
    title: 'Sponsor or partner with us',
    description:
      'Businesses, foundations, schools, and community organizations can sponsor a program, provide equipment or space, or partner with us to expand opportunities for students.',
    cta: {
      label: 'Discuss a partnership',
      href: '/contact?topic=sponsor',
    },
    topic: 'sponsor',
  },
  {
    id: 'donate',
    title: 'Donate',
    description:
      'Your gift keeps our programs free for families, from meals and learning materials to technology and AI education.',
    cta: { label: 'Make a donation', href: '/donate' },
  },
];
