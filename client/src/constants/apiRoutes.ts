export const apiRoutes = {
  auth: {
    login: (): string => `/auth/login`,
    logout: (): string => `/auth/logout`,
    adminSignup: (): string => '/auth/admin/signup',
    signup: (): string => `/auth/signup`,
    forgotPassword: (): string => `/auth/forgot-password`,
    resetPassword: (): string => `/auth/reset-password`,
    verifyEmail: (): string => `/auth/verify-email`,
    resendVerificationEmail: (): string => `/auth/resend-verification-token`,
    me: (): string => `/auth/me`,
  },


  verificationFee:{
   create:(id:string|number):string=>`/verification-fees/${id}`,
  update:(id:string|number):string=>`/verification-fees/${id}`,
  delete:(id:string|number):string=>`/verification-fees/${id}`,
  investorUpaid:(id:string|number):string=>`/verification-fees/unpaid/:/${id}`,
  },
  referral: {
    list: (): string => `/referrals`,
    unpaid: (): string => `/referrals/unpaid`,
    get: (id: number | string): string => `/referrals/${id}`,
    settle: (id: number | string): string => `/referrals/${id}/settle`,
    investorReferrals: (investorId: number | string): string => `/investors/${investorId}/referrals`,
    investorSettledReferrals: (investorId: number | string): string => `/investors/${investorId}/referrals/settled`,
    investorUnsettledReferrals: (investorId: number | string): string => `/investors/${investorId}/referrals/unsettled`,
  },
  investment: {
    new: (id: string | number): string => `/investment/new/${id}`,
    getInvestment: (investorId: string | number): string => `/managed-portfolios/investor/${investorId}`,
    creditInvestmentEarnings: (portfolioId: string | number): string => `/managed-portfolios/credit-earnings/${portfolioId}`,
    creditAmountDeposited: (portfolioId: string | number): string => `/managed-portfolios/credit-amount-deposited/${portfolioId}`
  },
  investor: {
   
    getInvestor:(id:number):string => `/get-investor/${id}`,
    delete: (id: string | number): string => `/investors/${id}`,
    me: (id:string|number): string => `/investors/me/${id}`,
    updateMe: (id:string|number): string => `/investors/me/${id}`,
    list:():string => `/investors`,
  },
  email: {
    send: (): string => `/email/send`,
    sendToInvestor: (investorId:string|number): string => `/email/send-to-investor/${investorId}`,
  },
  adminWallet: {
    list: (): string => `/admin-wallets`,
    get: (id: number | string): string => `/admin-wallets/${id}`,
    create: (): string => `/admin-wallets`,
    update: (id: number | string): string => `/admin-wallets/${id}`,
    delete: (id: number | string): string => `/admin-wallets/${id}`,
  },
  manager: {
    list: (): string => `/managers`,
    get: (id: number | string): string => `/managers/${id}`,
    create: (): string => `/managers`,
    update: (id: number | string): string => `/managers/${id}`,
    delete: (id: number | string): string => `/managers/${id}`,
  },
  socialMedia: {
    list: (): string => `/social-media`,
    get: (id: number | string): string => `/social-media/${id}`,
    create: (): string => `/social-media`,
    update: (id: number | string): string => `/social-media/${id}`,
    delete: (id: number | string): string => `/social-media/${id}`,
  },
  kyc:{
    verify:(id:string|number):string => `/kyc/verify/${id}`,
    create:(id:string|number):string => `/kyc/${id}`,
    unverified:():string => `/kyc/unverified`
  },
    payments: {
    create: (investorId: number | string): string => `/payments/create/${investorId}`,
    update: (id: number | string): string => `/payments/${id}`,
    delete: (id: number | string): string => `/payments/${id}`,
    verify: (id: number | string): string => `/payments/verify/${id}`,
    unverify: (id: number | string): string => `/payments/unverify/${id}`,
    getUnverified: (): string => `/payments/unverified`,
    getByInvestorId: (investorId: number | string): string => `/payments/investor/${investorId}`,
    getInvestorPayments: (id: number | string): string => `/payments/investor-payments/${id}`
  }
}
