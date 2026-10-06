import { z } from 'zod';

import { emailSchema, requiredText } from '@/lib/validation';

export {
  getFieldErrors,
  type FieldErrors,
  type SubmitResult as SubmitRequestInfoResult,
} from '@/lib/validation';

// Shared by the client form and the server action so validation can't drift.

export const ACADEMIC_INTERESTS = [
  'Computer Science and Technology',
  'History and Social Science',
  'Language Arts',
  'Mathematics',
  'Science and Engineering',
  // Program areas added for the 2026 program lineup.
  'AI & Technology',
  'Entrepreneurship',
  'Financial Literacy',
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

export const parentSchema = z.object({
  first: requiredText('First name'),
  last: requiredText('Last name'),
  email: emailSchema,
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
