import { AdminWalletService } from '../services/AdminWalletService';
import { errorHandler } from '../utils/error/errorHandler';
import { CustomError } from '../utils/error/CustomError';
class AdminWalletController {
    static async createAdminWallet(req, res) {
        try {
            const walletData = req.body;
            const newWallet = await AdminWalletService.createAdminWallet(walletData);
            res.status(201).json(newWallet);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async getAllAdminWallets(req, res) {
        try {
            const wallets = await AdminWalletService.getAllAdminWallet();
            res.status(200).json(wallets);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async getAdminWalletById(req, res) {
        try {
            const { id } = req.params;
            const wallet = await AdminWalletService.getAdminWalletById(Number(id));
            if (!wallet) {
                throw new CustomError(404, 'admin wallet not found');
            }
            res.status(200).json(wallet);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async updateAdminWallet(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedWallet = await AdminWalletService.updateAdminWallet(Number(id), updatedData);
            if (!updatedWallet) {
                throw new CustomError(404, 'admin wallet not found');
            }
            res.status(200).json(updatedWallet);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async deleteAdminWallet(req, res) {
        try {
            const { id } = req.params;
            const deleted = await AdminWalletService.deleteAdminWallet(Number(id));
            if (!deleted) {
                throw new CustomError(404, 'admin wallet not found');
            }
            res.status(204).send();
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
}
export default AdminWalletController;
