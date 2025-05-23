import UserService, { InvestorCreationDto, ResendTokenDto } from "../services/UserService";
import AuthUtils, { EmailVerificationDto } from "../utils/auth/AuthUtils";
import { errorHandler } from "../utils/error/errorHandler";
import { Request,Response } from "express";

export class AuthController {
    static async investorSignup(req:Request,res:Response){
    try{
        const token = await UserService.createInvestor(req.body as unknown as InvestorCreationDto);
        return res.status(201).json(token)
    }catch(error){
       errorHandler(error,req,res)
    }
    }
    static async adminSignup(req:Request,res:Response){
        const {password, username,email} = req.body
    try{
        const token = await UserService.createAdmin({password, username,email});
        return res.status(201).json(token)
    }catch(error){
       errorHandler(error,req,res)
    }
    }
    static async verifyEmail(req:Request, res:Response){
        try{
            const user = await UserService.verifyEmail(req.body as EmailVerificationDto )
            return AuthUtils.login(user, res)
        }catch(error){
            errorHandler(error,req, res)
        }
    }

    static async resendVerificationToken (req:Request, res:Response){
        try{
            const token = await UserService.resendEmailVerificationMail(req.body as ResendTokenDto)
            return res.status(201).json(token)
        }catch(error){
            errorHandler(error, req, res)
        }
    }
}