import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { secret } from '../utils/auth/AuthUtils';
import { CustomError } from '../utils/error/CustomError';


export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'ADMIN' | 'INVESTOR';
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    throw new CustomError(401,'Unauthorized: No token provided' );
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: 'ADMIN' | 'INVESTOR';
    };
     console.log('decoded',decoded)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}
