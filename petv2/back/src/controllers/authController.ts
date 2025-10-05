import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// הרשמת משתמש חדש
export const register = async (req: Request, res: Response, next: NextFunction) => {
  
  const { full_name, email, password,role_id, phone, city } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  //console.log('register input :', req.body);
    const existingUser = await db.Users.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }
try {
    const result = await db.Users.create({
      full_name,
      email,
      password_hash: hashedPassword,
      phone,
      city,
      role_id ,
    });
//console.log('user',result)
   res.status(201).json({
     message: 'User registered successfully',
     userId: result.id
    }); 
  } catch (error: any) {
    next(error);
  }
};

// התחברות משתמש
export const login = async (req: Request, res: Response, next: NextFunction) => {
  
    const { email, password } = req.body;
  console.log('login input :', req.body);
  
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

    const user = await db.Users.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid Email or password' );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      throw new Error('Invalid Email or password');
    }
       
  const token = jwt.sign({
    userId: user.id,
    full_name:user.full_name,
    roleId: user.role_id
  }, JWT_SECRET, { expiresIn: '1h' });

  console.log(user.full_name, 'logged in successfully', 'token:', token);
  
  return {
    token: token,
    userId: user.id,
    roleId: user.role,
    full_name:user.full_name
  }
};