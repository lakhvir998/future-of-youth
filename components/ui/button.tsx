import type { ComponentProps, MouseEvent } from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  secondary: 'bg-gray-200 text-navy hover:bg-gray-300',
};

/** Shared so links that look like buttons stay consistent with <Button>. */
export function buttonClasses(variant: ButtonVariant = 'primary') {
  return cn(
    'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-8 py-3 text-lg font-semibold shadow transition',
    // `outline-hidden` keeps a visible outline in Windows forced-colors mode.
    'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-hidden',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-60',
    VARIANT_CLASSES[variant]
  );
}

type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant };

/**
 * `disabled` is rendered as `aria-disabled` so the button keeps keyboard focus
 * (a natively disabled button drops focus to <body>, WCAG 2.4.3) while clicks
 * and submits are still blocked.
 */
export function Button({
  variant = 'primary',
  className,
  type = 'button',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  }

  return (
    <button
      type={type}
      aria-disabled={disabled || undefined}
      className={cn(buttonClasses(variant), className)}
      onClick={handleClick}
      {...props}
    />
  );
}
