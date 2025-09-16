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

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password, role_id, phone, city } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
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


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //console.log("start login:",req.body)

  try {
    // Find user by email
  const user = await db.Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash); // This might be the issue
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role_id: user.role_id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  // For JWT, logout is handled on the client side by discarding the token.
  res.json({ message: 'Logout successful on client side by discarding the token' });
}