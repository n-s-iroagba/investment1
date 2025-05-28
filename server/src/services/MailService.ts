import nodemailer from "nodemailer"
import path from "path";
import { fileURLToPath } from "url";
import hbs from "nodemailer-express-handlebars"
import dotenv from "dotenv"
import type User from "../models/User.js"
import fs from "fs"

dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { EMAIL_USER, EMAIL_PASS, NODE_ENV } = process.env
// async function getHandlebars() {
//   const nodemailerExpressHandlebars = await import('nodemailer-express-handlebars');
//   return nodemailerExpressHandlebars.default;
// }
// const hbs = await getHandlebars()
class MailService {
  private static transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "hauteequity@gmail.com",
      pass: "cprf immt omzt espd",
    },
    logger: true, // Enable logger
    debug: true, // Enable debug output
  })

  private static setupHandlebars() {
    const templateDir = path.join(__dirname, "..", "templates");
  const templatePath = path.join(templateDir, "emailVerification.hbs");
  const source = fs.readFileSync(templatePath, "utf8");

    this.transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          partialsDir: templateDir,
          defaultLayout: false, // 👈 Important!
        },
        viewPath: templateDir,
        extName: ".hbs",
      }) as any,
    )
  }

  public static async sendEmailVerificationMail(user: User, name: string) {
    this.setupHandlebars()

    const mailOptions = {
      from: EMAIL_USER,
      to: user.email,
      subject: "Email Verification",
      template: "emailVerification", // Template file (without .hbs extension)
      context: {
        name: name,
        code: user.emailVerificationCode,
      },
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log("Verification email sent to:", user.email)
    } catch (error) {
      console.error("Error sending email:", error)
    }
  }
  public static async resendEmailVerificationMail(user: User) {
    this.setupHandlebars()

    const mailOptions = {
      from: EMAIL_USER,
      to: user.email,
      subject: "New Email Verification code",
      template: "resendEmailVerification", // Template file (without .hbs extension)
      context: {
        code: user.emailVerificationCode,
      },
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log("Verification email sent to:", user.email)
    } catch (error) {
      console.error("Error sending email:", error)
    }
  }

  static async sendForgotPasswordMail(user: User, token: string) {
    const resetUrl = `${process.env.CLIENT_URL ?? "http://localhost:3000/auth"}/reset-password/${token}`

    const mailOptions = {
      from: `"Support Team" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hi ${"Esteemed user"},</p>
        <p>You recently requested to reset your password. Click the link below to do so:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 30 minutes. If you didn’t request this, please ignore this email.</p>
        <p>Thanks,<br/>YourApp Team</p>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Password reset email sent to ${user.email}`)
    } catch (error) {
      console.error(`Failed to send password reset email to ${user.email}`, error)
      throw new Error("Failed to send password reset email")
    }
  }
  public static async sendCustomEmail(to: string, subject: string, message: string, senderName = "Admin Team") {
    const mailOptions = {
      from: `"${senderName}" <${EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Message from ${senderName}</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>This email was sent from the admin panel.</p>
        </div>
      </div>
    `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Custom email sent to: ${to}`)
    } catch (error) {
      console.error("Error sending custom email:", error)
      throw new Error("Failed to send email")
    }
  }
}

export default MailService
