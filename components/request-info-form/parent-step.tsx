import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import type { FieldErrors } from '@/lib/request-info';

import type { ParentFormState } from './use-request-info-form';

type ParentStepProps = {
  values: ParentFormState;
  errors: FieldErrors<ParentFormState>;
  onChange: <K extends keyof ParentFormState>(
    field: K,
    value: ParentFormState[K]
  ) => void;
  onNext: () => void;
};

export function ParentStep({
  values,
  errors,
  onChange,
  onNext,
}: ParentStepProps) {
  return (
    <>
      <div className='flex w-full flex-col gap-4 md:flex-row'>
        <TextField
          label='Parent First Name'
          name='parentFirst'
          autoComplete='given-name'
          required
          value={values.first}
          error={errors.first}
          onChange={(e) => onChange('first', e.target.value)}
        />
        <TextField
          label='Parent Last Name'
          name='parentLast'
          autoComplete='family-name'
          required
          value={values.last}
          error={errors.last}
          onChange={(e) => onChange('last', e.target.value)}
        />
      </div>
      <TextField
        label='Parent Email'
        name='parentEmail'
        type='email'
        autoComplete='email'
        required
        value={values.email}
        error={errors.email}
        onChange={(e) => onChange('email', e.target.value)}
      />
      <TextField
        label='State'
        name='parentState'
        autoComplete='address-level1'
        required
        value={values.state}
        error={errors.state}
        onChange={(e) => onChange('state', e.target.value)}
      />
      <Button className='mt-2' onClick={onNext}>
        Next <span aria-hidden='true'>→</span>
      </Button>
    </>
  );
}
