import { z } from 'zod';

// Server-only configuration. Import this only from server code (Server Actions,
// route handlers); none of these variables are NEXT_PUBLIC_, so they are never
// inlined into the client bundle.

const serverEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1).optional(),
  FORM_TO_EMAIL: z.email(),
});

export type ServerEnv = z.output<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | undefined;

/** Validates lazily so `next build` doesn't require SMTP credentials. */
export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    const invalidKeys = [
      ...new Set(result.error.issues.map((issue) => issue.path.join('.'))),
    ];
    throw new Error(
      `Invalid or missing environment variables: ${invalidKeys.join(', ')}`
    );
  }

  cachedEnv = result.data;
  return cachedEnv;
}
