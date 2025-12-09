import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ממשק עבור נתוני המשתמש בטוקן
interface UserPayload {
  userId: number;
  fullName: string;
  roleId: number;
}

// הרחבת ממשק Request להוספת user
interface AuthRequest extends Request {
  user?: UserPayload;
} 
export const createToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const payload = {
    userId: req.user?.userId,
    fullName: req.user?.fullName,
    roleId: req.user?.roleId,
  };
  const myJWT = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return 'Bearer '+ myJWT;
};  




// אימות טוקן JWT
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user  = {
      userId: decoded.userId,
      fullName:decoded.fullName,
      roleId: decoded.roleId ,
    };
    console.log('decoded:',decoded,'req.user:',req.user)
    if (!req.user.userId || !req.user.roleId) {
      return res.status(401).json({message: 'Token not ok'})
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'טוקן לא תקין' });
  }
}

export const restrictTo = (allowedRoles: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
      next();
  };
}