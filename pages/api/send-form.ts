import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { parent, child } = req.body;

  if (!parent || !child) {
    return res.status(400).json({ message: 'Missing form data' });
  }

  // Configure your SMTP transport (use environment variables for security)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
  <div style="font-family: Arial, sans-serif; background: #f4f8fb; padding: 32px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #e5e7eb; border-top: 4px solid #0072ce; padding: 32px;">
      <h2 style="color: #003a70; font-size: 24px; margin-bottom: 16px;">New Program Info Request</h2>
      <h3 style="color: #0072ce; font-size: 18px; margin-top: 24px; margin-bottom: 8px;">Parent Information</h3>
      <table style="width: 100%; margin-bottom: 16px; color: #222b45;">
        <tr><td style="font-weight: bold;">First Name:</td><td>${
          parent.first
        }</td></tr>
        <tr><td style="font-weight: bold;">Last Name:</td><td>${
          parent.last
        }</td></tr>
        <tr><td style="font-weight: bold;">Email:</td><td>${
          parent.email
        }</td></tr>
        <tr><td style="font-weight: bold;">State:</td><td>${
          parent.state
        }</td></tr>
      </table>
      <h3 style="color: #0072ce; font-size: 18px; margin-top: 24px; margin-bottom: 8px;">Child Information</h3>
      <table style="width: 100%; margin-bottom: 16px; color: #222b45;">
        <tr><td style="font-weight: bold;">First Name:</td><td>${
          child.first
        }</td></tr>
        <tr><td style="font-weight: bold;">Last Name:</td><td>${
          child.last
        }</td></tr>
        <tr><td style="font-weight: bold;">Grade:</td><td>${
          child.grade
        }</td></tr>
        <tr><td style="font-weight: bold;">Academic Interests:</td><td>${
          child.interests?.join(', ') || '-'
        }</td></tr>
        <tr><td style="font-weight: bold;">Program Preferences:</td><td>${
          child.programs?.join(', ') || '-'
        }</td></tr>
      </table>
      <p style="color: #888; font-size: 13px; margin-top: 32px;">This message was sent from the Future of Youth website.</p>
    </div>
  </div>
`;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.FORM_TO_EMAIL,
    subject: 'New Program Info Request',
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Failed to send email', error });
  }
}
