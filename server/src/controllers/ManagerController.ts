import { Request, Response } from 'express';

import { errorHandler } from '../utils/error/errorHandler.js';
import { ManagerService } from '../services/ManagerService.js';
import { CustomError } from '../utils/error/CustomError.js';
import Manager from '../models/Manager.js';

class ManagerController {
  static async createManager(req: Request, res: Response) {
    try {
         const file = req.file
             if(!file || !file.buffer){
        throw  new CustomError(403,'no file in request body')
    }
      
          if(!file.buffer){
        throw  new CustomError(403,'no file buffer in file')
    }
      const data = {
        ...req.body,
        image: file.buffer,
      }; 
      const newManager = await ManagerService.createManager(data);
      res.status(201).json(newManager);
    } catch (error: any) {
      errorHandler(error,req,res)
    }
  }
static async getAllManagers(req: Request, res: Response) {
  try {
    const managers = await Manager.findAll();
    
    // Convert Buffer to base64 for each manager
    const managersWithBase64Images = managers.map(manager => {
      const managerData = manager.toJSON() as any; // Type assertion
      
      // Convert Buffer to base64 if image exists
      if (managerData.image && Buffer.isBuffer(managerData.image)) {
        managerData.image = `data:image/png;base64,${managerData.image.toString('base64')}`;
      }
      
      return managerData;
    });

    return res.status(200).json(managersWithBase64Images);
  } catch (error: any) {
    errorHandler(error, req, res);
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
