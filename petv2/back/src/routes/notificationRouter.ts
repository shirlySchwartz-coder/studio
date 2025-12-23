import { Router, NextFunction, Request, Response } from "express";
import { getUserNotifications, getUnreadCount, deleteNotification, getNotificationsByType, markAllAsRead, markAsRead } from "../controllers/notificationController";
import { verifyToken, createToken } from "../middleware/auth";
import { AuthRequest } from "../models/UserInfo";

const notificationRouter = Router();

// קבלת כל ההתראות של המשתמש
notificationRouter.get(
  '/',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await getUserNotifications(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(200).json({ notifications });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת מספר ההתראות שלא נקראו (למציג התג באתר)
notificationRouter.get(
  '/unread-count',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await getUnreadCount(req, res, next);

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
// סימון התראה ספציפית כנקראה
notificationRouter.put(
  '/:id/mark-read',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await markAsRead(req, res, next);

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

// סימון כל ההתראות כנקראו
notificationRouter.put(
  '/mark-all-read',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await markAllAsRead(req, res, next);

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

// מחיקת התראה
notificationRouter.delete(
  '/:id',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await deleteNotification(req, res, next);

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

// קבלת התראות לפי סוג
notificationRouter.get(
  '/type/:type',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await getNotificationsByType(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(200).json({ notifications });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export default notificationRouter;