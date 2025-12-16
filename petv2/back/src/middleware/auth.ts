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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'initial',
      hypothesisId: 'B5_verifyToken_cookie',
      location: 'auth.ts:verifyToken',
      message: 'Checking for token cookie',
      data: {
        hasCookies: !!req.cookies,
        cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
        hasToken: !!req.cookies?.token,
        tokenLength: req.cookies?.token?.length || 0,
        path: req.path,
        method: req.method,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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
