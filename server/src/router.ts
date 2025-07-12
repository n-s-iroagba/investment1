import { Response, Router } from "express"
import { AuthController } from "./controllers/AuthController.js"
import ManagerController from "./controllers/ManagerController.js"
import AdminWalletController from "./controllers/AdminWalletController.js"
import { upload } from "./middlewares/upload.js"
import EmailController from "./controllers/EmailController.js"

import KycController from "./controllers/KycController.js"
import SocialMediaController from "./controllers/SocialMediaController.js"
import ManagedPortfolioController from "./controllers/ManagedPortfolioController.js"
import { VerificationFeeController } from "./controllers/VerificationFeeController.js"
import InvestorController from "./controllers/InvestorController.js"
import { authenticate, 
  // adminAuth,
   type AuthenticatedRequest } from "./middlewares/authenticate.js"
import Investor from "./models/Investor.js"
import Admin from "./models/Admin.js"
import { CustomError } from "./utils/error/CustomError.js"
import { errorHandler } from "./utils/error/errorHandler.js"
import { PaymentController } from "./controllers/PaymentController.js"
import User from "./models/User.js"
import ReferralController from "./controllers/ReferralController.js"
const router = Router()

// =====================================
// ADMIN-ONLY ROUTES (Protected)
// =====================================

// Investment Management (Admin only)
router.post("/investment/new/:investorId", 
  // adminAuth,
   ManagedPortfolioController.createInvestment)
router.patch('/managed-portfolios/credit-amount-deposited/:portfolioId', 
  // adminAuth,
   ManagedPortfolioController.creditAmountDeposited)
router.patch('/managed-portfolios/credit-earnings/:portfolioId', 
  // adminAuth,
   ManagedPortfolioController.creditEarnings)

// Investor Management (Admin only)
router.get('/investors', 
  // adminAuth,
   InvestorController.getAllInvestors)
router.get('/get-investor/:investorId', 
  // adminAuth,
   InvestorController.getInvestor)
router.delete("/investors/:id", 
  // adminAuth,
   InvestorController.deleteInvestor)

// Referral Management (Admin only)
router.get('/investors/:investorId/referrals', 
  // adminAuth,
   ReferralController.getInvestorReferrals)
router.get('/investors/:investorId/referrals/settled', 
  // adminAuth,
   ReferralController.getInvestorSettledReferrals)
router.get('/investors/:investorId/referrals/unsettled', 
  // adminAuth,
   ReferralController.getInvestorUnsettledReferrals)
router.get('/referrals/unpaid', 
  // adminAuth,
   ReferralController.getUnpaidReferrals)

// KYC Management (Admin only)
router.patch("/kyc/:id", 
  // adminAuth,
   KycController.update)
router.get("/kyc/verify/:id", 
  // adminAuth,
   KycController.verify)
router.get('/kyc/unverified', 
  // adminAuth,
   KycController.getUnverified)

// Manager Management (Admin only)
router.get("/managers", 
  // adminAuth,
   ManagerController.getAllManagers)
router.get("/managers/:id", 
  // adminAuth,
   ManagerController.getManagerById)
router.post("/managers", 
  // adminAuth,
   upload.single("image"), ManagerController.createManager)
router.patch("/managers/:id", 
  // adminAuth,
   upload.single("image"), ManagerController.updateManager)
router.delete("/managers/:id", 
  // adminAuth,
   ManagerController.deleteManager)

// Admin Wallet routes (Admin only)
router.get("/admin-wallets", 
  // adminAuth,
   AdminWalletController.getAllAdminWallets)
router.get("/admin-wallets/:id", 
  // adminAuth,
   AdminWalletController.getAdminWalletById)
router.post("/admin-wallets", 
  // adminAuth,
   AdminWalletController.createAdminWallet)
router.patch("/admin-wallets/:id", 
  // adminAuth,
   AdminWalletController.updateAdminWallet)
router.delete("/admin-wallets/:id", 
  // adminAuth,
   AdminWalletController.deleteAdminWallet)

// Social Media routes (Admin only)
router.get("/social-media", 
  // adminAuth,
   SocialMediaController.getAll)
router.get("/social-media/:id", 
  // adminAuth,
   SocialMediaController.getById)
router.post("/social-media", 
  // adminAuth,
   upload.single("logo"), SocialMediaController.create)
router.patch("/social-media/:id", 
  // adminAuth,
   upload.single("logo"), SocialMediaController.update)
router.delete("/social-media/:id", 
  // adminAuth,
   SocialMediaController.delete)

// Verification Fees routes (Admin only)
router.post("/verification-fees/:investorId", 
  // adminAuth,
   VerificationFeeController.create)
router.patch("/verification-fees/:id", 
  // adminAuth,
   VerificationFeeController.update)
router.delete("/verification-fees/:id", 
  // adminAuth,
   VerificationFeeController.delete)
router.get('/verification-fees/unpaid/:investorId', 
  // adminAuth,
   VerificationFeeController.getUnpaidVerificationFees)

// Payment Management (Admin only)
router.put("/payments/:id", 
  // adminAuth,
   PaymentController.updatePayment)
router.patch("/payments/verify/:id", 
  // adminAuth,
   PaymentController.verifyPayment)
router.patch("/payments/unverify/:id", 
  // adminAuth,
   PaymentController.unverifyPayment)
router.get("/payments/unverified", 
  // adminAuth,
   PaymentController.getUnverifiedPayments)
router.get("/payments/investor/:investorId", 
  // adminAuth,
   PaymentController.getPaymentsByInvestorId)
router.get("/investor-payments/:id", 
  // adminAuth,
   PaymentController.getInvestorPayments)
router.delete("/:id", 
  // adminAuth,
   PaymentController.deletePayment)

// Email routes (Admin only)
router.post("/email/send", 
  // adminAuth,
   EmailController.sendGeneralEmail)
router.post("/email/send-to-investor/:investorId", 
  // adminAuth,
   EmailController.sendEmailToInvestor)

// =====================================
// INVESTOR ROUTES (Protected)
// =====================================

// Investment viewing (Investor can view their own)
router.get("/managed-portfolios/investor/:investorId", authenticate, ManagedPortfolioController.getInvestment)

// Investor profile routes
router.get("/investors/me/:investorId", authenticate, InvestorController.getMyProfile)
router.patch("/investors/me/:investorId", authenticate, InvestorController.updateMyProfile)

// KYC creation (Investors can create their own KYC)
router.post("/kyc/:investorId", authenticate, KycController.create)

// Payment creation (Investors can create payments)
router.post("/create/:investorId", authenticate, upload.single('file'), PaymentController.createPayment)

// =====================================
// PUBLIC ROUTES (No authentication)
// =====================================

// Auth routes
router.post("/auth/forgot-password", AuthController.forgotPassword)
router.post("/auth/reset-password", AuthController.resetPassword)
router.post("/auth/login", AuthController.login)
router.post("/auth/signup", AuthController.investorSignup)
router.post("/auth/admin/signup", AuthController.adminSignup)
router.post("/auth/verify-email", AuthController.verifyEmail)
router.post(`/auth/resend-verification-token`, AuthController.resendVerificationToken)
router.get("/auth/logout", (req, res) => {
  res.clearCookie("token")
  return res.status(200).json({ message: "Logged out successfully" })
})

// Token verification (public for password reset flow)
router.post("/auth/verify-reset-token", AuthController.verifyResetToken)

// =====================================
// AUTHENTICATED USER INFO
// =====================================

async function getInvestorById(id: string): Promise<Investor | null> {
  // Replace with real DB query
  return await Investor.findByPk(id)
}

async function getAdminById(id: string): Promise<Admin | null> {
  // Replace with real DB query
  return await Admin.findByPk(id)
}

router.get("/auth/me", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { userId, role } = req.user!
  console.log('id', userId)
 type LoggedInUser ={
  displayName:string
  isAdmin:boolean
  roleId:number
}
  try {
    if (role === "INVESTOR") {
     
      const investor = await Investor.findOne({where:{userId}})
      if (!investor) throw new CustomError(404, "Investor not found")

      const user:LoggedInUser = {
          displayName:investor.firstName,
          isAdmin:false,
          roleId:investor.id
      }
      return res.json(user)
    }

    if (role === "ADMIN") {
     
      const admin = await Admin.findOne({where:{userId}})
    
      if (!admin) throw new CustomError(404, "Admin not found")

      const user:LoggedInUser = {
         displayName:admin.username,
         isAdmin:true,
         roleId:admin.id
      }

      return res.json(user)
    }

    throw new CustomError(404,'unknown user')
  } catch (err) {
    console.error(err)
    errorHandler(err, req, res)
  }
  })

router.post("/auth/refresh-token" /* authController.refreshToken */)

export default router
