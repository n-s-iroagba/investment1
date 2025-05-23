import { Request, Response } from "express";
import { InvestorService } from "../services/InvestorService";
import { errorHandler } from "../utils/error/errorHandler";


export default class InvestorController {
    static async updateInvestor(req:Request, res:Response){
    try{
        const investorId = req.params.investorId
        await InvestorService.updateInvestor(Number(investorId),req.body)
             res.status(200).end();
    }catch(error){
        errorHandler(error,req,res)
    }
}
   static async deleteInvestor(req:Request, res:Response){
    try{
        const investorId = req.params.investorId
        await InvestorService.deleteInvestor(Number(investorId))
             res.status(204).end();
    }catch(error){
        errorHandler(error,req,res)

    }
}
}