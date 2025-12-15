import { Router, Request, Response, NextFunction } from 'express';
import { createToken, verifyToken } from '../middleware/auth';
import { AuthRequest, UserPayload } from '../models/UserInfo';
import {
  addFavorite,
  checkIsFavorite,
  getFavoritesCount,
  getUserFavorites,
  removeFavorite,
} from '../controllers/favoriteController';

const favoritesRouter = Router();

// הוספת חיה למועדפים
favoritesRouter.post(
  '/add',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await addFavorite(req, res, next);
      const newToken = createToken(req, res, next);
      res.cookie('token', newToken.replace('Bearer', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);
// הסרת חיה מהמועדפים
favoritesRouter.delete(
  '/:animalId',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await removeFavorite(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת כל המועדפים של המשתמש
favoritesRouter.get(
  '/my-favorites',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const favorites = await getUserFavorites(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(200).json({ favorites });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// בדיקה אם חיה נמצאת במועדפים
favoritesRouter.get(
  '/check/:animalId',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await checkIsFavorite(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת מספר החיות המועדפות
favoritesRouter.get(
  '/count',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await getFavoritesCount(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export default favoritesRouter;
