const dotenv = require("dotenv");

dotenv.config();

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required. Add it to backend/.env`);
  }
  return value;
};

const port = Number(process.env.PORT || 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const jwtSecret = required("JWT_SECRET");
if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

const configuredCorsOrigins = (process.env.CORS_ORIGIN || "https://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

const corsOrigins = [
  ...new Set([
    ...configuredCorsOrigins,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]),
];

const emailConfig = Object.freeze({
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: (process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  from: process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@localhost",
  adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER || "",
});

module.exports = Object.freeze({
  port,
  mongoUri: required("MONGO_URI"),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigins,
  email: emailConfig,
});