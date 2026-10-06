import nodemailer, { type Transporter } from 'nodemailer';

import { buildRequestInfoEmail } from '@/lib/email/request-info-email';
import { getServerEnv } from '@/lib/env';
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

export async function sendRequestInfoEmail(data: RequestInfo) {
  const env = getServerEnv();
  const { subject, html, text } = buildRequestInfoEmail(data);

  await getTransporter().sendMail({
    from: env.SMTP_FROM ?? env.SMTP_USER,
    to: env.FORM_TO_EMAIL,
    // Validated by the schema, so safe to use as a header value.
    replyTo: data.parent.email,
    subject,
    html,
    text,
  });
}
