import UserService, { InvestorCreationDto, ResendTokenDto } from "../services/UserService";
import AuthUtils, { EmailVerificationDto, secret } from "../utils/auth/AuthUtils";
import { CustomError } from "../utils/error/CustomError";
import { errorHandler } from "../utils/error/errorHandler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
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

      return res.status(200).json({
        message: 'Login successful',
        user: {
          username: user.id,
          role: user.role,
        },
      });
    } else {
      // User needs to verify email again (shouldn't happen here but handled just in case)
      return res.status(200).json({
        verificationToken: result.verificationToken,
      });
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
