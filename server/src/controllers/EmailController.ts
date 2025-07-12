import type { Request, Response } from "express"
import MailService from "../services/MailService.js"

import { errorHandler } from "../utils/error/errorHandler.js"
import User from "../models/User.js"
import Investor from "../models/Investor.js"

export default class EmailController {
  static async sendEmailToInvestor(req: Request, res: Response) {
    try {
      const investorId = req.params.investorId
      const { subject, message, } = req.body.data
      console.log(req.body)

    
    const investor = await Investor.findByPk(investorId)


      if (!investor) {
        return res.status(404).json({ error: "Investor not found" })
      }

     const user = await User.findOne({where:{
      id:investor.userId
     }})

      if (!user) {
        return res.status(404).json({ error: "user not found" })
      }
      // Send email using MailService
      await MailService.sendCustomEmail(user.email, subject, message)

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
      const {  subject, message } = req.body
      const users = await User.findAll({where:{role:'INVESTOR'}})
      for (const  user of users){
            await MailService.sendCustomEmail(user.email, subject, message)   
      }
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
