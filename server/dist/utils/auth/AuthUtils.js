import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import crypto from 'crypto';
import logger from "../logger/logger.js";
import MailService from "../../services/MailService.js";
// Load environment variables
dotenv.config();
// Secret from environment variables, fallback to a default in case it's not set
export const secret = process.env.JWT_SECRET || 'udorakpuenyi';
// Utility class for handling JWT operations
class AuthUtils {
    static async initiateEmailVerificationProcess(user, name) {
        const code = this.generateEmailVerificationCode();
        const verificationToken = await JWTUtils.generateVerificationToken(user);
        user.emailVerificationCode = code;
        user.emailVerificationToken = verificationToken;
        try {
            await user.save();
            MailService.sendEmailVerificationMail(user, name);
            return verificationToken;
        }
        catch (error) {
            logger.error(`error occured in initiateEmailVerificationProcess in AuthUtils class,${error}`);
            throw error;
        }
    }
    static async createNewEmailVerificationToken(user) {
        try {
            const code = this.generateEmailVerificationCode();
            const token = await JWTUtils.generateVerificationToken(user);
            user.emailVerificationCode = code;
            user.emailVerificationToken = token;
            await user.save();
            MailService.resendEmailVerificationMail(user);
            return token;
        }
        catch (error) {
            logger.error(`error occured in createNewEmailVerificationToken in AuthUtils class,${error}`);
            throw error;
        }
    }
    static generateEmailVerificationCode() {
        let randomCode = '123456';
        if (process.env.NODE_ENV === 'production') {
            randomCode = crypto.randomBytes(20).toString('hex');
        }
        return randomCode;
    }
    static async generateLoginToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
        };
        return await JWTUtils.generateAuthToken(user);
    }
}
export default AuthUtils;
export class JWTUtils {
    // Generate the email verification token
    static async generateVerificationToken(user) {
        const payload = {
            role: user.role,
            type: 'EMAIL_VERIFICATION',
            secret: secret,
            userId: user.id,
        };
        // Generate and sign the token with an expiration of 10 minutes
        const token = jwt.sign(payload, secret, { expiresIn: '10m' }); // '10m' for 10 minutes
        return token;
    }
    static async generateForgotPasswordToken(user) {
        const payload = {
            role: user.role,
            type: 'PASSWORD_RESET',
            secret: secret,
            userId: user.id,
        };
        // Generate and sign the token with an expiration of 10 minutes
        const token = jwt.sign(payload, secret, { expiresIn: '7d' }); // '10m' for 10 minutes
        return token;
    }
    static async verifyForgotPasswordToken(token) {
        return jwt.verify(token, secret);
    }
    static async generateAuthToken(user) {
        const payload = {
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
