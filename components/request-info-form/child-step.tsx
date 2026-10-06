import { Button } from '@/components/ui/button';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import {
  ACADEMIC_INTERESTS,
  GRADES,
  PROGRAM_PREFERENCES,
  type FieldErrors,
} from '@/lib/request-info';

import { ConsentNotice } from './consent-notice';
import type { ChildFormState } from './use-request-info-form';

type ChildStepProps = {
  values: ChildFormState;
  errors: FieldErrors<ChildFormState>;
  isPending: boolean;
  onChange: <K extends keyof ChildFormState>(
    field: K,
    value: ChildFormState[K]
  ) => void;
  onBack: () => void;
};

export function ChildStep({
  values,
  errors,
  isPending,
  onChange,
  onBack,
}: ChildStepProps) {
  return (
    <>
      <div className='flex w-full flex-col gap-4 md:flex-row'>
        <TextField
          label="Child's First Name"
          name='childFirst'
          autoComplete='off'
          required
          value={values.first}
          error={errors.first}
          onChange={(e) => onChange('first', e.target.value)}
        />
        <TextField
          label="Child's Last Name"
          name='childLast'
          autoComplete='off'
          required
          value={values.last}
          error={errors.last}
          onChange={(e) => onChange('last', e.target.value)}
        />
      </div>
      <SelectField
        label="Child's Grade"
        name='childGrade'
        placeholder='Select Grade'
        options={GRADES}
        required
        value={values.grade}
        error={errors.grade}
        onChange={(e) => onChange('grade', e.target.value)}
      />
      <CheckboxGroup
        legend="Child's Academic Interest(s)"
        options={ACADEMIC_INTERESTS}
        value={values.interests}
        error={errors.interests}
        required
        onChange={(value) => onChange('interests', value)}
      />
      <CheckboxGroup
        legend='Program Preference(s)'
        options={PROGRAM_PREFERENCES}
        value={values.programs}
        error={errors.programs}
        required
        onChange={(value) => onChange('programs', value)}
      />
      <div className='mt-2 flex flex-wrap gap-4'>
        <Button variant='secondary' onClick={onBack} disabled={isPending}>
          <span aria-hidden='true'>←</span> Back
        </Button>
        <Button type='submit' disabled={isPending} aria-busy={isPending}>
          {isPending ? 'Sending...' : 'Submit'}
        </Button>
      </div>
      <ConsentNotice />
    </>
  );
}
