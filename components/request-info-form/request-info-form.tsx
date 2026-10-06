'use client';

import { useEffect, useRef, type FormEvent } from 'react';

import {
  FormAlert,
  HoneypotField,
  RequiredFieldsNote,
} from '@/components/forms/form-parts';
import { FormSuccess } from '@/components/forms/form-success';
import { useFocusFirstInvalid } from '@/components/forms/use-focus-first-invalid';

import { ChildStep } from './child-step';
import { ParentStep } from './parent-step';
import { useRequestInfoForm } from './use-request-info-form';

export function RequestInfoForm() {
  const form = useRequestInfoForm();
  const formRef = useRef<HTMLFormElement>(null);
  const stepStatusRef = useRef<HTMLParagraphElement>(null);
  const previousStep = useRef(form.step);

  // When a step changes, the button that triggered it unmounts and focus would
  // fall to <body>. Move it to the step indicator so screen readers announce
  // "Step 2 of 2" and Tab continues into the new fields (WCAG 2.4.3).
  useEffect(() => {
    if (previousStep.current === form.step) return;
    previousStep.current = form.step;
    stepStatusRef.current?.focus();
  }, [form.step]);

  useFocusFirstInvalid(formRef, form.failedAttempts);

  if (form.isSubmitted) {
    return (
      <FormSuccess>
        Your request has been sent successfully. We appreciate your interest and
        will get back to you soon.
      </FormSuccess>
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.step === 'parent') {
      form.goToChildStep();
    } else {
      form.submit();
    }
  }

  return (
    <form
      ref={formRef}
      className='flex w-full flex-col gap-4'
      onSubmit={handleSubmit}
      noValidate
      aria-label='Request free program info'
      aria-busy={form.isPending || undefined}
    >
      <div className='text-sm text-gray-600'>
        <p ref={stepStatusRef} tabIndex={-1} className='focus:outline-hidden'>
          Step {form.step === 'parent' ? 1 : 2} of 2
        </p>
        <RequiredFieldsNote />
      </div>

      <HoneypotField value={form.honeypot} onChange={form.setHoneypot} />

      {form.step === 'parent' ? (
        <ParentStep
          values={form.parent}
          errors={form.parentErrors}
          onChange={form.updateParent}
          onNext={form.goToChildStep}
        />
      ) : (
        <ChildStep
          values={form.child}
          errors={form.childErrors}
          isPending={form.isPending}
          onChange={form.updateChild}
          onBack={form.goToParentStep}
        />
      )}

      <FormAlert message={form.formError} />
    </form>
  );
}
