import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NAV_ITEMS } from '@/lib/content/pages';
import { expectNoAxeViolations } from '@/test/axe';

let pathname = '/about';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

const { MobileNav } = await import('./mobile-nav');
const { isCurrentPath } = await import('./nav-links');

describe('MobileNav', () => {
  beforeEach(() => {
    pathname = '/about';
  });

  it('toggles the menu and exposes its state', async () => {
    const user = userEvent.setup();
    render(<MobileNav items={NAV_ITEMS} />);
    const button = screen.getByRole('button', { name: 'Menu' });

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeVisible();
  });

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<MobileNav items={NAV_ITEMS} />);
    const button = screen.getByRole('button', { name: 'Menu' });

    await user.click(button);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('marks the current page', async () => {
    const user = userEvent.setup();
    render(<MobileNav items={NAV_ITEMS} />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('has no axe violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<MobileNav items={NAV_ITEMS} />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));

    await expectNoAxeViolations(container);
  });
});

describe('isCurrentPath', () => {
  it('matches nested program pages to Programs, but Home only exactly', () => {
    expect(isCurrentPath('/programs/career-leadership', '/programs')).toBe(
      true
    );
    expect(isCurrentPath('/programs', '/')).toBe(false);
    expect(isCurrentPath('/', '/')).toBe(true);
  });
});
