import { z } from 'zod';

import {
  emailSchema,
  requiredMultilineText,
  requiredText,
} from '@/lib/validation';

export { getFieldErrors, type FieldErrors } from '@/lib/validation';

// Shared by the contact form and its server action.

export const CONTACT_TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'programs', label: 'Programs and enrollment' },
  { value: 'volunteer', label: 'Volunteering' },
  { value: 'mentor', label: 'Becoming a mentor' },
  { value: 'sponsor', label: 'Sponsorship or partnership' },
  { value: 'donation', label: 'Donations' },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['value'];

const TOPIC_VALUES = CONTACT_TOPICS.map((topic) => topic.value) as [
  ContactTopic,
  ...ContactTopic[],
];

export function isContactTopic(value: unknown): value is ContactTopic {
  return TOPIC_VALUES.includes(value as ContactTopic);
}

export function getTopicLabel(topic: ContactTopic) {
  return CONTACT_TOPICS.find((t) => t.value === topic)?.label ?? topic;
}

export const contactSchema = z.object({
  name: requiredText('Name'),
  email: emailSchema,
  topic: z.enum(TOPIC_VALUES, 'Select a topic.'),
  message: requiredMultilineText('Message'),
  // Honeypot: hidden from humans, so any value means a bot filled it in.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type Contact = z.output<typeof contactSchema>;
