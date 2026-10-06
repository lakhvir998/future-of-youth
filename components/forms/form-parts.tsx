/** Hidden from people and assistive tech; bots tend to fill it in. */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden='true' className='hidden'>
      <label>
        Website
        <input
          type='text'
          name='website'
          tabIndex={-1}
          autoComplete='off'
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export function RequiredFieldsNote() {
  return (
    <p>
      Fields marked <span aria-hidden='true'>*</span>{' '}
      <span className='sr-only'>with an asterisk</span> are required.
    </p>
  );
}

/** Always rendered so screen readers pick up the message when it appears. */
export function FormAlert({ message }: { message: string | null }) {
  return (
    <div role='alert' aria-atomic='true' className='text-sm text-red-700'>
      {message && <p>{message}</p>}
    </div>
  );
}
