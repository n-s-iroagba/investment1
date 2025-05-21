import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import ManagerController from './controllers/ManagerController';
import AdminWalletController from './controllers/AdminWalletController';
import { upload } from './middlewares/upload';
import InvestorController from './controllers/InvestorController';
import KycController from './controllers/KycController';

const router = Router();
router.post('/investment/new/:investorId',InvestorController.createInvestment)


router.get('/kyc/verify/:id',KycController.verify)

// Trading Assets routes
router.get('/trading-assets', /* tradingAssetController.list */);
router.get('/trading-assets/:id', /* tradingAssetController.get */);
router.post('/trading-assets', /* tradingAssetController.create */);
router.patch('/trading-assets/:id', /* tradingAssetController.update */);
router.delete('/trading-assets/:id', /* tradingAssetController.delete */);

// Managers routes
router.get('/managers',  ManagerController.getAllManagers );
router.get('/managers/:id',  ManagerController.getManagerById );
router.post('/managers',  upload.single("image"), ManagerController.createManager );
router.patch('/managers/:id',  upload.single("image"), ManagerController.updateManager );
router.delete('/managers/:id',  ManagerController.deleteManager);

// Trade Options routes
router.get('/trade-options', /* tradeOptionController.list */);
router.get('/trade-options/:id', /* tradeOptionController.get */);
router.post('/trade-options', /* tradeOptionController.create */);
router.patch('/trade-options/:id', /* tradeOptionController.update */);
router.delete('/trade-options/:id', /* tradeOptionController.delete */);

// Admin Wallet routes
router.get('/admin-wallets',  AdminWalletController.getAllAdminWallets );
router.get('/admin-wallets/:id',  AdminWalletController.getAdminWalletById);
router.post('/admin-wallets',  AdminWalletController.createAdminWallet );
router.patch('/admin-wallets/:id',  AdminWalletController.updateAdminWallet);
router.delete('/admin-wallets/:id',  AdminWalletController.deleteAdminWallet );

// // Fiat Accounts routes
// router.get('/fiat-accounts',FiatAccountController */);
// router.get('/fiat-accounts/:id',FiatAccountController.get */);
// router.post('/fiat-accounts',FiatAccountController.create */);
// router.patch('/fiat-accounts/:id',FiatAccountController.update */);
// router.delete('/fiat-accounts/:id',FiatAccountController.delete */);

// Crypto Wallets routes
router.get('/crypto-wallets', /* cryptoWalletController.list */);
router.get('/crypto-wallets/:id', /* cryptoWalletController.get */);
router.post('/crypto-wallets', /* cryptoWalletController.create */);
router.patch('/crypto-wallets/:id', /* cryptoWalletController.update */);
router.delete('/crypto-wallets/:id', /* cryptoWalletController.delete */);

// Social Media routes
router.get('/social-media', /* socialMediaController.list */);
router.get('/social-media/:id', /* socialMediaController.get */);
router.post('/social-media', /* socialMediaController.create */);
router.patch('/social-media/:id', /* socialMediaController.update */);
router.delete('/social-media/:id', /* socialMediaController.delete */);

// Verification Fees routes
router.get('/verification-fees', /* verificationFeeController.list */);
router.get('/verification-fees/:id', /* verificationFeeController.get */);
router.post('/verification-fees', /* verificationFeeController.create */);
router.patch('/verification-fees/:id', /* verificationFeeController.update */);
router.delete('/verification-fees/:id', /* verificationFeeController.delete */);

// Auth routes
router.post('/auth/login', /* authController.login */);
router.post('/auth/signup', AuthController.investorSignup);
router.post ('/auth/verify-email',AuthController.verifyEmail)
router.post (`/auth/resend-verification-token`,AuthController.resendVerificationToken)
router.post('/auth/logout', /* authController.logout */);
router.post('/auth/refresh-token', /* authController.refreshToken */);

export default router;