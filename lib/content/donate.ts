// Donation messaging: the client's exact wording.
export const DONATE_TITLE = 'Invest in the Future';

export const DONATE_PARAGRAPHS = [
  'Your support helps Future of the Youth provide young people with access to entrepreneurship education, financial literacy, artificial intelligence training, technology, mentorship, and career-development opportunities.',
  'Donations can help support educational programming, computers and technology, learning materials, instructors, workshops, community outreach, and program expansion.',
  'Every contribution helps us create more opportunities for the next generation.',
] as const;

/** Displayed in capitals via CSS, so screen readers don't spell it out. */
export const DONATE_BUTTON_LABEL = 'Donate Now';

// The items from the client's second paragraph, shown as a scannable list.
export const DONATION_USES = [
  'Educational programming',
  'Computers and technology',
  'Learning materials',
  'Instructors',
  'Workshops',
  'Community outreach',
  'Program expansion',
] as const;

// DRAFT: client to approve.
export const OTHER_WAYS_TO_GIVE =
  'Interested in sponsoring a program, making an in-kind donation, or giving through your employer? Contact us and we will be glad to help.';

// Thank-you page Zeffy redirects donors to after a completed payment
// (/donate/thank-you). DRAFT: client to approve.
export const DONATION_THANK_YOU_TITLE = 'Thank You for Your Donation';

export const DONATION_THANK_YOU_INTRO =
  'Your gift helps Future of the Youth create more opportunities for the next generation.';

/** Followed by a "contact us" link to the Contact page. */
export const DONATION_THANK_YOU_QUESTIONS =
  'If you have any questions about your donation, please';
