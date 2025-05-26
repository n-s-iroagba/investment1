import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import ManagerController from './controllers/ManagerController';
import AdminWalletController from './controllers/AdminWalletController';
import { upload } from './middlewares/upload';

import KycController from './controllers/KycController';
import SocialMediaController from './controllers/SocialMediaController';
import ManagedPortfolioController from './controllers/ManagedPortfolioController';
import { VerificationFeeController } from './controllers/VerificationFeeController';
import InvestorController from './controllers/InvestorController';
import { authenticate, AuthenticatedRequest } from './middlewares/authenticate';
import Investor from './models/Investor';
import Admin from './models/Admin';
import { CustomError } from './utils/error/CustomError';
import { errorHandler } from './utils/error/errorHandler';
const router = Router();
router.post('/investment/new/:investorId',ManagedPortfolioController.createInvestment)
router.post('/investment/:investorId',ManagedPortfolioController.getInvestment)

router.patch('/investors/:id',InvestorController.updateInvestor)
router.delete('/investors/:id',InvestorController.deleteInvestor)

router.post('/kyc/:investorId',KycController.create)
router.patch('/kyc/:id',KycController.update)
router.get('/kyc/verify/:id',KycController.verify)

// Managers routes
router.get('/managers',  ManagerController.getAllManagers );
router.get('/managers/:id',  ManagerController.getManagerById );
router.post('/managers',  upload.single("image"), ManagerController.createManager );
router.patch('/managers/:id',  upload.single("image"), ManagerController.updateManager );
router.delete('/managers/:id',  ManagerController.deleteManager);


// Admin Wallet routes
router.get('/admin-wallets',  AdminWalletController.getAllAdminWallets );
router.get('/admin-wallets/:id',  AdminWalletController.getAdminWalletById);
router.post('/admin-wallets',  AdminWalletController.createAdminWallet );
router.patch('/admin-wallets/:id',  AdminWalletController.updateAdminWallet);
router.delete('/admin-wallets/:id',  AdminWalletController.deleteAdminWallet );





// Social Media routes
router.get('/social-media',  SocialMediaController.getAll );
router.get('/social-media/:id',  SocialMediaController.getById );
router.post('/social-media', upload.single('logo'),  SocialMediaController.create );
router.patch('/social-media/:id', upload.single('logo'), SocialMediaController.update );
router.delete('/social-media/:id',  SocialMediaController.delete );

// Verification Fees routes

router.post('/verification-fees/:id', VerificationFeeController.uploadProofOfPayment);
router.post('/verification-fees', VerificationFeeController.create);
router.patch('/verification-fees/:id', VerificationFeeController.update);
router.delete('/verification-fees/:id', VerificationFeeController.delete);

// Auth routes 
router.post('/auth/forgot-password',AuthController.forgotPassword)
router.post('/auth/reset-password',AuthController.resetPassword)
router.post('/auth/login', AuthController.login);
router.post('/auth/signup', AuthController.investorSignup);
router.post('/admin/auth/signup', AuthController.adminSignup);
router.post ('/auth/verify-email',AuthController.verifyEmail)
router.post (`/auth/resend-verification-token`,AuthController.resendVerificationToken)
router.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});
async function getInvestorById(id: string): Promise<Investor | null> {
  // Replace with real DB query
  return await Investor.findByPk(id);
}

async function getAdminById(id: string): Promise<Admin | null> {
  // Replace with real DB query
  return await Admin.findByPk(id);
}
router.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  const { id, role } = req.user!;

  try {
    if (role === 'investor') {
      const investor = await getInvestorById(id);
      if (!investor)  throw new CustomError(404,'Investor not found');

      return res.json({
        id: investor.id,
        firstName: investor.firstName,
      });
    }

    if (role === 'admin') {
      const admin = await getAdminById(id);
      if (!admin)  throw new CustomError(404, 'Admin not found');

      return res.json({
        id: admin.id,
        username: admin.username,
      });
    }

    return res.status(400).json({ message: 'Unknown role' });
  } catch (err) {
    console.error(err);
    errorHandler(err,req,res)
  }
})

router.post('/auth/refresh-token', /* authController.refreshToken */);

export default router