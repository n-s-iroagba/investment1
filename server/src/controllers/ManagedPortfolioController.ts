import { Request, Response } from "express";
import { ManagerService } from "../services/ManagerService";
import { AdminWalletService } from "../services/AdminWalletService";
import { CryptoWalletService } from "../services/CryptoWalletService";
import { InvestorService } from "../services/InvestorService";
import { ManagedPortfolioService } from "../services/ManagedPortfolioService";
import { errorHandler } from "../utils/error/errorHandler";
import {  CustomError } from "../utils/error/CustomError";


type InvestmentCreationDto = {
  amount: number;
  depositMeans: string;
  managerId: string | number;
  wallet: null | {
    adminWalletId: number;
    address: string;
    currency: string;
  };
};

class ManagedPortfolioController {
  static async createInvestment(req: Request, res: Response) {
    try {
      const investorId = Number(req.params.investorId);
      console.log(req.body)
      const { amount, depositMeans, managerId, wallet }: InvestmentCreationDto = req.body;

      // Basic validation
      if (!amount || typeof amount !== "number") {
        throw new CustomError(400, "Missing or invalid 'amount'");
      }

      if (!depositMeans || typeof depositMeans !== "string") {
        throw new CustomError(400, "Missing or invalid 'depositMeans'");
      }

      if (!managerId || (typeof managerId !== "number" && typeof managerId !== "string")) {
        throw new CustomError(400, "Missing or invalid 'managerId'");
      }

      if (depositMeans === "CRYPTO") {
        if (!wallet) {
          throw new CustomError(400, "Missing 'wallet' details for CRYPTO deposit");
        }

        const { adminWalletId, address, currency } = wallet;

        if (!adminWalletId || !address || !currency) {
          throw new CustomError(400, "Incomplete 'wallet' information: 'adminWalletId', 'address', and 'currency' are required");
        }
      }

      const manager = await ManagerService.getManagerById(Number(managerId));
      const portfolio = await ManagedPortfolioService.createPortfolio({
        managerId: manager.id,
        amount,
        investorId,
      });

      if (depositMeans === "CRYPTO" && wallet) {
        const adminWallet = await AdminWalletService.getAdminWalletById(wallet.adminWalletId);
        await CryptoWalletService.createCryptoWallet(wallet.currency, wallet.address, adminWallet.address, portfolio.id);
      }

      return res.status(201).json({ newInvestmentId: portfolio.id });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  static async deleteInvestor(req: Request, res: Response) {
    try {
      const investorId = Number(req.params.id);
      if (isNaN(investorId)) {
        return res.status(400).json({ error: "Invalid investor ID" });
      }

      await InvestorService.deleteInvestor(investorId);
      res.status(204).end();
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}

export default ManagedPortfolioController;
