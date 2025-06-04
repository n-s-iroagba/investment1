export type Manager = {
  id: number
  lastName: string
  firstName: string
  image:Blob|string;
  minimumInvestmentAmount: number
  percentageYield: number
  duration: number
  qualification: string
}

export type ManagerCreationDto = {
  lastName: string
  firstName: string
  image: File
  minimumInvestmentAmount: number
  percentageYield: number
  duration: number
  qualification: string
}
