import SocialMedia from '../models/SocialMedia.js';
import { CustomError } from '../utils/error/CustomError.js';
import logger from '../utils/logger/logger.js';
export class SocialMediaService {
    static async createSocialMedia(data) {
        logger.info('SocialMediaService.createSocialMedia called', { data });
        try {
            const socialMedia = await SocialMedia.create(data);
            logger.info('SocialMedia created successfully', { id: socialMedia.id });
            return socialMedia;
        }
        catch (error) {
            logger.error('Error creating SocialMedia', { error });
            throw error;
        }
    }
    static async getSocialMediaById(id) {
        logger.info(`SocialMediaService.getSocialMediaById called for id=${id}`);
        const socialMedia = await SocialMedia.findByPk(id, { include: ['admin'] });
        if (!socialMedia) {
            logger.warn(`SocialMedia not found with id=${id}`);
            throw new CustomError(404, `SocialMedia with id ${id} not found`);
        }
        logger.info(`SocialMedia retrieved successfully for id=${id}`);
        return socialMedia;
    }
    static async getAllSocialMedias() {
        logger.info('SocialMediaService.getAllSocialMedias called');
        const socialMedias = await SocialMedia.findAll();
        logger.info(`Retrieved ${socialMedias.length} social media records`);
        return socialMedias;
    }
    static async updateSocialMedia(id, updates) {
        logger.info(`SocialMediaService.updateSocialMedia called for id=${id}`, { updates });
        const socialMedia = await SocialMedia.findByPk(id);
        if (!socialMedia) {
            logger.warn(`SocialMedia not found with id=${id}`);
            throw new CustomError(404, `SocialMedia with id ${id} not found`);
        }
        await socialMedia.update(updates);
        logger.info(`SocialMedia updated successfully for id=${id}`);
        return socialMedia;
    }
    static async deleteSocialMedia(id) {
        logger.info(`SocialMediaService.deleteSocialMedia called for id=${id}`);
        const socialMedia = await SocialMedia.findByPk(id);
        if (!socialMedia) {
            logger.warn(`SocialMedia not found with id=${id}`);
            throw new CustomError(404, `SocialMedia with id ${id} not found`);
        }
        await socialMedia.destroy();
        logger.info(`SocialMedia deleted successfully for id=${id}`);
        return true;
    }
}
