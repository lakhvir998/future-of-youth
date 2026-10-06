import { getTopicLabel, type Contact } from '@/lib/contact';

import { renderEmail } from './layout';

/** Builds the staff notification email. Every user-supplied value is HTML-escaped. */
export function buildContactEmail(data: Contact, submittedAt = new Date()) {
  const topic = getTopicLabel(data.topic);
  // The subject only contains the fixed topic label, never user input.
  const subject = `New Contact Message: ${topic}`;

  const { html, text } = renderEmail({
    heading: 'New Contact Message',
    preheader: `${data.name} wrote about: ${topic}.`,
    intro: `Someone sent a message through the website contact form about “${topic}”.`,
    sections: [
      {
        title: 'From',
        rows: [
          { label: 'Name', value: data.name },
          { label: 'Email', value: data.email, href: `mailto:${data.email}` },
          { label: 'Topic', value: topic },
        ],
      },
    ],
    message: { title: 'Message', body: data.message },
    reply: {
      name: data.name,
      email: data.email,
      subject: `Re: ${topic}`,
    },
    source: 'contact form',
    submittedAt,
  });

  return { subject, html, text };
}
