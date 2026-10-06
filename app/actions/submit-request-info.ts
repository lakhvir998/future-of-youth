'use server';

import { headers } from 'next/headers';

import { sendRequestInfoEmail } from '@/lib/mailer';
import { createRateLimiter } from '@/lib/rate-limit';
import {
  requestInfoSchema,
  type SubmitRequestInfoResult,
} from '@/lib/request-info';

const isAllowed = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

async function getClientIp() {
  const headerList = await headers();
  // Vercel sets x-real-ip itself; the first X-Forwarded-For hop can be
  // client-supplied behind other proxies, so it's only a fallback.
  return (
    headerList.get('x-real-ip')?.trim() ||
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export async function submitRequestInfo(
  input: unknown
): Promise<SubmitRequestInfoResult> {
  if (!isAllowed(await getClientIp())) {
    return {
      ok: false,
      message: 'Too many requests. Please try again in a few minutes.',
    };
  }

  // Never trust the client: re-validate everything on the server.
  const parsed = requestInfoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: 'Please check the form for errors and try again.',
    };
  }

  // Pretend success so bots don't learn the honeypot exists.
  if (parsed.data.website) return { ok: true };

  try {
    await sendRequestInfoEmail(parsed.data);
    return { ok: true };
  } catch (error) {
    // Log the cause without the submission itself, which contains PII about minors.
    console.error(
      '[submitRequestInfo] Failed to send email:',
      error instanceof Error ? error.message : error
    );
    return {
      ok: false,
      message:
        'Sorry, we could not send your request right now. Please try again later.',
    };
  }
}
