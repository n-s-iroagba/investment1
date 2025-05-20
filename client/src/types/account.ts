
interface AccountAttributes {
  id: number;
  balanceInUSD: number;
  investorId: ForeignKey<Investor['id']>;
  createdAt?: Date;
  updatedAt?: Date;
}