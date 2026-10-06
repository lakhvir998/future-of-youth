'use client';

import { useEffect, useRef, type FormEvent } from 'react';

import { ChildStep } from './child-step';
import { FormSuccess } from './form-success';
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

  // After failed validation, send focus to the first invalid field so its
  // label and error message are read out (WCAG 3.3.1).
  useEffect(() => {
    if (!form.failedAttempts) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [form.failedAttempts]);

  if (form.isSubmitted) return <FormSuccess />;

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
        <p>
          Fields marked <span aria-hidden='true'>*</span>{' '}
          <span className='sr-only'>with an asterisk</span> are required.
        </p>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden='true' className='hidden'>
        <label>
          Website
          <input
            type='text'
            name='website'
            tabIndex={-1}
            autoComplete='off'
            value={form.honeypot}
            onChange={(e) => form.setHoneypot(e.target.value)}
          />
        </label>
      </div>

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

      {/* Always rendered so screen readers pick up the message when it appears. */}
      <div role='alert' aria-atomic='true' className='text-sm text-red-700'>
        {form.formError && <p>{form.formError}</p>}
      </div>
    </form>
  );
}
