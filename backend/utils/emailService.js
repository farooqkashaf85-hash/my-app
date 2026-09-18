const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: config.email.smtpPort,
  secure: config.email.smtpSecure,
  auth: {
    user: config.email.smtpUser,
    pass: config.email.smtpPass,
  },
});

const isEmailConfigured = () => {
  const hasUser = Boolean(config.email.smtpUser && config.email.smtpUser !== "your-gmail@gmail.com");
  const hasPass = Boolean(config.email.smtpPass && config.email.smtpPass !== "your-16-character-app-password");
  return hasUser && hasPass;
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailConfigured()) {
    const err = new Error("Email service is not configured. Update SMTP_USER and SMTP_PASS in backend/.env with your real Gmail app password.");
    console.error(err.message);
    throw err;
  }

  const mailOptions = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};

const sendVerificationCodeEmail = async ({ name, email, code }) => {
  const subject = "Verify your account";
  const text = `Hello ${name},\n\nYour verification code is ${code}.\nThis code will expire in 10 minutes.\n\nThanks,\nThe My App Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Verify your account</h2>
      <p>Hello ${name},</p>
      <p>Your verification code is:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">${code}</p>
      <p>This code will expire in 10 minutes.</p>
      <p>Thanks,<br />The My App Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
};

const sendWelcomeEmail = async ({ name, email }) => {
  const subject = "Welcome to My App";
  const text = `Hello ${name},\n\nWelcome to My App! Your account has been created successfully.\n\nThanks,\nThe My App Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Welcome to My App</h2>
      <p>Hello ${name},</p>
      <p>Your account has been created successfully.</p>
      <p>Thanks for joining us.</p>
      <p>Best regards,<br />The My App Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html, text });
};

const sendAdminNotification = async ({ subject, message, recipient = config.email.adminEmail }) => {
  const text = message;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>${subject}</h2>
      <p>${message}</p>
    </div>
  `;

  return sendEmail({ to: recipient, subject, html, text });
};

module.exports = {
  sendEmail,
  sendVerificationCodeEmail,
  sendWelcomeEmail,
  sendAdminNotification,
  isEmailConfigured,
};
