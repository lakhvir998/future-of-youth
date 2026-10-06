import { useEffect, type RefObject } from 'react';

/**
 * After a failed validation, moves focus to the first invalid field so its
 * label and error are read out (WCAG 3.3.1, 2.4.3). `failedAttempts` must be
 * bumped on every failure so repeated identical errors still move focus.
 */
export function useFocusFirstInvalid(
  formRef: RefObject<HTMLFormElement | null>,
  failedAttempts: number
) {
  useEffect(() => {
    if (!failedAttempts) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [formRef, failedAttempts]);
}
