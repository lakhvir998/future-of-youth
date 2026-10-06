import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '@/test/axe';

const submitRequestInfo = vi.fn();

vi.mock('@/app/actions/submit-request-info', () => ({
  submitRequestInfo: (...args: unknown[]) => submitRequestInfo(...args),
}));

const { RequestInfoForm } = await import('./request-info-form');

async function fillParentStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/parent first name/i), 'Ada');
  await user.type(screen.getByLabelText(/parent last name/i), 'Lovelace');
  await user.type(screen.getByLabelText(/parent email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/^state/i), 'MI');
  await user.click(screen.getByRole('button', { name: /next/i }));
}

async function fillChildStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/child's first name/i), 'Byron');
  await user.type(screen.getByLabelText(/child's last name/i), 'Lovelace');
  await user.selectOptions(screen.getByLabelText(/child's grade/i), '7');
  await user.click(screen.getByLabelText('Mathematics'));
  await user.click(screen.getByLabelText('Online Programs'));
}

describe('RequestInfoForm', () => {
  beforeEach(() => {
    submitRequestInfo.mockReset();
  });

  it('shows field errors and stays on step 1 when parent info is missing', async () => {
    const user = userEvent.setup();
    render(<RequestInfoForm />);

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByLabelText(/parent first name/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
  });

  it('submits valid data and shows the success message', async () => {
    submitRequestInfo.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<RequestInfoForm />);

    await fillParentStep(user);
    await fillChildStep(user);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Thank you!')).toBeInTheDocument();
    expect(submitRequestInfo).toHaveBeenCalledWith({
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
      website: '',
    });
  });

  it('keeps entered data and shows the server error on failure', async () => {
    submitRequestInfo.mockResolvedValue({
      ok: false,
      message: 'Server said no.',
    });
    const user = userEvent.setup();
    render(<RequestInfoForm />);

    await fillParentStep(user);
    await fillChildStep(user);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Server said no.'
    );
    expect(screen.getByLabelText(/child's first name/i)).toHaveValue('Byron');
  });
});

describe('RequestInfoForm accessibility', () => {
  beforeEach(() => {
    submitRequestInfo.mockReset();
  });

  it('has no axe violations on either step, with or without errors', async () => {
    const user = userEvent.setup();
    const { container } = render(<RequestInfoForm />);

    await expectNoAxeViolations(container);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await expectNoAxeViolations(container);

    await fillParentStep(user);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    await expectNoAxeViolations(container);
  });

  it('moves focus to the first invalid field after a failed step', async () => {
    const user = userEvent.setup();
    render(<RequestInfoForm />);

    await user.type(screen.getByLabelText(/parent first name/i), 'Ada');
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByLabelText(/parent last name/i)).toHaveFocus();
  });

  it('moves focus to the step indicator when the step changes', async () => {
    const user = userEvent.setup();
    render(<RequestInfoForm />);

    await fillParentStep(user);
    expect(screen.getByText('Step 2 of 2')).toHaveFocus();

    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('Step 1 of 2')).toHaveFocus();
  });

  it('marks checkbox groups as required and invalid for assistive tech', async () => {
    const user = userEvent.setup();
    render(<RequestInfoForm />);

    await fillParentStep(user);
    await user.click(screen.getByRole('button', { name: /submit/i }));

    const interests = screen.getByRole('group', {
      name: "Child's Academic Interest(s) (required)",
    });
    expect(interests).toHaveAccessibleDescription(
      'Select at least one academic interest.'
    );
    expect(screen.getByLabelText('Mathematics')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('hides decorative arrows from the accessible name', () => {
    render(<RequestInfoForm />);

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('keeps focus on the submit button while sending', async () => {
    let resolve: (value: { ok: true }) => void = () => {};
    submitRequestInfo.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      })
    );
    const user = userEvent.setup();
    render(<RequestInfoForm />);

    await fillParentStep(user);
    await fillChildStep(user);
    const submit = screen.getByRole('button', { name: /submit/i });
    await user.click(submit);

    const sending = screen.getByRole('button', { name: /sending/i });
    expect(sending).toHaveAttribute('aria-disabled', 'true');
    expect(sending).toHaveFocus();

    resolve({ ok: true });
    expect(
      await screen.findByRole('heading', { name: 'Thank you!' })
    ).toHaveFocus();
  });
});
