import {Request, Response, NextFunction} from 'express';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';

interface RegisterBody {
  full_name: string;
  email: string;
  password: string;
  role_id: number;
  phone?: string;
  city?: string;
}

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password, role_id, phone, city } = req.body;
    const hashedPassword = await bycrypt.hash(password, 10);
    
  const existingUser = await db.Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

  const user = await db.Users.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role_id,
      phone: phone || null  ,
      city: city || null,
    });
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
  const user = await db.Users.findOne({ 
    where: { email },
    include: [{model: db.Roles, include:[ { model: db.RolePrivileges }] }] });
    if (!user || !(await bycrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const privileges = user.Role?.RolePrivilege ;
    const jwtSecret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
      { userId: user.id, role: user.Role?.name, privileges },
      jwtSecret,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};


export const logout = (req: Request, res: Response) => {
  // For JWT, logout is handled on the client side by discarding the token.
  res.json({ message: 'Logout successful on client side by discarding the token' });
}