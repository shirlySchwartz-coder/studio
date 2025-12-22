import { NextFunction, Request, Response, Router } from 'express';
import { createToken, restrictTo, verifyToken } from '../middleware/auth';
import { AuthRequest } from '../models/UserInfo';
import {
  approveAdoptionRequest,
  createAdoptionRequest,
  getPendingRequestsCount,
  getShelterAdoptionRequests,
  getUserAdoptionRequests,
  rejectAdoptionRequest,
} from '../controllers/adoptionReqController';

const adoptionReqRouter = Router();
// יצירת בקשת אימוץ חדשה (משתמשים רגילים בלבד)
adoptionReqRouter.post(
  '/create',
  verifyToken,
  restrictTo([3]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await createAdoptionRequest(req, res, next);

      // יצירת טוקן חדש
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

// קבלת כל בקשות האימוץ של המשתמש המחובר
adoptionReqRouter.get(
  '/my-requests',
  verifyToken,
  restrictTo([3]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const requests = await getUserAdoptionRequests(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(201).json(requests);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);
// קבלת בקשות אימוץ לפי מקלט (מנהלים ואדמינים)
adoptionReqRouter.get(
  '/shelter/:shelterId',
  verifyToken,
  restrictTo([3]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const requests = await getShelterAdoptionRequests(req, res, next);

      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });

      res.status(201).json(requests);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);
// קבלת ספירת בקשות ממתינות (למנהל מקלט - לתפריט המהיר)
adoptionReqRouter.get(
  '/pending-count',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await getPendingRequestsCount(req, res, next);

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
// אישור בקשת אימוץ (מנהל מקלט)
adoptionReqRouter.put(
  '/:id/approve',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await approveAdoptionRequest(req, res, next);

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

// דחיית בקשת אימוץ (מנהל מקלט)
adoptionReqRouter.put(
  '/:id/reject',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await rejectAdoptionRequest(req, res, next);

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

export default adoptionReqRouter;
