import { KycService } from '../services/KycService.js';
import { errorHandler } from '../utils/error/errorHandler.js';
class KycController {
    static async create(req, res) {
        try {
            const investorId = Number(req.params.investorId);
            const { type, number } = req.body;
            const image = req.file?.path || ''; // assuming multer is used and path is stored as string
            const kyc = await KycService.createKyc({ type, image, number, investorId });
            res.status(201).json(kyc);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async verify(req, res) {
        try {
            const { id } = req.params;
            const kyc = await KycService.verifyKyc(Number(id));
            res.status(200).json(kyc);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { type, number, investorId } = req.body;
            const image = req.file?.path || '';
            const updatedKyc = await KycService.updateKyc(Number(id), { type, image, number, investorId });
            res.status(200).json(updatedKyc);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
}
export default KycController;
