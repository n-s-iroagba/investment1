import UserService, { InvestorCreationDto, ResendTokenDto } from "../services/UserService.js";
import AuthUtils, { EmailVerificationDto, secret } from "../utils/auth/AuthUtils.js";
import { CustomError } from "../utils/error/CustomError.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger/logger.js";
export class AuthController {
    static async investorSignup(req: Request, res: Response) {
        try {
            const token = await UserService.createInvestor(req.body as unknown as InvestorCreationDto);
            return res.status(201).json(token)
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    static async adminSignup(req: Request, res: Response) {
      logger.info('in admin sign up function')
        const { password, username, email } = req.body
        try {
            const token = await UserService.createAdmin({ password, username, email });
            return res.status(201).json(token)
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
static async verifyEmail(req: Request, res: Response) {
  try {
    const user = await UserService.verifyEmail(req.body as EmailVerificationDto);

    const result = await UserService.login({
      email: user.email,
      password: user.password,
    });
   

    if ('loginToken' in result) {
      res.cookie('token', result.loginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
// res.cookie('token', result.loginToken, {
//   httpOnly: true,
//   secure: true,
//   sameSite: 'none', // MUST be 'none' for cross-domain
//   maxAge: 7 * 24 * 60 * 60 * 1000,
// });
console.log('Cookie set, response headers:', res.getHeaders());
   const role = user.role
    console.log('role is', role)
      return res.status(200).json({
          role
      }); 
    } else {
       throw new CustomError(500,'malformed token')
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
}


    static async resendVerificationToken(req: Request, res: Response) {
        try {
            const token = await UserService.resendEmailVerificationMail(req.body as ResendTokenDto)
            return res.status(201).json(token)
        } catch (error) {
            errorHandler(error, req, res)
        }
    }

    static async login(req: Request, res: Response) {

        try {
            const { email, password } = req.body
            const result = await  UserService.login({ email, password })
            
        if ('loginToken' in result && 'user'in result) {
         res.cookie('token', result.loginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
// res.cookie('token', result.loginToken, {
//   httpOnly: true,
//   secure: true,
//   sameSite: 'none', // MUST be 'none' for cross-domain
//   maxAge: 7 * 24 * 60 * 60 * 1000,
// });
console.log('Cookie set, response headers:', res.getHeaders());
      return res.status(200).json({
        message: 'Login successful',
          role: result.user.role,
      });
    } else {
      return res.status(200).json({
        verificationToken: result.verificationToken,
      })

        } }catch (error) {
            errorHandler(error, req, res)
        }
    }

    static async forgotPassword(req: Request, res: Response) {

        try {
            const { email } = req.body
            const token = UserService.forgotPassword(email)
            return res.status(200).json({ resetPasswordToken: token })

        } catch (error) {
            errorHandler(error, req, res)
        }
    }
    static async resetPassword(req: Request, res: Response) {

        try {
            const { resetPasswordToken, password } = req.body
           const result = await UserService.resetPassword({ resetPasswordToken, password })
                 if ('loginToken' in result && 'user'in result) {
         res.cookie('token', result.loginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        message: 'Login successful',
          role: result.user.role,
      });
    } else {
      return res.status(200).json({
        verificationToken: result.verificationToken,
      })

        } }catch (error) {
            errorHandler(error, req, res)
        }

    }
    static async  verifyResetToken(req: Request, res: Response) {
  const token = req.body.token || req.query.token;
  if (!token) throw new CustomError(400,'Token is required is missing');

  try {
    const payload = jwt.verify(token, secret) as { id: string };
    res.status(200).end()
    
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
}
