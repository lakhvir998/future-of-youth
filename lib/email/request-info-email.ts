import type { RequestInfo } from '@/lib/request-info';

import { renderEmail, type Section } from './layout';

function listOrDash(values: readonly string[]) {
  return values.length ? values.join(', ') : '-';
}

function getSections({ parent, child }: RequestInfo): Section[] {
  return [
    {
      title: 'Parent or guardian',
      rows: [
        { label: 'Name', value: `${parent.first} ${parent.last}` },
        {
          label: 'Email',
          value: parent.email,
          href: `mailto:${parent.email}`,
        },
        { label: 'State', value: parent.state },
      ],
    },
    {
      title: 'Student',
      rows: [
        { label: 'Name', value: `${child.first} ${child.last}` },
        { label: 'Grade', value: child.grade },
        { label: 'Academic interests', value: listOrDash(child.interests) },
        { label: 'Program preferences', value: listOrDash(child.programs) },
      ],
    },
  ];
}

export const REQUEST_INFO_HEADING = 'New Program Info Request';

/** Builds the staff notification email. Every user-supplied value is HTML-escaped. */
export function buildRequestInfoEmail(
  data: RequestInfo,
  submittedAt = new Date()
) {
  const { parent, child } = data;
  // Subject uses only the validated grade enum, never free text.
  const subject = `${REQUEST_INFO_HEADING}: Grade ${child.grade}`;
  const parentName = `${parent.first} ${parent.last}`;

  const { html, text } = renderEmail({
    heading: REQUEST_INFO_HEADING,
    preheader: `${parentName} asked about programs for a grade ${child.grade} student.`,
    intro:
      'A parent or guardian asked for information about our free programs.',
    sections: getSections(data),
    reply: {
      name: parentName,
      email: parent.email,
      subject: 'Your Future of the Youth program info request',
    },
    source: 'program info request form',
    submittedAt,
  });

  return { subject, html, text };
}
