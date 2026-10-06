import type { z } from 'zod';

import { getClientIp } from '@/lib/client-ip';
import type { SubmitResult } from '@/lib/validation';

type FormSubmission<T extends z.ZodType<{ website?: string }>> = {
  input: unknown;
  schema: T;
  isAllowed: (key: string) => boolean;
  send: (data: z.output<T>) => Promise<void>;
  /** Used in server logs only. */
  name: string;
  failureMessage: string;
};

/**
 * The shared pipeline behind every public form's Server Action:
 * rate limit → validate on the server → honeypot → send → generic errors.
 */
export async function handleFormSubmission<
  T extends z.ZodType<{ website?: string }>,
>({
  input,
  schema,
  isAllowed,
  send,
  name,
  failureMessage,
}: FormSubmission<T>): Promise<SubmitResult> {
  if (!isAllowed(await getClientIp())) {
    return {
      ok: false,
      message: 'Too many requests. Please try again in a few minutes.',
    };
  }

  // Never trust the client: re-validate everything on the server.
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please check the form for errors and try again.',
    };
  }

  // Pretend success so bots don't learn the honeypot exists.
  if (parsed.data.website) return { ok: true };

  try {
    await send(parsed.data);
    return { ok: true };
  } catch (error) {
    // Log the cause without the submission itself, which contains PII.
    console.error(
      `[${name}] Failed to send email:`,
      error instanceof Error ? error.message : error
    );
    return { ok: false, message: failureMessage };
  }
}
