import { describe, expect, it } from 'vitest';

import {
  getFieldErrors,
  parentSchema,
  requestInfoSchema,
} from './request-info';

const validInput = {
  parent: {
    first: 'Ada',
    last: 'Lovelace',
    email: 'ada@example.com',
    state: 'MI',
  },
  child: {
    first: 'Byron',
    last: 'Lovelace',
    grade: '7',
    interests: ['Mathematics'],
    programs: ['Online Programs'],
  },
};

describe('requestInfoSchema', () => {
  it('accepts a valid submission and trims whitespace', () => {
    const result = requestInfoSchema.safeParse({
      ...validInput,
      parent: { ...validInput.parent, first: '  Ada  ' },
    });

    expect(result.success).toBe(true);
    expect(result.data?.parent.first).toBe('Ada');
  });

  it.each([
    ['an invalid email', { parent: { ...validInput.parent, email: 'nope' } }],
    ['an out-of-range grade', { child: { ...validInput.child, grade: '13' } }],
    [
      'an unknown interest',
      { child: { ...validInput.child, interests: ['<script>'] } },
    ],
    ['no programs', { child: { ...validInput.child, programs: [] } }],
    [
      'control characters in a name',
      { parent: { ...validInput.parent, first: 'Ada\r\nBcc: x@evil.test' } },
    ],
    [
      'an overly long name',
      { parent: { ...validInput.parent, first: 'a'.repeat(101) } },
    ],
  ])('rejects %s', (_, override) => {
    expect(
      requestInfoSchema.safeParse({ ...validInput, ...override }).success
    ).toBe(false);
  });
});

describe('getFieldErrors', () => {
  it('returns null for valid data', () => {
    expect(getFieldErrors(parentSchema, validInput.parent)).toBeNull();
  });

  it('returns one message per invalid field', () => {
    const errors = getFieldErrors(parentSchema, {
      first: '',
      last: 'Lovelace',
      email: 'bad',
      state: '',
    });

    expect(errors).toEqual({
      first: 'First name is required.',
      email: 'Enter a valid email address.',
      state: 'State is required.',
    });
  });
});
