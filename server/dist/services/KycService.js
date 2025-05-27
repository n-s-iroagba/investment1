import Kyc from '../models/Kyc';
import { CustomError } from '../utils/error/CustomError';
import logger from '../utils/logger/logger';
export class KycService {
    // Create new KYC record (all attributes except id required)
    static async createKyc(data) {
        const { type, image, number, investorId } = data;
        if (!type || !image || !number || !investorId) {
            throw new CustomError(400, 'All fields (type, image, number, investorId) are required');
        }
        try {
            const kyc = await Kyc.create({ type, image, number, investorId });
            logger.info(`Created KYC for investorId ${investorId} with id ${kyc.id}`);
            return kyc;
        }
        catch (error) {
            logger.error(`Failed to create KYC: ${error}`);
            throw error;
        }
    }
    static async verifyKyc(id) {
        try {
            let kyc = await Kyc.findByPk(id);
            if (!kyc) {
                throw new CustomError(404, 'Kyc not found');
            }
            kyc.isVerified = true;
            await kyc.save();
        }
        catch (error) {
            logger.error(`Failed to verify KYC: ${error}`);
            throw error;
        }
    }
    // Update KYC by id (all attributes except id required)
    static async updateKyc(id, data) {
        const { type, image, number, investorId } = data;
        if (!type || !image || !number || !investorId) {
            throw new CustomError(400, 'All fields (type, image, number, investorId) are required');
        }
        const kyc = await Kyc.findByPk(id);
        if (!kyc) {
            throw new CustomError(404, `KYC with id ${id} not found`);
        }
        try {
            kyc.type = type;
            kyc.image = image;
            kyc.number = number;
            kyc.investorId = investorId;
            await kyc.save();
            logger.info(`Updated KYC with id ${id}`);
            return kyc;
        }
        catch (error) {
            logger.error(`Failed to update KYC: ${error}`);
            throw error;
        }
    }
}
