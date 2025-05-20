export type FiatAccount = {
  id: number;
 identification:string
  platform: string;

}

export type FiatAccountCreationDto = Omit<FiatAccount, 'id'>
