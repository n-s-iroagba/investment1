import Admin from "../models/Admin.js";
import User from "../models/User.js";
import AuthUtils, { EmailVerificationDto, JWTUtils } from "../utils/auth/AuthUtils.js";
import { CustomError } from "../utils/error/CustomError.js";
import logger from "../utils/logger/logger.js";
import { InvestorService } from "./InvestorService.js";
import MailService from "./MailService.js";
import { ReferralService } from "./ReferralService.js"; // assumed import
import bcrypt from 'bcrypt'

const hashPassword=async (password:string):Promise<string> =>{
  return await  bcrypt.hash(password,5)
}
const comparePassword = async ( payloadPassword:string, userPassword:string,):Promise<boolean>=>{
  return await bcrypt.compare(payloadPassword,userPassword)
}
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
      const password = await hashPassword(data.password)
      const user = await User.create({
        email: data.email,
        password,
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

      const users = await User.findAll()
      console.log('USERS!',users)
      let user = await User.findOne({where:{
        email:data.email
      }}) 
      if (user) throw new CustomError(409,'user already exists with this email')
      user = await User.create({
        email: data.email,
        password: data.password,
        role: 'ADMIN',
     
      });

       await Admin.create({
        username: data.username,
        userId:user.id
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


  static async login (data:{email:string,password:string}):Promise<{loginToken:string,user:User}|{verificationToken:string}>{
    try{
        const user = await User.findOne({where:{
        email:data.email
      }})
      if(!user){
        throw new CustomError(404,'login user not found')
      }
      console.log(user)
      if (!comparePassword(data.password,user.password)){
        throw new CustomError(409,'wrong credentials')
      }
      if(!user.isEmailVerified){
        return{verificationToken: await AuthUtils.initiateEmailVerificationProcess(user,'Esteemed User,')}
      }
      return{loginToken: await AuthUtils.generateLoginToken(user),user}
    
    }
    catch(error){
     logger.error(`Error in login  UserService function: ${error}`);
      throw error;
}
  }
static async forgotPassword(email:string){
  try{
    const user = await User.findOne({where:{email}})
    if (!user){
      throw new CustomError(404,'user not found')
    }
    const token = await JWTUtils.generateForgotPasswordToken(user)
    await MailService.sendForgotPasswordMail(user,token)
    return token

}catch(error){
   logger.error(`Error in forgot password  UserService function: ${error}`);
      throw error;
    }
}

static async resetPassword(data: { resetPasswordToken: string; password: string }) {
  try {
    // 1. Decode and validate the reset token
    const decoded = await JWTUtils.verifyForgotPasswordToken(data.resetPasswordToken);

    console.log('decoded', decoded)

    // 2. Find the user by ID or email in token payload
    const user = await User.findOne({ where: { id: decoded.userId } });
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    // 3. Hash the new password
    const hashedPassword = await hashPassword(data.password);

    // 4. Update password and clear token-related fields if needed
    user.password = hashedPassword;
    await user.save();

   return this.login({email:user.email,password:user.password})
  } catch (error) {
    logger.error(`Error in resetPassword UserService function: ${error}`);
    throw  error
  }
}

}

export default UserService;
