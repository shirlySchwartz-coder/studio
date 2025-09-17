import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
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
interface LoginBody {
  email: string;
  password: string;
}

export const register = async (req: Request<{}, {}, RegisterBody>, _res: Response, _next: NextFunction) => {
  const { full_name, email, password, role_id, phone, city } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.Users.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = await db.Users.create({
    full_name,
    email,
    password_hash: hashedPassword,
    role_id,
    phone: phone || null,
    city: city || null,
  });

  return { message: 'User registered successfully', userId: user.id };
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body;
  //console.log('start login:', req.body);

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await db.Users.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, role_id: user.role_id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  console.log(user.full_name, 'logged in successfully');
  return { jwt: token, userId: user.id, role_id: user.role_id, full_name: user.full_name };
};

export const logout = (_req: Request, _res: Response) => {
  return { message: 'Logout successful on client side by discarding the token' };
};