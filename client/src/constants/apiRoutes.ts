/**
 * Centralized API route definitions with URL builders for ID-based endpoints.
 * You can extend or modify arbitrary routes under each resource as needed.
 */
export const apiRoutes = {
  tradingAsset: {
    list: (): string => `/trading-assets`,
    get: (id: number | string): string => `/trading-assets/${id}`,
    create: (): string => `/trading-assets`,
    update: (id: number | string): string => `/trading-assets/${id}`,
    delete: (id: number | string): string => `/trading-assets/${id}`,
  },
  investment : {
    new:(id:string|number):string => `/investment/new/${id}`
  },

  manager: {
    list: (): string => `/managers`,
    get: (id: number | string): string => `/managers/${id}`,
    create: (): string => `/managers`,
    update: (id: number | string): string => `/managers/${id}`,
    delete: (id: number | string): string => `/managers/${id}`,
  },

  tradeOption: {
    list: (): string => `/trade-options`,
    get: (id: number | string): string => `/trade-options/${id}`,
    create: (): string => `/trade-options`,
    update: (id: number | string): string => `/trade-options/${id}`,
    delete: (id: number | string): string => `/trade-options/${id}`,
  },

  adminWallet: {
    list: (): string => `/admin-wallets`,
    get: (id: number | string): string => `/admin-wallets/${id}`,
    create: (): string => `/admin-wallets`,
    update: (id: number | string): string => `/admin-wallets/${id}`,
    delete: (id: number | string): string => `/admin-wallets/${id}`,
  },

  fiatAccount: {
    list: (): string => `/fiat-accounts`,
    get: (id: number | string): string => `/fiat-accounts/${id}`,
    create: (): string => `/fiat-accounts`,
    update: (id: number | string): string => `/fiat-accounts/${id}`,
    delete: (id: number | string): string => `/fiat-accounts/${id}`,
  },

  cryptoWallet: {
    list: (): string => `/crypto-wallets`,
    get: (id: number | string): string => `/crypto-wallets/${id}`,
    create: (): string => `/crypto-wallets`,
    update: (id: number | string): string => `/crypto-wallets/${id}`,
    delete: (id: number | string): string => `/crypto-wallets/${id}`,
  },

  socialMedia: {
    list: (): string => `/social-media`,
    get: (id: number | string): string => `/social-media/${id}`,
    create: (): string => `/social-media`,
    update: (id: number | string): string => `/social-media/${id}`,
    delete: (id: number | string): string => `/social-media/${id}`,
  },

  verificationFee: {
    list: (): string => `/verification-fees`,
    get: (id: number | string): string => `/verification-fees/${id}`,
    create: (): string => `/verification-fees`,
    update: (id: number | string): string => `/verification-fees/${id}`,
    delete: (id: number | string): string => `/verification-fees/${id}`,
  },

  auth: {
    login: (): string => `/auth/login`,
    signup: (): string => `/auth/signup`,
    logout: (): string => `/auth/logout`,
    refresh: (): string => `/auth/refresh-token`,
    verifyEmail: ():string => `auth/verify-email`,
    resendEmailVerificationToken: ():string => `auth/resend-verification-token`
    // password reset, email verify, etc. can be added here
  },
  kyc:{
    verify:(id:string|number):string =>`/kyc/verify/${id}`
  }


};
