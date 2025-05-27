import { errorHandler } from '../utils/error/errorHandler';
import { ManagerService } from '../services/ManagerService';
import { CustomError } from '../utils/error/CustomError';
class ManagerController {
    static async createManager(req, res) {
        try {
            const file = req.file;
            if (!file) {
                throw new CustomError(403, 'no file in request body');
            }
            const imagePath = `/uploads/${file.filename}`;
            const data = {
                ...req.body,
                image: imagePath,
            };
            const newManager = await ManagerService.createManager(data);
            res.status(201).json(newManager);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async getAllManagers(req, res) {
        try {
            const managers = await ManagerService.getAllManagers();
            return res.status(200).json(managers);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async getManagerById(req, res) {
        try {
            const { id } = req.params;
            const manager = await ManagerService.getManagerById(Number(id));
            if (!manager) {
                throw new CustomError(404, 'manager not found');
            }
            return res.status(200).json(manager);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async updateManager(req, res) {
        try {
            const { id } = req.params;
            const imagePath = req.file ? req.file.path : undefined;
            const data = {
                ...req.body,
                ...(imagePath && { image: imagePath }),
            };
            const updatedManager = await ManagerService.updateManager(Number(id), data);
            if (!updatedManager) {
                throw new CustomError(404, 'manager not found');
            }
            return res.status(200).json(updatedManager);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async deleteManager(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ManagerService.deleteManager(Number(id));
            if (!deleted) {
                throw new CustomError(404, 'manager not found');
            }
            res.status(204).send();
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
}
export default ManagerController;
