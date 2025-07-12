import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import type User from "../models/User.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const EMAIL_USER = 'wealthfundingtradestationopportunities';
const COMPANY_NAME = 'Wealth Funding Trade Station Opportunities';
const LOGO_PATH = path.join(__dirname, './ts-Logo.png'); // Update this path
const PRIMARY_COLOR = '#10B981';

class MailService {
  private static transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "wealthfundingtradestation@gmail.com",
      pass: "anft vmyj ianz sftx",
    },
  });

  private static getEmailTemplate(content: string) {
    return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { text-align: center; padding: 20px 0; }
    .content { background: white; padding: 20px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:companyLogo" alt="${COMPANY_NAME}" style="max-width: 150px;">
    </div>
    <div class="content">
      ${content}
    </div>
  </div>
</body>
</html>`;
  }

  private static getLogoAttachment() {
    return {
      filename: 'logo.png',
      path: LOGO_PATH,
      cid: 'companyLogo',
      contentDisposition: 'inline' as const, // Fix: Use literal type
    };
  }

  public static async sendEmailVerificationMail(user: User, name: string) {
    const mailOptions = {
      from: `"${COMPANY_NAME}" <${EMAIL_USER}>`,
      to: user.email,
      subject: "Email Verification",
      html: this.getEmailTemplate(`
        <h1 style="color: ${PRIMARY_COLOR};">Hello ${name}</h1>
        <p>Your verification code is:</p>
        <p style="font-size: 24px; font-weight: bold;">${user.emailVerificationCode}</p>
      `),
      attachments: [this.getLogoAttachment()]
    };

    await this.transporter.sendMail(mailOptions);
  }

  public static async resendEmailVerificationMail(user: User) {
    const mailOptions = {
      from: `"${COMPANY_NAME}" <${EMAIL_USER}>`,
      to: user.email,
      subject: "New Verification Code",
      html: this.getEmailTemplate(`
        <h1 style="color: ${PRIMARY_COLOR};">New Verification Code</h1>
        <p>Your new verification code is:</p>
        <p style="font-size: 24px; font-weight: bold;">${user.emailVerificationCode}</p>
      `),
      attachments: [this.getLogoAttachment()]
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async sendForgotPasswordMail(user: User, token: string) {
    const resetUrl = `https://wealthfundingtradestationopportunities.vercel.app/reset-password/${token}`;
    
    const mailOptions = {
      from: `"${COMPANY_NAME}" <${EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: this.getEmailTemplate(`
        <h1 style="color: ${PRIMARY_COLOR};">Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="
          background: ${PRIMARY_COLOR};
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        ">Reset Password</a>
      `),
      attachments: [this.getLogoAttachment()]
    };

    await this.transporter.sendMail(mailOptions);
  }

  public static async sendCustomEmail(to: string, subject: string, message: string) {
    const mailOptions = {
      from: `"${COMPANY_NAME}" <${EMAIL_USER}>`,
      to,
      subject,
      html: this.getEmailTemplate(message.replace(/\n/g, "<br>")),
      attachments: [this.getLogoAttachment()]
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default MailService;