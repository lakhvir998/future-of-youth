// The four programs, in the client's order. Each `summary` is the client's exact
// wording (from their "Our Programs" list). The remaining fields are
// DRAFT: client to approve. They expand on the client's descriptions and avoid
// specific numbers, schedules, partners, or locations the client hasn't
// confirmed.

export type Program = {
  slug: string;
  title: string;
  /** Client wording. Used on cards and structured data. */
  summary: string;
  /** DRAFT: search-result description, kept under ~160 characters. */
  metaDescription: string;
  /** Where the program's full description lives. */
  href: string;
  intro: string[];
  audience: string;
  outcomes: string[];
  approach: string[];
};

export const PROGRAMS: Program[] = [
  {
    slug: 'entrepreneurship',
    title: 'Entrepreneurship',
    summary:
      'Youth learn the fundamentals of turning an idea into a business, including business planning, branding, marketing, business formation, customer acquisition, and understanding how businesses generate revenue.',
    metaDescription:
      'Free entrepreneurship program for youth: business planning, branding, marketing, business formation, finding customers, and how businesses make money.',
    href: '/programs/entrepreneurship',
    intro: [
      'Our entrepreneurship program gives young people a chance to learn how to start a business. Students learn to identify problems worth solving, turn ideas into plans, and understand what it takes to launch and grow a venture.',
      'Along the way, students are introduced to real-world tools such as business funding and investing, so they understand how businesses are financed and how wealth is built over time.',
    ],
    audience:
      'Students with an idea, a side hustle, or simply an interest in how businesses work.',
    outcomes: [
      'Turn an idea into a simple business plan',
      'Build a brand and market it to the right customers',
      'Understand how a business is formed and set up',
      'Find and keep customers',
      'Learn how businesses generate revenue, manage costs, and earn a profit',
      'Practice presenting and pitching ideas with confidence',
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
      'Participants learn practical money-management skills, including budgeting, saving, credit, banking, responsible borrowing, investing fundamentals, and building long-term financial stability.',
    metaDescription:
      'Free financial literacy program for youth: budgeting, saving, credit, banking, responsible borrowing, and investing fundamentals.',
    href: '/programs/financial-literacy',
    intro: [
      'We provide financial literacy education to equip students with the knowledge and tools they need to make informed decisions about money management, saving, and building a secure future.',
      'By introducing these concepts early, we empower young people, especially those from minority communities, to break cycles of financial hardship and create generational stability.',
    ],
    audience:
      'Students of all ages who want to understand money, from first allowances to planning for college and work.',
    outcomes: [
      'Create and follow a budget',
      'Build saving habits and set financial goals',
      'Understand credit, credit scores, and how to use banking services',
      'Borrow responsibly and avoid debt traps',
      'Learn investing fundamentals, including how the stock market works',
      'Plan for long-term financial stability',
    ],
    approach: [
      'Age-appropriate lessons using real-life examples',
      'Interactive activities that make money concepts concrete',
      'A foundation for the entrepreneurship program',
    ],
  },
  {
    slug: 'ai-technology',
    title: 'Artificial Intelligence & Technology',
    summary:
      'Youth are introduced to artificial intelligence and learn how AI is changing education, careers, entrepreneurship, and business. Training will include practical AI applications, responsible AI use, AI security, governance, and understanding the risks associated with emerging technology.',
    metaDescription:
      'AI and technology education for youth: practical AI applications, responsible AI use, AI security, governance, and the risks of emerging technology.',
    href: '/ai-technology',
    intro: [
      'Artificial intelligence and digital technology are reshaping how people learn, work, and build businesses. Our AI & Technology program makes sure young people are ready to take part in that future, not left behind by it.',
      'Students learn what AI is and how it works, practice using AI tools responsibly, learn to protect themselves and others online, and explore the many career paths that technology opens up.',
    ],
    audience:
      'Students who are curious about computers, AI, or technology careers, whether they are complete beginners or already enjoy building with technology.',
    outcomes: [
      'Understand how AI is changing education, careers, entrepreneurship, and business',
      'Apply AI tools to practical, real-world tasks',
      'Use AI responsibly, honestly, and safely',
      'Recognize AI security risks and practice core cybersecurity habits',
      'Understand AI governance and the risks of emerging technology',
    ],
    approach: [
      'Hands-on activities and projects rather than lectures',
      'Lessons connected to entrepreneurship, so students see how technology helps people build businesses',
      'Guidance from mentors who encourage questions and curiosity',
    ],
  },
  {
    slug: 'career-leadership',
    title: 'Career & Leadership Development',
    summary:
      'Participants develop communication, leadership, problem-solving, goal-setting, networking, and professional skills designed to prepare them for college, careers, entrepreneurship, and leadership opportunities.',
    metaDescription:
      'Free career and leadership program for youth: communication, leadership, problem-solving, goal-setting, networking, and professional skills.',
    href: '/programs/career-leadership',
    intro: [
      'Success in college, careers, and business depends on more than knowledge. Our Career & Leadership Development program helps young people build the communication, leadership, and professional skills that open doors.',
      'Mentorship is woven throughout: mentors help students set goals, work through challenges, and see what is possible for their futures.',
    ],
    audience:
      'Students preparing for college, their first job, starting a business, or taking on leadership roles in school and their community.',
    outcomes: [
      'Communicate clearly and confidently, in person and in writing',
      'Lead teams and solve problems together',
      'Set goals and make a plan to reach them',
      'Build a professional network and make a strong first impression',
      'Develop professional skills for college applications, interviews, and the workplace',
    ],
    approach: [
      'Mentors who guide students and celebrate their progress',
      'Practice through real-world activities, presentations, and teamwork',
      'Connections to entrepreneurship and technology career pathways',
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
