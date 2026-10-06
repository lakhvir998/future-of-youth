'use server';

import { handleFormSubmission } from '@/lib/form-submission';
import { sendRequestInfoEmail } from '@/lib/mailer';
import { createRateLimiter } from '@/lib/rate-limit';
import {
  requestInfoSchema,
  type SubmitRequestInfoResult,
} from '@/lib/request-info';

const isAllowed = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export async function submitRequestInfo(
  input: unknown
): Promise<SubmitRequestInfoResult> {
  return handleFormSubmission({
    input,
    schema: requestInfoSchema,
    isAllowed,
    send: sendRequestInfoEmail,
    name: 'submitRequestInfo',
    failureMessage:
      'Sorry, we could not send your request right now. Please try again later.',
  });
}
