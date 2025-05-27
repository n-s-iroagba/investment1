import UserService from "../services/UserService.js";
import { secret } from "../utils/auth/AuthUtils.js";
import { CustomError } from "../utils/error/CustomError.js";
import { errorHandler } from "../utils/error/errorHandler.js";
import jwt from "jsonwebtoken";
export class AuthController {
    static async investorSignup(req, res) {
        try {
            const token = await UserService.createInvestor(req.body);
            return res.status(201).json(token);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async adminSignup(req, res) {
        const { password, username, email } = req.body;
        try {
            const token = await UserService.createAdmin({ password, username, email });
            return res.status(201).json(token);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async verifyEmail(req, res) {
        try {
            const user = await UserService.verifyEmail(req.body);
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
            }
            else {
                // User needs to verify email again (shouldn't happen here but handled just in case)
                return res.status(200).json({
                    verificationToken: result.verificationToken,
                });
            }
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async resendVerificationToken(req, res) {
        try {
            const token = await UserService.resendEmailVerificationMail(req.body);
            return res.status(201).json(token);
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await UserService.login({ email, password });
            if ('loginToken' in result && 'user' in result) {
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
            }
            else {
                return res.status(200).json({
                    verificationToken: result.verificationToken,
                });
            }
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const token = UserService.forgotPassword(email);
            return res.status(200).json({ resetPasswordToken: token });
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async resetPassword(req, res) {
        try {
            const { resetPasswordToken, password } = req.body;
            const result = await UserService.resetPassword({ resetPasswordToken, password });
            if ('loginToken' in result && 'user' in result) {
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
            }
            else {
                return res.status(200).json({
                    verificationToken: result.verificationToken,
                });
            }
        }
        catch (error) {
            errorHandler(error, req, res);
        }
    }
    static async verifyResetToken(req, res) {
        const token = req.body.token || req.query.token;
        if (!token)
            throw new CustomError(400, 'Token is required is missing');
        try {
            const payload = jwt.verify(token, secret);
            res.status(200).end();
        }
        catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
}
