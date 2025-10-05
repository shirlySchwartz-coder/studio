import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ממשק עבור נתוני המשתמש בטוקן
interface UserPayload {
  userId: number;
  roleId: number;
}

// הרחבת ממשק Request להוספת user
interface AuthRequest extends Request {
  user?: UserPayload;
}



// אימות טוקן JWT
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'חסר טוקן אימות' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user  = {
      userId: decoded.userId ,
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
/* // בדיקת הרשאות
export const checkPermission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = (req as any).user.permissions || [];
    const hasPermission = permissions.some((perm) => userPermissions.includes(perm));
    if (!hasPermission) {
      return res.status(403).json({ message: 'אין הרשאה' });
    }
    next();
  };
}; */