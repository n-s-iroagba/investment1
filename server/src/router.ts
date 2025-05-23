import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import ManagerController from './controllers/ManagerController';
import AdminWalletController from './controllers/AdminWalletController';
import { upload } from './middlewares/upload';

import KycController from './controllers/KycController';
import SocialMediaController from './controllers/SocialMediaController';
import ManagedPortfolioController from './controllers/ManagedPortfolioController';
import InvestorController from './controllers/InvestorController';
import { VerificationFeeController } from './controllers/VerificationFeeController';
const router = Router();
router.post('/investment/new/:investorId',ManagedPortfolioController.createInvestment)
router.post('/investment/:investorId',ManagedPortfolioController.getInvestment)


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
router.post('/auth/login', /* authController.login */);
router.post('/auth/signup', AuthController.investorSignup);
router.post('/admin/auth/signup', AuthController.adminSignup);
router.post ('/auth/verify-email',AuthController.verifyEmail)
router.post (`/auth/resend-verification-token`,AuthController.resendVerificationToken)
router.post('/auth/logout', /* authController.logout */);
router.post('/auth/refresh-token', /* authController.refreshToken */);

export default router