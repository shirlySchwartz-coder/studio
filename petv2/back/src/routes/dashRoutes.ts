import { NextFunction, Request, Response, Router } from 'express';
import { restrictTo, verifyToken } from '../middleware/auth';
import { addBreed } from '../controllers/dashController';

const dashRouter = Router();

// Example dashboard route
dashRouter.get(
  '/',
  verifyToken,
    async(req:Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Welcome to the Dashboard API' });
  });

dashRouter.post(
  '/add-breed',
  verifyToken,
  restrictTo([1, 2]), // רק מנהלים ומנהלי מערכת יכולים להוסיף גזעים
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await addBreed(req, res, next);
      res.status(201).json({ message: 'Breed added successfully',  result });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });
  

export default dashRouter;