import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../../models/User";
import crypto from 'crypto';
import logger from "../logger/logger";
import MailService from "../../services/MailService";
import { Response } from "express";


// Load environment variables
dotenv.config();

// Secret from environment variables, fallback to a default in case it's not set
export const secret = process.env.JWT_SECRET || 'udorakpuenyi';

// Define the JWT Payload Type
type JWTPayload = {
    role: 'ADMIN' | 'INVESTOR';
    type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'|'AUTH';
    secret: string;
    userId: number;
};

export type EmailVerificationDto = {
  code:string;
  token:string;
}
// Utility class for handling JWT operations
class AuthUtils {
    static async initiateEmailVerificationProcess(user: User,name:string): Promise<string> {
        const code = this.generateEmailVerificationCode()
        const verificationToken = await JWTUtils.generateVerificationToken(user);
        user.emailVerificationCode = code
        user.emailVerificationToken = verificationToken
        try{
        await user.save()
        MailService.sendEmailVerificationMail(user,name)
        return verificationToken;
        }catch(error){
            logger.error(`error occured in initiateEmailVerificationProcess in AuthUtils class,${error}`)
            throw error

        }
    }
    static async createNewEmailVerificationToken (user:User){
        try{
            const code = this.generateEmailVerificationCode()
            const token = await JWTUtils.generateVerificationToken(user)
            user.emailVerificationCode = code
            user.emailVerificationToken = token
            await user.save()
            MailService.resendEmailVerificationMail(user)
            return token
        }catch(error){
            logger.error(`error occured in createNewEmailVerificationToken in AuthUtils class,${error}`)
            throw error
        }
    }
    static generateEmailVerificationCode (): string {
        let randomCode='123456'
          if (process.env.NODE_ENV === 'production') {
             randomCode = crypto.randomBytes(20).toString('hex')
    }
    return randomCode
}

static async generateLoginToken(user: User):Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };

return await JWTUtils.generateAuthToken(user);


  }
}
export default AuthUtils

export class JWTUtils {
    // Generate the email verification token
    static async generateVerificationToken(user: User): Promise<string> {
        const payload: JWTPayload = {
            role: user.role,
            type: 'EMAIL_VERIFICATION',
            secret: secret,
            userId: user.id,
        };

        // Generate and sign the token with an expiration of 10 minutes
        const token = jwt.sign(payload, secret, { expiresIn: '10m' }); // '10m' for 10 minutes
        return token;
    }
    
        static async generateForgotPasswordToken(user: User): Promise<string> {
        const payload: JWTPayload = {
            role: user.role,
            type: 'PASSWORD_RESET',
            secret: secret,
            userId: user.id,
        };


        
        // Generate and sign the token with an expiration of 10 minutes
        const token = jwt.sign(payload, secret, { expiresIn: '7d' }); // '10m' for 10 minutes
        return token;
    }

     static async verifyForgotPasswordToken(token: string): Promise<{ userId: number }> {
    return jwt.verify(token, secret) as { userId: number };
  }

        static async generateAuthToken(user: User): Promise<string> {
        const payload: JWTPayload = {
            role: user.role,
            type: 'AUTH',
            secret: secret,
            userId: user.id,
        };

        // Generate and sign the token with an expiration of 10 minutes
        const token = jwt.sign(payload, secret, { expiresIn: '7d' }); // '10m' for 10 minutes
        return token;
    }
}