import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '@/test/axe';

const submitContact = vi.fn();
vi.mock('@/app/actions/submit-contact', () => ({
  submitContact: (...args: unknown[]) => submitContact(...args),
}));

const { ContactForm } = await import('./contact-form');

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
  await user.selectOptions(screen.getByLabelText(/topic/i), 'volunteer');
  await user.type(screen.getByLabelText(/message/i), 'I can help on weekends.');
}

describe('ContactForm', () => {
  beforeEach(() => {
    submitContact.mockReset();
  });

  it('pre-selects the topic passed in', () => {
    render(<ContactForm defaultTopic='sponsor' />);

    expect(screen.getByLabelText(/topic/i)).toHaveValue('sponsor');
  });

  it('focuses the first invalid field and has no axe violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);
    await expectNoAxeViolations(container);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByLabelText(/your name/i)).toHaveFocus();
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('submits and focuses the confirmation', async () => {
    submitContact.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      await screen.findByRole('heading', { name: 'Thank you!' })
    ).toHaveFocus();
    expect(submitContact).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      topic: 'volunteer',
      message: 'I can help on weekends.',
      website: '',
    });
  });

  it('shows the server error and keeps the message', async () => {
    submitContact.mockResolvedValue({ ok: false, message: 'Try later.' });
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Try later.');
    expect(screen.getByLabelText(/message/i)).toHaveValue(
      'I can help on weekends.'
    );
  });
});
