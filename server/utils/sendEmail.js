import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const templates = {
  verification: (data) => ({
    subject: 'Verify your Virtual Tourist account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .card { background: #1e293b; border-radius: 16px; padding: 40px; }
          h1 { color: #f8fafc; font-size: 24px; margin-bottom: 16px; }
          p { color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h2 style="color: #3b82f6;">🌍 Virtual Tourist</h2>
          </div>
          <div class="card">
            <h1>Welcome, ${data.name}!</h1>
            <p>Thanks for signing up for Virtual Tourist. Please verify your email address to start exploring amazing virtual destinations.</p>
            <p style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify Email</a>
            </p>
            <p style="font-size: 14px; color: #64748b;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Virtual Tourist. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'reset-password': (data) => ({
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: #1e293b; border-radius: 16px; padding: 40px; }
          h1 { color: #f8fafc; font-size: 24px; margin-bottom: 16px; }
          p { color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>Reset Your Password</h1>
            <p>Hi ${data.name}, we received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </p>
            <p style="font-size: 14px; color: #64748b;">This link will expire in 30 minutes. If you didn't request a password reset, you can ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'booking-confirmation': (data) => ({
    subject: `Booking Confirmed - ${data.tourTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .card { background: #1e293b; border-radius: 16px; padding: 40px; }
          h1 { color: #f8fafc; font-size: 24px; margin-bottom: 16px; }
          p { color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
          .confirmation-code { background: #0f172a; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
          .code { font-size: 28px; font-weight: bold; color: #3b82f6; letter-spacing: 4px; }
          .details { background: #0f172a; padding: 20px; border-radius: 12px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #334155; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #64748b; }
          .value { color: #f8fafc; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Hi ${data.name}, your booking has been confirmed. Here are your booking details:</p>
            
            <div class="confirmation-code">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Confirmation Code</p>
              <p class="code">${data.confirmationCode}</p>
            </div>

            <div class="details">
              <div class="detail-row">
                <span class="label">Tour</span>
                <span class="value">${data.tourTitle}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date</span>
                <span class="value">${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">Participants</span>
                <span class="value">${data.participants}</span>
              </div>
              <div class="detail-row">
                <span class="label">Total</span>
                <span class="value">$${data.totalPrice}</span>
              </div>
            </div>

            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.CLIENT_URL}/bookings" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">View Booking</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

const sendEmail = async ({ to, subject, template, data }) => {
  const emailContent = templates[template](data);

  const mailOptions = {
    from: `"Virtual Tourist" <${process.env.SMTP_USER}>`,
    to,
    subject: emailContent.subject || subject,
    html: emailContent.html
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
