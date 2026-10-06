'use client';

import { useSearchParams } from 'next/navigation';

import { isContactTopic } from '@/lib/contact';

import { ContactForm } from './contact-form';

/** Pre-selects the topic from `?topic=` (e.g. links on Get Involved). */
export function ContactFormWithTopic() {
  const topic = useSearchParams().get('topic');
  return (
    <ContactForm defaultTopic={isContactTopic(topic) ? topic : undefined} />
  );
}
