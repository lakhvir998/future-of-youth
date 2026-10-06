import { useId } from 'react';

import { FieldError } from './field-error';

type CheckboxGroupProps<T extends string> = {
  legend: string;
  options: readonly T[];
  value: readonly T[];
  onChange: (value: T[]) => void;
  error?: string;
  required?: boolean;
};

export function CheckboxGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  error,
  required,
}: CheckboxGroupProps<T>) {
  const errorId = `${useId()}-error`;

  function toggle(option: T, checked: boolean) {
    onChange(
      checked ? [...value, option] : value.filter((item) => item !== option)
    );
  }

  return (
    <fieldset
      className='text-left'
      aria-describedby={error ? errorId : undefined}
    >
      <legend className='mb-1 font-semibold text-navy'>
        {legend}
        {/* Checkbox groups have no native "required", so say it in the name. */}
        {required && (
          <>
            {' '}
            <span aria-hidden='true'>*</span>{' '}
            <span className='sr-only'>(required)</span>
          </>
        )}
      </legend>
      <div className='flex flex-col gap-2'>
        {options.map((option) => (
          <label
            key={option}
            className='flex min-h-11 cursor-pointer items-center gap-3 text-ink'
          >
            <input
              type='checkbox'
              value={option}
              checked={value.includes(option)}
              aria-invalid={error ? true : undefined}
              onChange={(e) => toggle(option, e.target.checked)}
              // 24px meets WCAG 2.5.8 target size on its own.
              className='size-6 shrink-0 cursor-pointer accent-brand'
            />
            {option}
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
