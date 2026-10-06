// DRAFT: client to approve. Topics requested by the client; descriptions avoid
// naming specific tools, partners, or certifications the client hasn't confirmed.

export const AI_TECH_INTRO =
  'Artificial intelligence is changing the world young people are growing up in. Our AI & Technology program helps Detroit youth understand these tools, use them responsibly, stay safe online, and see themselves in the technology careers of the future.';

export type AiTopic = {
  id: string;
  title: string;
  description: string;
  points: string[];
};

export const AI_TOPICS: AiTopic[] = [
  {
    id: 'ai-education',
    title: 'AI Education',
    description:
      'Students learn what artificial intelligence is, how it learns from data, and where they already encounter it every day, from recommendations and voice assistants to tools that generate text and images.',
    points: [
      'How AI systems are built and trained, explained in plain language',
      'Hands-on activities with age-appropriate AI tools',
      'Understanding what AI is good at and where it makes mistakes',
    ],
  },
  {
    id: 'responsible-ai',
    title: 'Responsible AI Use',
    description:
      'Using AI well means using it honestly and thoughtfully. Students learn to treat AI as a tool that supports their own thinking rather than replacing it.',
    points: [
      'Using AI for learning without plagiarism or cheating',
      'Checking AI answers for accuracy and spotting misinformation',
      'Understanding bias and fairness in AI systems',
      'Protecting personal information when using AI tools',
    ],
  },
  {
    id: 'ai-security',
    title: 'AI Security & Cybersecurity',
    description:
      'As technology grows, so do online risks. Students learn how to protect themselves, their families, and future employers from common threats.',
    points: [
      'Strong passwords, multi-factor authentication, and safe browsing',
      'Recognizing phishing, scams, and deepfakes',
      'How AI is used both to attack and to defend systems',
      'Introductory cybersecurity concepts and career paths',
    ],
  },
  {
    id: 'digital-skills',
    title: 'Digital Skills',
    description:
      'Practical skills that help students succeed in school today and in the workplace tomorrow.',
    points: [
      'Confident use of computers, documents, spreadsheets, and presentations',
      'Researching effectively and evaluating online sources',
      'Collaborating and communicating professionally online',
      'An introduction to coding and computational thinking',
    ],
  },
  {
    id: 'career-pathways',
    title: 'Technology Career Pathways',
    description:
      'Students explore the wide range of careers in technology and the education and skills each one requires, so they can make informed choices about their future.',
    points: [
      'Careers in AI, software, data, cybersecurity, and IT support',
      'How technology connects to entrepreneurship and starting a business',
      'Education and training options after high school',
      'Building a portfolio of projects and skills',
    ],
  },
];
