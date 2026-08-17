import nodemailer from "nodemailer";

const getTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
};

export const sendVerificationEmail = async (email, token, name) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email/${token}`;
  console.log(`[EMAIL SERVICE] Verification Token for ${email}: ${token}`);
  console.log(`[EMAIL SERVICE] Link: ${verifyUrl}`);

  const transporter = getTransporter();
  if (!transporter) {
    console.log("[EMAIL SERVICE] No SMTP credentials configured. Email logged to console.");
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"KIT Club Portal" <no-reply@kitkop.edu.in>',
      to: email,
      subject: "Verify Your KIT Club Portal Account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #1e40af;">Welcome to KIT Club Portal, ${name}!</h2>
          <p>Please verify your email address to activate your student account.</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; margin: 15px 0;">Verify Email Address</a>
          <p style="font-size: 12px; color: #64748b;">Or copy this link into your browser: <br>${verifyUrl}</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("[EMAIL SERVICE ERROR]", err.message);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;
  console.log(`[EMAIL SERVICE] Reset Token for ${email}: ${token}`);
  console.log(`[EMAIL SERVICE] Link: ${resetUrl}`);

  const transporter = getTransporter();
  if (!transporter) {
    console.log("[EMAIL SERVICE] No SMTP credentials configured. Reset link logged to console.");
    return true;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"KIT Club Portal" <no-reply@kitkop.edu.in>',
      to: email,
      subject: "Password Reset Request — KIT Club Portal",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #1e40af;">Password Reset Request</h2>
          <p>Hello ${name}, you requested to reset your password for KIT Club Portal.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 6px; margin: 15px 0;">Reset Password</a>
          <p style="font-size: 12px; color: #64748b;">Or copy this link: <br>${resetUrl}</p>
          <p style="font-size: 12px; color: #94a3b8;">This link will expire in 1 hour.</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error("[EMAIL SERVICE ERROR]", err.message);
    return false;
  }
};
