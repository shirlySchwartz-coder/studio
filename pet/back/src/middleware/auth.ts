import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models'; // Adjust import path to your DB connection

interface UserPayload {
  id: number;
  role_id: number;
  privileges?: { [key: string]: number }; // Optional if not always present in JWT
}

interface AuthRequest extends Request {
  user?: UserPayload; // Make user optional to handle cases where it's not set
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    console.log('token before decode:', token);
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    console.log('decoded:', decodedJwt);

    // Map JWT payload to UserPayload interface
    const decoded: UserPayload = {
      id: decodedJwt.userId ?? decodedJwt.id,
      role_id: decodedJwt.role_id,
      privileges: decodedJwt.privileges,
    };

    req.user = decoded; // Attach decoded user to request

    req.body = req.body; // Attach body to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err });
  }
};

export const checkRole = (requiredRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.body)  return res.status(400).json({ message: 'No request body' });
    if (!req.user || !req.user.role_id) {
      return res.status(403).json({ message: 'Role not found' });
    }

    // Fetch privileges from DB based on role_id

    (async () => {
      try {
      const result = await db.query(
        'SELECT privilege FROM pet_adoption.role_privileges WHERE role_id = $1',
        [req.user?.role_id]
      );
      const userPrivileges: string[] = result.rows.map((row: any) => row.privilege);

      // Add JWT privileges if present
      if (req.user?.privileges) {
        Object.keys(req.user.privileges).forEach(priv => userPrivileges.push(priv));
      }

      const hasRole = requiredRoles.some(role => userPrivileges.includes(role));
      if (!hasRole) return res.status(403).json({ message: 'Insufficient permissions' });
      next();
      } catch (err) {
      return res.status(500).json({ message: 'Error fetching privileges', error: err });
      }
    })();

     const hasRole = requiredRoles.some(role => userPrivileges.includes(role));
    if (!hasRole) return res.status(403).json({ message: 'Insufficient permissions' });
    next(); 
  };
};