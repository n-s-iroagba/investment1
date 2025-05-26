export interface Referral {
  id: number
  amount: number
  referrerId: number
  referredId: number
  settled: boolean
  createdAt: string
  updatedAt: string
  referrer?: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  referred?: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}
