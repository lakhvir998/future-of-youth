'use server';

import { contactSchema } from '@/lib/contact';
import { handleFormSubmission } from '@/lib/form-submission';
import { sendContactEmail } from '@/lib/mailer';
import { createRateLimiter } from '@/lib/rate-limit';
import type { SubmitResult } from '@/lib/validation';

const isAllowed = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function submitContact(input: unknown): Promise<SubmitResult> {
  return handleFormSubmission({
    input,
    schema: contactSchema,
    isAllowed,
    send: sendContactEmail,
    name: 'submitContact',
    failureMessage:
      'Sorry, we could not send your message right now. Please try again later.',
  });
}
