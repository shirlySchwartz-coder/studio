import { Router, NextFunction, Request, Response } from "express";
import { verifyToken, restrictTo, createToken } from "../middleware/auth";
import { AuthRequest } from "../models/UserInfo";
import { addAnimalMedia, getAnimalMedia, getPrimaryMedia, setPrimaryMedia, deleteMedia } from "./animalMediaController";

const animalMediaRouter = Router();

// הוספת מדיה לחיה (מנהלים ואדמינים)
animalMediaRouter.post(
  '/:animalId/add',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await addAnimalMedia(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת כל המדיה של חיה (פומבי)
animalMediaRouter.get(
  '/:animalId',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const media = await getAnimalMedia(req, res, next);
      res.status(200).json({ media });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת התמונה הראשית של חיה (פומבי)
animalMediaRouter.get(
  '/:animalId/primary',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const media = await getPrimaryMedia(req, res, next);
      res.status(200).json({ media });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// הגדרת מדיה כראשית (מנהלים ואדמינים)
animalMediaRouter.put(
  '/media/:mediaId/set-primary',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await setPrimaryMedia(req, res, next);

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

// מחיקת מדיה (מנהלים ואדמינים)
animalMediaRouter.delete(
  '/media/:mediaId',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await deleteMedia(req, res, next);

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

export default animalMediaRouter;