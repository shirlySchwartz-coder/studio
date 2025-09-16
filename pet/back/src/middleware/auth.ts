import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  role_id: number;
  privileges: { [key: string]: number };
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

export const checkRole = (requiredPrivileges: string[]) => async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userPrivileges = req.user?.privileges;
  if (!userPrivileges) return res.status(403).json({ error: 'No privileges found' });
  for (const priv of requiredPrivileges) {
    if (!userPrivileges[priv]) return res.status(403).json({ error: 'Insufficient privileges' });
  }
  next();
};