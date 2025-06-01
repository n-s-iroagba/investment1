import { Request, Response } from 'express';

import path from 'path';
import { SocialMediaService } from '../services/SocialMediaService.js';
import { CustomError } from '../utils/error/CustomError.js';
import { errorHandler } from '../utils/error/errorHandler.js';

class SocialMediaController {
  static async create(req: Request, res: Response) {
    try {
      const { name, link } = req.body;

        const file = req.file
             if(!file){
        throw  new CustomError(403,'no file in request body')
    }
         const logo = `/uploads/${file.filename}`;
    
     

      const newSocialMedia = await SocialMediaService.createSocialMedia({ name, link, logo });
      res.status(201).json(newSocialMedia);
    } catch (error: any) {
      errorHandler(error,req, res)
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const allSocialMedia = await SocialMediaService.getAllSocialMedias();
      res.status(200).json(allSocialMedia);
    } catch (error: any) {
      errorHandler(error,req, res)
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await SocialMediaService.getSocialMediaById(Number(id));
      if (!item) {
        return res.status(404).json({ message: 'Social media not found' });
      }
      res.status(200).json(item);
    } catch (error: any) {
      errorHandler(error,req, res)
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, link } = req.body;

      const updateData: any = { name, link };

       const imagePath = req.file ? req.file.path : undefined;
       const data = {
        ...req.body,
        ...(imagePath && { image: imagePath }),
      };

      const updated = await SocialMediaService.updateSocialMedia(Number(id), data);
      if (!updated) {
        return res.status(404).json({ message: 'Social media not found' });
      }
      res.status(200).json(updated);
    } catch (error: any) {
      errorHandler(error,req, res)
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await SocialMediaService.deleteSocialMedia(Number(id));
      if (!deleted) {
        return res.status(404).json({ message: 'Social media not found' });
      }
      res.status(204).send();
    } catch (error: any) {
      errorHandler(error,req, res)
    }
  }
}

export default SocialMediaController;
