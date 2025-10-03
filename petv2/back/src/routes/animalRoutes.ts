import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middleware/auth';
import { createAnimal, getAnimals, searchAnimals, getMedicalFosterAnimals } from '../controllers/animalController';

const animalRouter = Router();

// קבלת רשימת כל החיות
animalRouter.get(
  '/list',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animals = await getAnimals(req, res, next);
      res.status(200).json({ animals });
    } catch (err: any) {
      next(err);
    }
  }
);

// הוספת חיה חדשה
animalRouter.post(
  '/addNew',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animal = await createAnimal(req.body, res, next);
      res.status(201).json({ message: 'החיה נוספה בהצלחה', animal });
    } catch (err: any) {
      next(err);
    }
  }
);

// חיפוש חיות לפי קריטריונים
animalRouter.post(
  '/search',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animals = await searchAnimals(req.body, res, next);
      res.status(200).json({ animals });
    } catch (err: any) {
      next(err);
    }
  }
);

// קבלת חיות הזקוקות לאומנה רפואית
animalRouter.get(
  '/medical-foster',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animals = await getMedicalFosterAnimals(req, res, next);
      res.status(200).json({ animals });
    } catch (err: any) {
      next(err);
    }
  }
);

export default animalRouter;