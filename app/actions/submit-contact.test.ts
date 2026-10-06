import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendContactEmail = vi.fn();
let clientIp = '1.1.1.1';

vi.mock('@/lib/mailer', () => ({
  sendContactEmail: (...args: unknown[]) => sendContactEmail(...args),
}));

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-real-ip': clientIp }),
}));

const { submitContact } = await import('./submit-contact');

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  topic: 'general',
  message: 'Hello!',
};

let ipCounter = 0;

describe('submitContact', () => {
  beforeEach(() => {
    sendContactEmail.mockReset();
    clientIp = `10.1.0.${++ipCounter}`;
  });

  it('sends a valid message', async () => {
    sendContactEmail.mockResolvedValue(undefined);

    await expect(submitContact(valid)).resolves.toEqual({ ok: true });
    expect(sendContactEmail).toHaveBeenCalledOnce();
  });

  it('rejects invalid input without sending', async () => {
    const result = await submitContact({ ...valid, topic: 'hack' });

    expect(result.ok).toBe(false);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it('silently drops honeypot submissions', async () => {
    await expect(
      submitContact({ ...valid, website: 'http://spam.example' })
    ).resolves.toEqual({ ok: true });
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it('does not leak internal errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    sendContactEmail.mockRejectedValue(new Error('SMTP password=hunter2'));

    const result = await submitContact(valid);

    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain('hunter2');
  });

  it('rate limits repeated messages from one IP', async () => {
    sendContactEmail.mockResolvedValue(undefined);
    for (let i = 0; i < 5; i++) await submitContact(valid);

    const result = await submitContact(valid);
    expect(result).toMatchObject({ ok: false });
    expect(sendContactEmail).toHaveBeenCalledTimes(5);
  });
});
