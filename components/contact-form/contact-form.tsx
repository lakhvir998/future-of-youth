'use client';

import { useRef, useState, useTransition, type FormEvent } from 'react';

import { submitContact } from '@/app/actions/submit-contact';
import { ConsentNotice } from '@/components/forms/consent-notice';
import {
  FormAlert,
  HoneypotField,
  RequiredFieldsNote,
} from '@/components/forms/form-parts';
import { FormSuccess } from '@/components/forms/form-success';
import { useFocusFirstInvalid } from '@/components/forms/use-focus-first-invalid';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextArea } from '@/components/ui/text-area';
import { TextField } from '@/components/ui/text-field';
import { trackEvent } from '@/lib/analytics';
import {
  CONTACT_TOPICS,
  contactSchema,
  getFieldErrors,
  type ContactTopic,
  type FieldErrors,
} from '@/lib/contact';
import { MESSAGE_MAX_LENGTH } from '@/lib/validation';

type ContactFormState = {
  name: string;
  email: string;
  topic: ContactTopic | '';
  message: string;
};

export function ContactForm({ defaultTopic }: { defaultTopic?: ContactTopic }) {
  const [values, setValues] = useState<ContactFormState>({
    name: '',
    email: '',
    topic: defaultTopic ?? '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<FieldErrors<ContactFormState>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useFocusFirstInvalid(formRef, failedAttempts);

  if (isSubmitted) {
    return (
      <FormSuccess>
        Your message has been sent. Thank you for reaching out. We will get back
        to you soon.
      </FormSuccess>
    );
  }

  function update<K extends keyof ContactFormState>(
    field: K,
    value: ContactFormState[K]
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;

    const fieldErrors = getFieldErrors(contactSchema, values);
    setErrors(fieldErrors ?? {});
    if (fieldErrors) {
      setFailedAttempts((n) => n + 1);
      return;
    }

    setFormError(null);
    startTransition(async () => {
      try {
        const result = await submitContact({ ...values, website: honeypot });
        if (result.ok) {
          setIsSubmitted(true);
          trackEvent('generate_lead', { form: 'contact' });
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

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label='Contact us'
      aria-busy={isPending || undefined}
      className='flex flex-col gap-4'
    >
      <div className='text-sm text-gray-600'>
        <RequiredFieldsNote />
      </div>

      <HoneypotField value={honeypot} onChange={setHoneypot} />

      <TextField
        label='Your Name'
        name='name'
        autoComplete='name'
        required
        value={values.name}
        error={errors.name}
        onChange={(e) => update('name', e.target.value)}
      />
      <TextField
        label='Email'
        name='email'
        type='email'
        autoComplete='email'
        required
        value={values.email}
        error={errors.email}
        onChange={(e) => update('email', e.target.value)}
      />
      <SelectField
        label='Topic'
        name='topic'
        placeholder='Select a topic'
        options={CONTACT_TOPICS}
        required
        value={values.topic}
        error={errors.topic}
        onChange={(e) => update('topic', e.target.value as ContactTopic)}
      />
      <TextArea
        label='Message'
        name='message'
        required
        maxLength={MESSAGE_MAX_LENGTH}
        hint={`Up to ${MESSAGE_MAX_LENGTH} characters.`}
        value={values.message}
        error={errors.message}
        onChange={(e) => update('message', e.target.value)}
      />

      <Button
        type='submit'
        className='mt-2 self-start'
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? 'Sending...' : 'Send message'}
      </Button>

      <ConsentNotice />
      <FormAlert message={formError} />
    </form>
  );
}
