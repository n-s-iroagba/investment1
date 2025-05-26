export const apiRoutes = {
  auth: {
    login: (): string => `/auth/login`,
    logout: (): string => `/auth/logout`,
    register: (): string => `/auth/register`,
    forgotPassword: (): string => `/auth/forgot-password`,
    resetPassword: (): string => `/auth/reset-password`,
    verifyEmail: (): string => `/auth/verify-email`,
    resendVerificationEmail: (): string => `/auth/resend-verification-email`,
    me: (): string => `/auth/me`,
  },

  verificationFee:{
   create:(id:string|number):string=>`/verification-fees/${id}`
  },
  payments: {
    list: (): string => `/payments`,
    get: (id: number | string): string => `/payments/${id}`,
    create: (id:number): string => `/payments/${id}`,
    unverified : (): string => `/payments/unverified`,

    update: (id: number | string): string => `/payments/${id}`,
    delete: (id: number | string): string => `/payments/${id}`,
    verify: (id: number | string): string => `/payments/${id}/verify`,
    unverify: (id: number | string): string => `/payments/${id}/unverify`,
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
    creditInvestment: (investorId: string | number): string => `/managed-portfolios/credit/${investorId}`
  },
  investor: {
    profile: (id: string | number): string => `/investors/${id}`,
    update: (id: string | number): string => `/investors/${id}`,
    delete: (id: string | number): string => `/investors/${id}`,
    me: (): string => `/investors/me`,
    updateMe: (): string => `/investors/me`,
    list:():string => `/investors`,
  },
  email: {
    send: (): string => `/email/send`,
    sendToInvestor: (): string => `/email/send-to-investor}`,
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
  }
}
