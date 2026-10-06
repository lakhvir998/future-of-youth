import { z } from 'zod';

// Shared by the client form and the server action so validation can't drift.

export const ACADEMIC_INTERESTS = [
  'Computer Science and Technology',
  'History and Social Science',
  'Language Arts',
  'Mathematics',
  'Science and Engineering',
] as const;

export const PROGRAM_PREFERENCES = [
  'Online Programs',
  'On-Campus Programs',
] as const;

export const GRADES = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
] as const;

const NAME_MAX_LENGTH = 100;
// Matches C0/C1 control characters, including CR/LF and NUL.
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/;

function requiredText(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(
      NAME_MAX_LENGTH,
      `${label} must be ${NAME_MAX_LENGTH} characters or fewer.`
    )
    .refine((value) => !CONTROL_CHARS.test(value), {
      error: `${label} contains invalid characters.`,
    });
}

export const parentSchema = z.object({
  first: requiredText('First name'),
  last: requiredText('Last name'),
  email: z
    .string()
    .trim()
    .pipe(z.email('Enter a valid email address.').max(254)),
  state: requiredText('State'),
});

export const childSchema = z.object({
  first: requiredText('First name'),
  last: requiredText('Last name'),
  grade: z.enum(GRADES, 'Select a grade.'),
  interests: z
    .array(z.enum(ACADEMIC_INTERESTS))
    .min(1, 'Select at least one academic interest.')
    .max(ACADEMIC_INTERESTS.length),
  programs: z
    .array(z.enum(PROGRAM_PREFERENCES))
    .min(1, 'Select at least one program preference.')
    .max(PROGRAM_PREFERENCES.length),
});

export const requestInfoSchema = z.object({
  parent: parentSchema,
  child: childSchema,
  // Honeypot: hidden from humans, so any value means a bot filled it in.
  website: z.string().max(200).optional(),
});

export type AcademicInterest = (typeof ACADEMIC_INTERESTS)[number];
export type ProgramPreference = (typeof PROGRAM_PREFERENCES)[number];

export type ParentInput = z.input<typeof parentSchema>;
export type ChildInput = z.input<typeof childSchema>;
export type RequestInfoInput = z.input<typeof requestInfoSchema>;
export type RequestInfo = z.output<typeof requestInfoSchema>;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type SubmitRequestInfoResult =
  { ok: true } | { ok: false; message: string };

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
