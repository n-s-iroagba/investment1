import Admin from "../models/Admin";
import User from "../models/User";
import AuthUtils, { EmailVerificationDto } from "../utils/auth/AuthUtils";
import { CustomError } from "../utils/error/CustomError";
import logger from "../utils/logger/logger";
import { InvestorService } from "./InvestorService";
import { ReferralService } from "./ReferralService"; // assumed import

export type InvestorCreationDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  countryOfResidence: string;
  gender: string;
  dateOfBirth: Date;
  referrerCode?: number;
};

export type ResendTokenDto ={
  token:string;
}

class UserService {
  static async createInvestor(data: InvestorCreationDto) {
    try {
      // Create user
      const user = await User.create({
        email: data.email,
        password: data.password,
        role: 'INVESTOR',
      });

      let referrerId: number | undefined = undefined;

      // Handle referral if referrerCode is provided
      if (data.referrerCode) {
        const referrer = await InvestorService.getInvestorByRefferalCode(data.referrerCode);
        if (referrer) {
          referrerId = referrer.id;
        } else {
          logger.warn(`No referrer found for code: ${data.referrerCode}`);
        }
      }

       const investor = await InvestorService.createInvestor({
        firstName: data.firstName,
        lastName: data.lastName,
        userId: user.id,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        countryOfResidence: data.countryOfResidence,
        referrerId,
      });
      // Trigger email verification
      const token = await AuthUtils.initiateEmailVerificationProcess(user, data.firstName);

      return token
    } catch (error) {
      logger.error(`Error in createInvestor UserService function: ${error}`);
      throw error;
    }
  }

    static async createAdmin(data: {password:string, username:string,email:string}){
    try {
      // Create user
      const user = await User.create({
        email: data.email,
        password: data.password,
        role: 'ADMIN',
      });

       const investor = await Admin.create({
        username: data.username
      });
      // Trigger email verification
      const token = await AuthUtils.initiateEmailVerificationProcess(user, data.username);

      return token
    } catch (error) {
      logger.error(`Error in createInvestor UserService function: ${error}`);
      throw error;
    }
  }

  static async verifyEmail(data:EmailVerificationDto){
    try{
      const user = await User.findOne({where:{
        emailVerificationToken:data.token
      }})
      if(!user){
        throw new CustomError(404,'email verification user not found')
      }
       user.isEmailVerified = true
       user.emailVerificationCode = null
       user.emailVerificationToken = null
       await user.save()
       return user
    }catch(error){
      logger.error(`Error in verify email UserService function: ${error}`);
      throw error;
    }
  }
  static async resendEmailVerificationMail (data:ResendTokenDto){
    try{
        const user = await User.findOne({where:{
        emailVerificationToken:data.token
      }})
      if(!user){
        throw new CustomError(404,'email verification user not found')
      }
      return await AuthUtils.createNewEmailVerificationToken(user)  
    }
    catch(error){
      logger.error(`Error in resend Email Verification mail  UserService function: ${error}`);
      throw error;
    }
}
}

export default UserService;
