import { Shelter } from './../models/Shelter';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../Dal/dal_mysql';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isValidPhone = (phone: string): boolean => {
  // Relaxed validation: allow 7–15 digits (no formatting required)
  const phoneRegex = /^[0-9]{7,15}$/;
  return phoneRegex.test(phone);
};

// הרשמת משתמש חדש
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      full_name,
      email,
      password,
      role_id = 3,
      phone,
      city_id,
    } = req.body;

    if (!isValidEmail(email)) throw new Error('Invalid email format');
    if (!isValidPhone(phone)) throw new Error('Invalid phone number');
    if (password.length < 6)
      throw new Error('Password must be at least 6 characters');

    // Validate role_id (optional: allow only certain roles)
    const validRoles = [1, 2, 3]; // admin, manager, user
    if (!validRoles.includes(role_id)) throw new Error('Invalid role');

    // === CHECK IF USER EXISTS (Parameterized) ===
    const checkSql = `SELECT id FROM users WHERE email = ?`;
    const existingUsers = await db.execute<{ id: number }[]>(checkSql, [email]);
    if (existingUsers.length > 0) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    // === INSERT USER (Parameterized) ===
    const insertSql = `
    INSERT INTO users (full_name, email, password_hash, phone, city_id, role_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    const result = await db.execute<{ insertId: number }>(insertSql, [
      full_name,
      email,
      hashedPassword,
      phone,
      city_id,
      role_id,
    ]);

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H_reg',
        location: 'authController.ts:register',
        message: 'User registered',
        data: { userId: result.insertId, role_id },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return {
      message: 'User registered successfully',
      userId: result.insertId,
    };
  } catch (error: any) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

// התחברות משתמש
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const sql = `SELECT id, full_name, password_hash, role_id , shelter_id FROM users WHERE email = ?`;
  const users = await db.execute<
    {
      id: number;
      full_name: string;
      password_hash: string;
      role_id: number;
      shelter_id: number;
    }[]
  >(sql, [email]);

  if (users.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = users[0];
  const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  if (user.role_id === 2) {
    const shelter = await db.execute(`SELECT id FROM shelters WHERE id = ?`, [
      user.shelter_id,
    ]);
    if (!shelter[0]) throw new Error('Shelter not linked');
  }

  return {
    userId: user.id,
    roleId: user.role_id,
    fullName: user.full_name,
    shelterId: user.shelter_id || null,
  };
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    throw new Error('No token provided');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      roleId: number;
      fullName: string;
      shelterId: number;
    };

    // שאילתת DB לקבלת פרטים טריים (ללא סיסמה)
    const sql = `SELECT id, full_name, role_id, shelter_id FROM users WHERE id = ?`;
    const users = await db.execute<
      {
        id: number;
        full_name: string;
        role_id: number;
        shelter_id: number | null;
      }[]
    >(sql, [decoded.userId]);
    if (users.length === 0) {
      throw new Error('User not found');
    }
    const user = users[0];

    return {
      userId: user.id,
      fullName: user.full_name,
      roleId: user.role_id,
      shelterId: user.shelter_id || null,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};
