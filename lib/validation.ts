import { z } from 'zod';

export const NAME_MAX_LENGTH = 100;
export const MESSAGE_MAX_LENGTH = 2000;

// C0/C1 control characters, including CR/LF and NUL.
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/;
// Same, but allows tab and line breaks for multi-line messages.
const CONTROL_CHARS_EXCEPT_WHITESPACE =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/;

/** Required single-line text: trimmed, length-limited, no control characters. */
export function requiredText(label: string, maxLength = NAME_MAX_LENGTH) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)
    .refine((value) => !CONTROL_CHARS.test(value), {
      error: `${label} contains invalid characters.`,
    });
}

/** Required multi-line text: like requiredText, but line breaks are allowed. */
export function requiredMultilineText(
  label: string,
  maxLength = MESSAGE_MAX_LENGTH
) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)
    .refine((value) => !CONTROL_CHARS_EXCEPT_WHITESPACE.test(value), {
      error: `${label} contains invalid characters.`,
    });
}

export const emailSchema = z
  .string()
  .trim()
  .pipe(z.email('Enter a valid email address.').max(254));

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Returns the first error message per field, or null when the data is valid. */
export function getFieldErrors<T extends z.ZodType>(
  schema: T,
  data: unknown
): FieldErrors<z.input<T>> | null {
  const result = schema.safeParse(data);
  if (result.success) return null;

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !errors[key]) errors[key] = issue.message;
  }
  return errors as FieldErrors<z.input<T>>;
}

export type SubmitResult = { ok: true } | { ok: false; message: string };
