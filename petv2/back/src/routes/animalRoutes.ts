import { Router, Request, Response, NextFunction } from 'express';
import { createToken, verifyToken } from '../middleware/auth';
import {
  createAnimal,
  getAllAnimals,
  getAllTablesInfo,
  getAnimalsByShelter,
  updateAnimal,
} from '../controllers/animalController';
import { AuthRequest } from '../models/UserInfo';

const animalRouter = Router();

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

//של עמותה קבלת רשימת כל החיות
animalRouter.get(
  '/list/:shelterId',
  verifyToken,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const animalsFromShelter = await getAnimalsByShelter(req, res, next);

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
      const newToken = createToken(req as any, res, next);
      res.cookie('token', newToken.replace('Bearer ', ''), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      });
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

export default animalRouter;
