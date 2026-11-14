import { useRef, useState, useTransition } from 'react';

import { submitRequestInfo } from '@/app/actions/submit-request-info';
import { trackEvent } from '@/lib/analytics';
import {
  childSchema,
  getFieldErrors,
  parentSchema,
  type AcademicInterest,
  type FieldErrors,
  type ParentInput,
  type ProgramPreference,
} from '@/lib/request-info';

export type ParentFormState = ParentInput;

export type ChildFormState = {
  first: string;
  last: string;
  // Empty until the user picks one; the schema rejects ''.
  grade: string;
  interests: AcademicInterest[];
  programs: ProgramPreference[];
};

export type FormStep = 'parent' | 'child';

const EMPTY_PARENT: ParentFormState = {
  first: '',
  last: '',
  email: '',
  state: '',
};

const EMPTY_CHILD: ChildFormState = {
  first: '',
  last: '',
  grade: '',
  interests: [],
  programs: [],
};

export function useRequestInfoForm() {
  const [step, setStep] = useState<FormStep>('parent');
  const [parent, setParent] = useState(EMPTY_PARENT);
  const [child, setChild] = useState(EMPTY_CHILD);
  const [honeypot, setHoneypot] = useState('');
  const [parentErrors, setParentErrors] = useState<
    FieldErrors<ParentFormState>
  >({});
  const [childErrors, setChildErrors] = useState<FieldErrors<ChildFormState>>(
    {}
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Bumped on every failed validation so the form can move focus to the first
  // invalid field, even when the same errors repeat (WCAG 3.3.1 / 2.4.3).
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);

  function updateParent<K extends keyof ParentFormState>(
    field: K,
    value: ParentFormState[K]
  ) {
    setParent((prev) => ({ ...prev, [field]: value }));
    setParentErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function updateChild<K extends keyof ChildFormState>(
    field: K,
    value: ChildFormState[K]
  ) {
    setChild((prev) => ({ ...prev, [field]: value }));
    setChildErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function goToChildStep() {
    const errors = getFieldErrors(parentSchema, parent);
    setParentErrors(errors ?? {});
    if (errors) {
      setFailedAttempts((n) => n + 1);
      return;
    }

    setFormError(null);
    setStep('child');
  }

  function goToParentStep() {
    setFormError(null);
    setStep('parent');
  }

  function submit() {
    // isPending only updates on the next render, so two clicks in the same
    // instant both got through (two emails, two Ads conversions). The ref is
    // set synchronously on the first click.
    if (isPending || submittingRef.current) return;

    const errors = getFieldErrors(childSchema, child);
    setChildErrors(errors ?? {});
    if (errors) {
      setFailedAttempts((n) => n + 1);
      return;
    }

    setFormError(null);
    submittingRef.current = true;
    startTransition(async () => {
      try {
        const result = await submitRequestInfo({
          parent,
          child,
          website: honeypot,
        });
        if (result.ok) {
          // Stays locked: the form is replaced by the thank-you message.
          setIsSubmitted(true);
          trackEvent('generate_lead', { form: 'request_info' });
          return;
        }
        setFormError(result.message);
      } catch {
        setFormError(
          'Something went wrong. Please check your connection and try again.'
        );
      }
      // Failed: unlock so the visitor can try again.
      submittingRef.current = false;
    });
  }

  return {
    step,
    parent,
    child,
    honeypot,
    parentErrors,
    childErrors,
    formError,
    isSubmitted,
    isPending,
    failedAttempts,
    updateParent,
    updateChild,
    setHoneypot,
    goToChildStep,
    goToParentStep,
    submit,
  };
}
