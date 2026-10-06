// DRAFT: client to approve. Program descriptions are written from the
// organization's existing site copy and the client's program list. They avoid
// specific numbers, schedules, partners, or locations the client hasn't
// confirmed.

export type Program = {
  slug: string;
  title: string;
  /** One or two sentences for cards, meta descriptions, and structured data. */
  summary: string;
  /** Where the program's full description lives. */
  href: string;
  intro: string[];
  audience: string;
  outcomes: string[];
  approach: string[];
};

export const PROGRAMS: Program[] = [
  {
    slug: 'ai-technology',
    title: 'AI & Technology',
    summary:
      'Hands-on learning in artificial intelligence, responsible AI use, cybersecurity, and the digital skills students need for tomorrow’s careers.',
    href: '/ai-technology',
    intro: [
      'Artificial intelligence and digital technology are reshaping how people learn, work, and build businesses. Our AI & Technology program makes sure Detroit youth are ready to take part in that future, not left behind by it.',
      'Students learn what AI is and how it works, practice using AI tools responsibly, learn to protect themselves and others online, and explore the many career paths that technology opens up.',
    ],
    audience:
      'Students who are curious about computers, AI, or technology careers, whether they are complete beginners or already enjoy building with technology.',
    outcomes: [
      'Understand what artificial intelligence is, what it can and cannot do, and how it is used in everyday life',
      'Use AI tools responsibly, honestly, and safely for learning and creative work',
      'Recognize online risks and practice core cybersecurity habits',
      'Build practical digital skills for school and work',
      'Explore technology career pathways and the steps to get there',
    ],
    approach: [
      'Hands-on activities and projects rather than lectures',
      'Lessons connected to entrepreneurship, so students see how technology helps people build businesses',
      'Guidance from mentors who encourage questions and curiosity',
    ],
  },
  {
    slug: 'entrepreneurship',
    title: 'Entrepreneurship',
    summary:
      'Students learn how to turn ideas into businesses, from spotting opportunities to planning, pitching, and understanding how businesses are funded.',
    href: '/programs/entrepreneurship',
    intro: [
      'Our entrepreneurship program gives young people a chance to learn how to start a business. Students learn to identify problems worth solving, turn ideas into plans, and understand what it takes to launch and grow a venture.',
      'Along the way, students are introduced to real-world tools such as business funding and investing, so they understand how businesses are financed and how wealth is built over time.',
    ],
    audience:
      'Students with an idea, a side hustle, or simply an interest in how businesses work.',
    outcomes: [
      'Identify opportunities and turn ideas into simple business plans',
      'Understand customers, pricing, costs, and profit',
      'Learn how businesses are funded and how investing works',
      'Practice presenting and pitching ideas with confidence',
      'Build problem-solving, leadership, and teamwork skills',
    ],
    approach: [
      'Project-based learning where students develop their own ideas',
      'Connections to financial literacy, so business lessons build on money skills',
      'Encouragement and feedback from mentors',
    ],
  },
  {
    slug: 'financial-literacy',
    title: 'Financial Literacy',
    summary:
      'Practical money skills, including budgeting, saving, and investing basics, that help students make informed decisions and build a secure future.',
    href: '/programs/financial-literacy',
    intro: [
      'We provide financial literacy education to equip students with the knowledge and tools they need to make informed decisions about money management, saving, and building a secure future.',
      'By introducing these concepts early, we empower young people, especially those from minority communities, to break cycles of financial hardship and create generational stability.',
    ],
    audience:
      'Students of all ages who want to understand money, from first allowances to planning for college and work.',
    outcomes: [
      'Create and follow a simple budget',
      'Understand saving, spending, and setting financial goals',
      'Learn the basics of banking, credit, and avoiding debt traps',
      'Get an introduction to investing, including how the stock market works',
      'Make confident, informed decisions about money',
    ],
    approach: [
      'Age-appropriate lessons using real-life examples',
      'Interactive activities that make money concepts concrete',
      'A foundation for the entrepreneurship program',
    ],
  },
  {
    slug: 'mentorship',
    title: 'Mentorship',
    summary:
      'Caring adult mentors who guide students, encourage them, and help them set and reach goals in school and life.',
    href: '/programs/mentorship',
    intro: [
      'Mentorship is at the heart of everything we do. Our mentors encourage students, help them set goals, and support them through challenges in school and in life.',
      'Every tutoring session, every shared meal, and every moment of encouragement helps create lasting change. Mentors help students build the confidence and resilience to keep going.',
    ],
    audience:
      'Any student in our programs who would benefit from encouragement, guidance, and a trusted adult in their corner.',
    outcomes: [
      'Set personal, academic, and career goals and make a plan to reach them',
      'Build confidence, resilience, and communication skills',
      'Get guidance on school, college, and career decisions',
      'Have a trusted adult to turn to for advice and encouragement',
    ],
    approach: [
      'Mentors who encourage questions and celebrate progress',
      'A safe, welcoming, and supportive environment',
      'Mentorship woven into tutoring, workshops, and activities',
    ],
  },
  {
    slug: 'youth-development',
    title: 'Youth Development',
    summary:
      'Free tutoring, academic support, sports, community, and nutritious meals in a safe space where every student can focus and thrive.',
    href: '/programs/youth-development',
    intro: [
      'By addressing educational gaps and providing personalized support, we aim to close the achievement divide and ensure that minority students in our community have the tools they need to thrive academically and beyond. Our program is not just about homework help—it’s about fostering resilience, promoting equity, and building brighter futures.',
      'In addition to academic support, our program emphasizes the importance of life skills and overall well-being. Students engage in sports, build community, and develop essential life skills. To ensure every child can focus and thrive, we also serve free, nutritious lunches during all sessions.',
    ],
    audience:
      'Students in grades 2 through 12 who want extra academic support and a positive, supportive community.',
    outcomes: [
      'Strengthen skills in core subjects through tutoring and academic support',
      'Build healthy habits, teamwork, and friendships through sports and activities',
      'Develop essential life skills and confidence',
      'Feel safe, supported, and part of a community',
    ],
    approach: [
      'Personalized tutoring and skill-building workshops',
      'Sports and community activities',
      'Free, nutritious lunches during all sessions',
    ],
  },
];

/** Programs that have their own page under /programs/[slug]. */
export function getProgramDetailPages() {
  return PROGRAMS.filter((program) => program.href.startsWith('/programs/'));
}

export function getProgramBySlug(slug: string) {
  return PROGRAMS.find((program) => program.slug === slug);
}
