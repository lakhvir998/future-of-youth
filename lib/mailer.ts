import nodemailer, { type Transporter } from 'nodemailer';

import { buildContactEmail } from '@/lib/email/contact-email';
import { buildRequestInfoEmail } from '@/lib/email/request-info-email';
import { getServerEnv } from '@/lib/env';
import type { Contact } from '@/lib/contact';
import type { RequestInfo } from '@/lib/request-info';

let transporter: Transporter | undefined;

function getTransporter() {
  if (transporter) return transporter;

  const env = getServerEnv();
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    // On STARTTLS ports, fail rather than silently sending credentials in plaintext.
    requireTLS: !env.SMTP_SECURE,
    tls: { minVersion: 'TLSv1.2' },
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

type Email = {
  subject: string;
  html: string;
  text: string;
  /** Must be a schema-validated address; it becomes a header value. */
  replyTo: string;
};

/** Sends a notification email to the staff inbox (FORM_TO_EMAIL). */
export async function sendEmail({ subject, html, text, replyTo }: Email) {
  const env = getServerEnv();

  await getTransporter().sendMail({
    from: env.SMTP_FROM ?? env.SMTP_USER,
    to: env.FORM_TO_EMAIL,
    replyTo,
    subject,
    html,
    text,
  });
}

export async function sendRequestInfoEmail(data: RequestInfo) {
  await sendEmail({
    ...buildRequestInfoEmail(data),
    replyTo: data.parent.email,
  });
}

export async function sendContactEmail(data: Contact) {
  await sendEmail({ ...buildContactEmail(data), replyTo: data.email });
}
