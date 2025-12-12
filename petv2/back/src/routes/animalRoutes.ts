import { Router, Request, Response, NextFunction } from 'express';
import { createToken, verifyToken } from '../middleware/auth';
//import { createAnimal, getAnimals, searchAnimals, getMedicalFosterAnimals, getAllTablesInfo, getAllAnimals } from '../controllers/animalController';
import jwt from 'jsonwebtoken';
import {
  createAnimal,
  getAllAnimals,
  getAllTablesInfo,
  getAnimalsByShelter,
  updateAnimal,
} from '../controllers/animalController';
import { UserPayload } from '../models/userInfo';

const animalRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ממשק עבור נתוני המשתמש בטוקן

// הרחבת ממשק Request
interface AuthRequest extends Request {
  user?: UserPayload;
}

//דף הבית קבלת רשימת כל החיות
animalRouter.get(
  '/listAll',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animals = await getAllAnimals(req, res, next);
      res.status(200).json({ animals });
    } catch (err: any) {
      next(err);
    }
  }
);

//של עמותה קבלת רשימת כל החיות
animalRouter.get(
  '/list/:shelterId',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const animalsFromShelter = await getAnimalsByShelter(req, res, next);

      if (req.user) {
        const newToken = jwt.sign(
          {
            userId: req.user.userId,
            fullName: req.user.fullName,
            roleId: req.user.roleId,
            shelterId: req.user.shelterId,
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
      }
      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });
      console.log(
        `There is anser for animals from ${req.user?.fullName} are: ${animalsFromShelter} `
      );
      res.status(200).json({ animalsFromShelter });
    } catch (err: any) {
      next(err);
    }
  }
);

// הוספת חיה חדשה
animalRouter.post(
  '/addAnimal',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('route add:', req.body, 'user:', req.user);
      const animal = await createAnimal(req, res, next);
      // יצירת טוקן חדש
      const newToken = jwt.sign(
        {
          userId: req.user?.userId,
          fullName: req.user?.fullName,
          roleId: req.user?.roleId,
          shelterId: req.user?.shelterId,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(201).json({ message: 'Animal added successfully', animal });
    } catch (err: any) {
      next(err);
    }
  }
);

//עידכון חיה קיימת
animalRouter.put(
  '/updateAnimal/:id',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const updatedAnimal = await updateAnimal(req, res, next);
      let newToken = createToken(req as any, res, next);
      res
        .status(200)
        .json({ message: 'Animal updated successfully', updatedAnimal });
    } catch (err: any) {
      next(err);
    }
  }
);

//table-data
animalRouter.get(
  '/tables-data',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tablesData = await getAllTablesInfo(req, res, next);
      res.status(200).json({ tablesData });
    } catch (err: any) {
      next(err);
    }
  }
);

export default animalRouter;

/*
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

*/
