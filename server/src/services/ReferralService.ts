import Referral from '../models/Referral';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';


interface ReferralCreateInput {

  referrerId: number;
  referredId: number;

}

export class ReferralService {
  static async createReferral(data: ReferralCreateInput) {
    logger.info('ReferralService.createReferral called', { data });
    try {
      const referral = await Referral.create({...data,settled:false});
      logger.info('Referral created successfully', { referralId: referral.id });
      return referral;
    } catch (error) {
      logger.error('Error creating referral', { error });
      throw error;
    }
  }

  static async updateReferralSettled(id: number, settled: boolean) {
    logger.info(`ReferralService.updateReferralSettled called for id=${id}`, { settled });
    const referral = await Referral.findByPk(id);
    if (!referral) {
      logger.warn(`Referral not found with id=${id}`);
      throw new CustomError(404, `Referral with id ${id} not found`);
    }

    referral.settled = settled;
    await referral.save();
    logger.info(`Referral settled status updated for id=${id}`, { settled });
    return referral;
  }
  
  static async getReferralById(id: number) {
    logger.info(`ReferralService.getReferralById called for id=${id}`);
    const referral = await Referral.findByPk(id, {
      include: ['referrer', 'referred'],
    });
    if (!referral) {
      logger.warn(`Referral not found with id=${id}`);
      throw new CustomError(404, `Referral with id ${id} not found`);
    }
    logger.info(`Referral retrieved successfully for id=${id}`);
    return referral;
  }

  static async getAllReferrals() {
    logger.info('ReferralService.getAllReferrals called');
    const referrals = await Referral.findAll({
      include: ['referrer', 'referred'],
    });
    logger.info(`Retrieved ${referrals.length} referrals`);
    return referrals;
  }
}
