import Investor from "../models/Investor.js";
import { CustomError } from "../utils/error/CustomError.js";
import logger from "../utils/logger/logger.js";
import Kyc from "../models/Kyc.js";
import ManagedPortfolio from "../models/ManagedPortfolio.js";
import Referral from "../models/Referral.js";
import User from "../models/User.js";
export class InvestorService {
    // Create a new Investor
    static async createInvestor(data) {
        try {
            const { firstName, lastName, dateOfBirth, gender, countryOfResidence, referrerId, userId, } = data;
            if (!firstName ||
                !lastName ||
                !dateOfBirth ||
                !gender ||
                !countryOfResidence ||
                !userId) {
                console.log(data);
                throw new CustomError(400, "Missing required fields");
            }
            const investor = await Investor.create({
                firstName,
                lastName,
                dateOfBirth,
                gender,
                countryOfResidence,
                referrerId: referrerId,
                userId,
            });
            investor.referralCode = investor.id + 2197;
            investor.save();
            logger.info(`Created investor with userId ${userId}`);
            return investor;
        }
        catch (error) {
            logger.error(`Failed to create investor: ${error}`);
            throw error;
        }
    }
    // Read Investor by ID
    static async getInvestorById(id) {
        try {
            const investor = await Investor.findByPk(id);
            if (!investor) {
                throw new CustomError(404, "Investor not found");
            }
            return investor;
        }
        catch (error) {
            logger.error(`Failed to fetch investor by id ${id}: ${error}`);
            throw error;
        }
    }
    static async getAllInvestors() {
        try {
            const investors = await Investor.findAll();
            return investors;
        }
        catch (error) {
            logger.error(`Failed to fetch all investors: ${error}`);
            throw error;
        }
    }
    static async getInvestorByRefferalCode(code) {
        try {
            const investor = await Investor.findOne({
                where: {
                    referralCode: code,
                },
            });
            if (!investor) {
                return;
            }
            return investor;
        }
        catch (error) {
            logger.error(`Failed to fetch investor by referralCode ${code}: ${error}`);
            throw error;
        }
    }
    // Update Investor
    static async updateInvestor(id, updates) {
        try {
            const investor = await Investor.findByPk(id);
            if (!investor) {
                throw new CustomError(404, "Investor not found");
            }
            Object.assign(investor, updates);
            await investor.save();
            logger.info(`Updated investor with id ${id}`);
            return investor;
        }
        catch (error) {
            logger.error(`Failed to update investor: ${error}`);
            throw error;
        }
    }
    /**
     * Delete an investor and all associated records
     * @param investorId - ID of the investor to delete
     */
    static async deleteInvestor(investorId) {
        try {
            const investor = await Investor.findByPk(investorId, {
                include: [
                    { model: ManagedPortfolio },
                    { model: Kyc },
                    { model: Referral },
                    { model: User },
                ],
            });
            if (!investor) {
                throw new CustomError(404, "Investor not found");
            }
            // Delete associated records
            if (investor.managedPortfolio) {
                await investor.managedPortfolio.destroy();
            }
            if (investor.kyc) {
                await investor.kyc.destroy();
            }
            if (investor.referrals) {
                await Referral.destroy({
                    where: { referredId: investor.id, referrerId: investor.id },
                });
            }
            // Delete the investor
            await investor.destroy();
            // Delete associated user
            if (investor.user) {
                await investor.user.destroy();
            }
            logger.info(`deleted investor with id ${investorId}`);
        }
        catch (error) {
            logger.error(`Failed to delete investor: ${error}`);
            throw error;
        }
    }
}
