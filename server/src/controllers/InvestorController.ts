import { CryptoWalletService } from "../services/CryptoWalletService"
import { ManagedPortfolioService } from "../services/ManagerPortfolioService"
import { ManagerService } from "../services/ManagerService"
import { Request,Response } from "express"
import { AdminWalletService } from "../services/AdminWalletService";
import { errorHandler } from "../utils/error/errorHandler";

class InvestorController {
    static async createInvestment(req:Request, res:Response){
        try{
        const investorId = req.params.investorId
        const manager = await ManagerService.getManagerById(req.body.managerId as number)
        const portfolio = await ManagedPortfolioService.createPortfolio({managerId:manager.id, amount:req.body.amount,investorId: Number(investorId)})
        if (req.body.depositMeans='CRYPTO'){
            const adminWallet = await AdminWalletService.getAdminWalletById(req.body.wallet.adminWalletId)
            CryptoWalletService.createCryptoWallet(req.body.wallet.currency, req.body.wallet.address, adminWallet.address,portfolio.id,)
        }
        return res.status(201).json({newInvestmentId:portfolio.id})
        }catch(error){
            errorHandler(error,req,res)
        }
    }
    }

    export default InvestorController