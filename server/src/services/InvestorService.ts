import Investor from '../models/Investor';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';


export class InvestorService {
  // Create a new Investor
  static async createInvestor(data: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    countryOfResidence: string;
   
    referrerId?: number;
    userId: number;

  }) {
    try {
      const {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        countryOfResidence,
 
        referrerId,
        userId,

      } = data;

      if (!firstName || !lastName || !dateOfBirth || !gender || !countryOfResidence || !userId) {
        console.log(data)
        throw new CustomError(400, 'Missing required fields');
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
      investor.referralCode = investor.id+2197
      investor.save()
      logger.info(`Created investor with userId ${userId}`);
      return investor;
    } catch (error) {
      logger.error(`Failed to create investor: ${error}`);
      throw error;
    }
  }

  // Read Investor by ID
  static async getInvestorById(id: number) {
    try {
      const investor = await Investor.findByPk(id);
      if (!investor) {
        throw new CustomError(404, 'Investor not found');
      }
      return investor;
    } catch (error) {
      logger.error(`Failed to fetch investor by id ${id}: ${error}`);
      throw error;
    }
  }

    static async getInvestorByRefferalCode(code: number) {
    try {
      const investor = await Investor.findOne({
        where:{
          referralCode:code
        }
      });
      if (!investor) {
        return
      }
      return investor;
    } catch (error) {
      logger.error(`Failed to fetch investor by referralCode ${code}: ${error}`);
      throw error;
    }
  }

  // Update Investor
  static async updateInvestor(id: number, updates: Partial<{
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    country: string;
    referralCode: number | null;
    referrerId: number | null;
  }>) {
    try {
      const investor = await Investor.findByPk(id);
      if (!investor) {
        throw new CustomError(404, 'Investor not found');
      }

      Object.assign(investor, updates);
      await investor.save();

      logger.info(`Updated investor with id ${id}`);
      return investor;
    } catch (error) {
      logger.error(`Failed to update investor: ${error}`);
      throw error;
    }
  }
}
