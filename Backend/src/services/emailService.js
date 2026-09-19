import { config } from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * Generates an accessible, clean HTML template for password resets
 */
function renderPasswordResetTemplate({ resetUrl, appName = "LinkHub" }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Reset your password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px; margin: 0; }
        .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 20px; font-weight: bold; color: #6366f1; margin-bottom: 24px; }
        .btn { display: inline-block; background-color: #6366f1; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .footer { font-size: 13px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">${appName}</div>
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your ${appName} password. Click the button below to choose a new password.</p>
        <p><a href="${resetUrl}" class="btn" target="_blank">Reset Password</a></p>
        <p>This password reset link is valid for 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        <div class="footer">
          <p>If you're having trouble clicking the button, copy and paste this URL into your web browser:</p>
          <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
        </div>
      </div>
    </body>
    </html>
  `.trim();
}

export const emailService = {
  isConfigured() {
    return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
  },

  async sendPasswordResetEmail({ to, resetUrl }) {
    const isConfigured = this.isConfigured();
    const appName = "LinkHub";

    if (!isConfigured || !config.isProd) {
      logger.info(`[Email Service Dev Fallback] Password reset email for ${to}:`, {
        to,
        resetUrl,
      });
      console.log(`\n======================================================`);
      console.log(`🔑 PASSWORD RESET LINK FOR: ${to}`);
      console.log(`👉 ${resetUrl}`);
      console.log(`======================================================\n`);
      return { success: true, mode: "console" };
    }

    try {
      // If nodemailer is available in production, use SMTP transport
      const nodemailer = await import("nodemailer").catch(() => null);
      if (nodemailer) {
        const transporter = nodemailer.createTransport({
          host: config.smtp.host,
          port: config.smtp.port,
          secure: config.smtp.secure,
          auth: {
            user: config.smtp.user,
            pass: config.smtp.pass,
          },
        });

        await transporter.sendMail({
          from: config.smtp.from,
          to,
          subject: `Reset your ${appName} password`,
          html: renderPasswordResetTemplate({ resetUrl, appName }),
        });

        logger.info(`Password reset email dispatched to ${to}`);
        return { success: true, mode: "smtp" };
      }

      logger.warn(`nodemailer not installed; falling back to log output for reset email to ${to}`);
      return { success: true, mode: "fallback" };
    } catch (err) {
      logger.error(`Failed to send password reset email to ${to}:`, err);
      // We do not rethrow so user enumeration is avoided and client receives standard success message
      return { success: false, error: err.message };
    }
  },
};
