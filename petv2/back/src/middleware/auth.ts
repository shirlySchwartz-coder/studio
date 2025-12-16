import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserPayload, AuthRequest } from '../models/UserInfo';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// הרחבת ממשק Request להוספת user

export const createToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): string => {
  const payload = {
    userId: req.user!.userId,
    fullName: req.user!.fullName,
    roleId: req.user!.roleId,
    shelterId: req.user!.shelterId,
  };
  const myJWT = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return 'Bearer ' + myJWT;
};

// אימות טוקן JWT
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = {
      userId: decoded.userId,
      fullName: decoded.fullName,
      roleId: decoded.roleId,
      shelterId: decoded.shelterId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'טוקן לא תקין' });
  }
};

export const restrictTo = (allowedRoles: number[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(req.user.roleId)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
