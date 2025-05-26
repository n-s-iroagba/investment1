import type { Request, Response } from "express"
import MailService from "../services/MailService"
import { InvestorService } from "../services/InvestorService"
import { errorHandler } from "../utils/error/errorHandler"
import User from "../models/User"

export default class EmailController {
  static async sendEmailToInvestor(req: Request, res: Response) {
    try {

      const { subject, message, email } = req.body

      // Get investor details
      const investor = await User.findOne({where:{
        email
      }})

      if (!investor) {
        return res.status(404).json({ error: "Investor not found" })
      }

      // Send email using MailService
      await MailService.sendCustomEmail(investor.email, subject, message,  "Admin Team")

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      errorHandler(error, req, res)
    }
  }

  static async sendGeneralEmail(req: Request, res: Response) {
    try {
      const { to, subject, message, senderName } = req.body

      await MailService.sendCustomEmail(to, subject, message, senderName || "Admin Team")

      res.status(200).json({
        success: true,
        message: "Email sent successfully",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      errorHandler(error, req, res)
    }
  }
}
