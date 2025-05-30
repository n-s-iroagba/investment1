import type { Request, Response } from "express"
import { InvestorService } from "../services/InvestorService.js"
import { errorHandler } from "../utils/error/errorHandler.js"

export default class InvestorController {
  static async getInvestorProfile(req: Request, res: Response) {
    try {
      const investorId = req.params.investorId
      const investor = await InvestorService.getInvestorById(Number(investorId))
      res.status(200).json(investor)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }
  static async getAllInvestors(req:Request, res:Response){
    try {
      const investors = await InvestorService.getAllInvestors()
      res.status(200).json(investors)
  }catch(error){
    errorHandler(error, req, res)
  }
  }
  static async getMyProfile(req: Request, res: Response) {
    try {
      // Assuming the investor ID is stored in req.user from authentication middleware
      const investorId = req.params.investorId
      const investor = await InvestorService.getInvestorById(Number(investorId))
      console.log('investor',investor)
      res.status(200).json(investor)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async updateMyProfile(req: Request, res: Response) {
    try {
      const investorId = req.params.investorId
      const updatedInvestor = await InvestorService.updateInvestor(Number(investorId), req.body)
      res.status(200).json(updatedInvestor)
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async updateInvestor(req: Request, res: Response) {
    try {
      const investorId = req.params.investorId
      await InvestorService.updateInvestor(Number(investorId), req.body)
      res.status(200).end()
    } catch (error) {
      errorHandler(error, req, res)
    }
  }

  static async deleteInvestor(req: Request, res: Response) {
    try {
      const investorId = req.params.investorId
      await InvestorService.deleteInvestor(Number(investorId))
      res.status(204).end()
    } catch (error) {
      errorHandler(error, req, res)
    }
  }
}
