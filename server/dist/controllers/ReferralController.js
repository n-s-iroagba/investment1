import { ReferralService } from "../services/ReferralService";
import { errorHandler } from "../utils/error/errorHandler";
import logger from "../utils/logger/logger";
export class ReferralController {
    static async getAllReferrals(req, res) {
        try {
            logger.info("ReferralController.getAllReferrals called");
            const referrals = await ReferralService.getAllReferrals();
            res.json(referrals);
        }
        catch (error) {
            logger.error("Error in getAllReferrals", { error });
            errorHandler(error, req, res);
        }
    }
    static async getReferralById(req, res) {
        try {
            const { id } = req.params;
            logger.info(`ReferralController.getReferralById called for id=${id}`);
            const referral = await ReferralService.getReferralById(Number.parseInt(id));
            res.json(referral);
        }
        catch (error) {
            logger.error("Error in getReferralById", { error });
            errorHandler(error, req, res);
        }
    }
    static async updateReferralSettled(req, res) {
        try {
            const { id } = req.params;
            const { settled } = req.body;
            logger.info(`ReferralController.updateReferralSettled called for id=${id}`, { settled });
            const referral = await ReferralService.updateReferralSettled(Number.parseInt(id), settled);
            res.json(referral);
        }
        catch (error) {
            logger.error("Error in updateReferralSettled", { error });
            errorHandler(error, req, res);
        }
    }
    static async getUnpaidReferrals(req, res) {
        try {
            logger.info("ReferralController.getUnpaidReferrals called");
            const referrals = await ReferralService.getAllReferrals();
            const unpaidReferrals = referrals.filter((referral) => !referral.settled);
            res.json(unpaidReferrals);
        }
        catch (error) {
            logger.error("Error in getUnpaidReferrals", { error });
            errorHandler(error, req, res);
        }
    }
    static async getInvestorReferrals(req, res) {
        try {
            const { investorId } = req.params;
            logger.info(`ReferralController.getInvestorReferrals called for investorId=${investorId}`);
            const referrals = await ReferralService.getReferralsByInvestorId(Number.parseInt(investorId));
            res.json(referrals);
        }
        catch (error) {
            logger.error("Error in getInvestorReferrals", { error });
            errorHandler(error, req, res);
        }
    }
    static async getInvestorSettledReferrals(req, res) {
        try {
            const { investorId } = req.params;
            logger.info(`ReferralController.getInvestorSettledReferrals called for investorId=${investorId}`);
            const referrals = await ReferralService.getReferralsByInvestorId(Number.parseInt(investorId));
            const settledReferrals = referrals.filter((referral) => referral.settled);
            res.json(settledReferrals);
        }
        catch (error) {
            logger.error("Error in getInvestorSettledReferrals", { error });
            errorHandler(error, req, res);
        }
    }
    static async getInvestorUnsettledReferrals(req, res) {
        try {
            const { investorId } = req.params;
            logger.info(`ReferralController.getInvestorUnsettledReferrals called for investorId=${investorId}`);
            const referrals = await ReferralService.getReferralsByInvestorId(Number.parseInt(investorId));
            const unsettledReferrals = referrals.filter((referral) => !referral.settled);
            res.json(unsettledReferrals);
        }
        catch (error) {
            logger.error("Error in getInvestorUnsettledReferrals", { error });
            errorHandler(error, req, res);
        }
    }
}
export default ReferralController;
