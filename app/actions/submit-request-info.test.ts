import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendRequestInfoEmail = vi.fn();
let clientIp = '1.1.1.1';

vi.mock('@/lib/mailer', () => ({
  sendRequestInfoEmail: (...args: unknown[]) => sendRequestInfoEmail(...args),
}));

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': clientIp }),
}));

const { submitRequestInfo } = await import('./submit-request-info');

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

let ipCounter = 0;

describe('submitRequestInfo', () => {
  beforeEach(() => {
    sendRequestInfoEmail.mockReset();
    // Fresh IP per test so the module-level rate limiter doesn't leak state.
    clientIp = `10.0.0.${++ipCounter}`;
  });

  it('sends the email for a valid submission', async () => {
    sendRequestInfoEmail.mockResolvedValue(undefined);

    await expect(submitRequestInfo(validInput)).resolves.toEqual({ ok: true });
    expect(sendRequestInfoEmail).toHaveBeenCalledOnce();
  });

  it('rejects invalid input without sending', async () => {
    const result = await submitRequestInfo({
      ...validInput,
      parent: { ...validInput.parent, email: 'not-an-email' },
    });

    expect(result.ok).toBe(false);
    expect(sendRequestInfoEmail).not.toHaveBeenCalled();
  });

  it('silently accepts honeypot submissions without sending', async () => {
    const result = await submitRequestInfo({
      ...validInput,
      website: 'http://spam.example',
    });

    expect(result).toEqual({ ok: true });
    expect(sendRequestInfoEmail).not.toHaveBeenCalled();
  });

  it('returns a generic message and does not leak internal errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    sendRequestInfoEmail.mockRejectedValue(
      new Error('535 Authentication failed for user smtp-secret')
    );

    const result = await submitRequestInfo(validInput);

    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain('smtp-secret');
  });

  it('rate limits repeated submissions from the same IP', async () => {
    sendRequestInfoEmail.mockResolvedValue(undefined);

    for (let i = 0; i < 5; i++) await submitRequestInfo(validInput);
    const result = await submitRequestInfo(validInput);

    expect(result).toEqual({
      ok: false,
      message: expect.stringMatching(/too many requests/i),
    });
    expect(sendRequestInfoEmail).toHaveBeenCalledTimes(5);
  });
});
