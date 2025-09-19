import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
      console.log('decoded:', authHeader);

    req.user = decoded; // Attach decoded user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err });
  }
};

export const checkRole = (requiredRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role_id) {
      return res.status(403).json({ message: 'Role not found' });
    }

    // Define role mappings (adjust based on your schema)
    const rolePrivileges: { [key: number]: string[] } = {
      1: ['can_view_public_listings','can_post_animals', 'can_view_public_listings'], // Admin
      2: ['can_post_animals', 'can_view_public_listings'], // Shelter
      3: ['can_view_public_listings'], // Adopter
    };

    const userPrivileges = rolePrivileges[req.user.role_id] || [];
    // Add JWT privileges if present
    if (req.user.privileges) {
      Object.keys(req.user.privileges).forEach(priv => userPrivileges.push(priv));
    }

    const hasRole = requiredRoles.some(role => userPrivileges.includes(role));
    if (!hasRole) return res.status(403).json({ message: 'Insufficient permissions' });
    next();
  };
};