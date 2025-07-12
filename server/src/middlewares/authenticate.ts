import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { secret } from '../utils/auth/AuthUtils.js';
import { CustomError } from '../utils/error/CustomError.js';


export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'ADMIN' | 'INVESTOR';
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {

console.log('Received cookies:', req.headers.cookie);
console.log('Request origin:', req.headers.origin);
console.log('Request headers:', req.headers);
  let token = null;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.replace('Bearer ', '');
    console.log('Token from Authorization header:', token ? 'present' : 'missing');
  } else if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('Token from cookie:', token ? 'present' : 'missing');
  }

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

// Admin authorization middleware - must be used after authenticate
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: Authentication required' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  next();
}

// Combined middleware for admin routes (authenticate + requireAdmin)
export function adminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authenticate(req, res, (err?: any) => {
    if (err) return next(err);
    requireAdmin(req, res, next);
  });
}
