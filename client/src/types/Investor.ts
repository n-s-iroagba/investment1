import type { Kyc } from "./Kyc"
import type { VerificationFee } from "./VerificationFee"
import type { ManagedPortfolio } from "./managedPortfolio"

export interface Investor {
  id: number
  lastName: string
  firstName: string
  dateOfBirth: Date
  gender: string
  countryOfResidence: string
  referralCode: number | null
  referrerId: number | null
  userId: number
  user: {
    id: number
    email: string
    isEmailVerified: boolean
  }
  kyc?: Kyc
  managedPortfolio?: ManagedPortfolio
  verificationFees?: VerificationFee[]
  createdAt: Date
  updatedAt: Date
}


