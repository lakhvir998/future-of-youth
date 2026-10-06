import { useId, type ComponentProps } from 'react';

import { FieldError } from './field-error';
import { inputClasses } from './text-field';

type SelectFieldProps = Omit<ComponentProps<'select'>, 'id' | 'children'> & {
  label: string;
  placeholder: string;
  options: readonly string[];
  error?: string;
};

export function SelectField({
  label,
  placeholder,
  options,
  error,
  required,
  ...props
}: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className='text-left'>
      <label htmlFor={id} className='mb-1 block font-semibold text-navy'>
        {label}
        {required && <span aria-hidden='true'> *</span>}
      </label>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClasses}
        {...props}
      >
        <option value=''>{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
