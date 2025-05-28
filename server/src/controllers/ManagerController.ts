import { Request, Response } from 'express';

import { errorHandler } from '../utils/error/errorHandler.js';
import { ManagerService } from '../services/ManagerService.js';
import { CustomError } from '../utils/error/CustomError.js';

class ManagerController {
  static async createManager(req: Request, res: Response) {
    try {
         const file = req.file
             if(!file){
        throw  new CustomError(403,'no file in request body')
    }
         const imagePath = `/uploads/${file.filename}`;

      const data = {
        ...req.body,
        image: imagePath,
      };
      const newManager = await ManagerService.createManager(data);
      res.status(201).json(newManager);
    } catch (error: any) {
      errorHandler(error,req,res)
    }
  }

  static async getAllManagers(req: Request, res: Response) {

    try {
      const managers = await ManagerService.getAllManagers();
      return res.status(200).json(managers);

    } catch (error: any) {
      errorHandler(error,req,res)
    }
  }

  static async getManagerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const manager = await ManagerService.getManagerById(Number(id));

      if (!manager) {
         throw new CustomError(404,'manager not found')
      }

      return res.status(200).json(manager);
    } catch (error: any) {
      errorHandler(error,req,res)
    }
  }

  static async updateManager(req: Request, res: Response) {
    try {
  
        const { id } = req.params;
      const imagePath = req.file ? req.file.path : undefined;
 
      const data = {
        ...req.body,
        ...(imagePath && { image: imagePath }),
      };
      const updatedManager = await ManagerService.updateManager(Number(id), data);

      if (!updatedManager) {
         throw new CustomError(404,'manager not found')
      }

      return res.status(200).json(updatedManager);
    } catch (error: any) {
      errorHandler(error,req,res)
    }
  }

  static async deleteManager(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ManagerService.deleteManager(Number(id));

      if (!deleted) {
          throw new CustomError(404,'manager not found')
      }

      res.status(204).send();
    } catch (error: any) {
      errorHandler(error,req,res)
    }
  }
}

export default ManagerController;
