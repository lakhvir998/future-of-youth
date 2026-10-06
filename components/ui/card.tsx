import type { ComponentProps } from 'react';

import { cn } from '@/lib/cn';

type CardAccent = 'brand' | 'accent';

const ACCENT_CLASSES: Record<CardAccent, string> = {
  brand: 'border-t-brand',
  accent: 'border-t-accent',
};

type CardProps = ComponentProps<'div'> & { accent?: CardAccent };

export function Card({ accent = 'brand', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-6 rounded-2xl border-t-4 bg-white p-4 shadow-xl sm:p-8 md:p-10',
        ACCENT_CLASSES[accent],
        className
      )}
      {...props}
    />
  );
}
