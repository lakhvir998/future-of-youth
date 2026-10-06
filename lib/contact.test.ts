import { describe, expect, it } from 'vitest';

import { contactSchema, isContactTopic } from './contact';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  topic: 'volunteer',
  message: 'I would like to help.\nI am free on weekends.',
};

describe('contactSchema', () => {
  it('accepts a valid message, including line breaks', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['an unknown topic', { topic: 'spam' }],
    ['an empty message', { message: '   ' }],
    ['an overly long message', { message: 'a'.repeat(2001) }],
    ['a NUL character in the message', { message: 'hi\u0000there' }],
    ['a line break in the name', { name: 'Ada\r\nBcc: x@evil.test' }],
    ['an invalid email', { email: 'nope' }],
  ])('rejects %s', (_, override) => {
    expect(contactSchema.safeParse({ ...valid, ...override }).success).toBe(
      false
    );
  });
});

describe('isContactTopic', () => {
  it('only accepts known topics', () => {
    expect(isContactTopic('sponsor')).toBe(true);
    expect(isContactTopic('<script>')).toBe(false);
    expect(isContactTopic(null)).toBe(false);
  });
});
