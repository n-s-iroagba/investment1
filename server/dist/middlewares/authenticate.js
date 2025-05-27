import jwt from 'jsonwebtoken';
import { secret } from '../utils/auth/AuthUtils.js';
import { CustomError } from '../utils/error/CustomError.js';
export function authenticate(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        throw new CustomError(401, 'Unauthorized: No token provided');
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log('decoded', decoded);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}
