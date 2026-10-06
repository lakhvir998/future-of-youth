import { useState, useTransition } from 'react';

import { submitRequestInfo } from '@/app/actions/submit-request-info';
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
    if (isPending) return;

    const errors = getFieldErrors(childSchema, child);
    setChildErrors(errors ?? {});
    if (errors) {
      setFailedAttempts((n) => n + 1);
      return;
    }

    setFormError(null);
    startTransition(async () => {
      try {
        const result = await submitRequestInfo({
          parent,
          child,
          website: honeypot,
        });
        if (result.ok) {
          setIsSubmitted(true);
        } else {
          setFormError(result.message);
        }
      } catch {
        setFormError(
          'Something went wrong. Please check your connection and try again.'
        );
      }
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
