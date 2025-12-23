import { Router, Request, Response, NextFunction } from 'express';
const animalAttributeRouter = Router();
import { AuthRequest } from '../models/UserInfo';
import { addAnimalAttributes, createAttribute, getAllAttributes, getAllCities, getAnimalAttributes, getAttributesByCategory, getFilterOptions, removeAnimalAttribute, searchAnimals, updateAnimalFilters } from '../controllers/animalAttributeController';
import { verifyToken, restrictTo, createToken } from '../middleware/auth';

// ============================================================================
// PART 1: קבלת אפשרויות פילטרים (פומבי)
// ============================================================================

// קבלת אפשרויות פילטרים מהירים (Energy, Grooming, Housing)
animalAttributeRouter.get(
  '/filter-options',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = await getFilterOptions(req, res, next);
      res.status(200).json({ filter_options: options });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת רשימת ערים (לבניית Dropdown)
animalAttributeRouter.get(
  '/cities',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cities = await getAllCities(req, res, next);
      res.status(200).json({ cities });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);
// ============================================================================
// PART 2: תכונות רב-ערכיות (M:N) - פומבי
// ============================================================================

// קבלת כל התכונות הרב-ערכיות (תאימות, צרכים מיוחדים וכו')
animalAttributeRouter.get(
  '/all',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attributes = await getAllAttributes(req, res, next);
      res.status(200).json({ attributes });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת תכונות מקובצות לפי קטגוריה (פומבי)
animalAttributeRouter.get(
  '/by-category',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await getAttributesByCategory(req, res, next);
      res.status(200).json({ categories });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// קבלת כל התכונות של חיה ספציפית (פומבי)
animalAttributeRouter.get(
  '/animal/:animalId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attributes = await getAnimalAttributes(req, res, next);
      res.status(200).json(attributes);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// ============================================================================
// PART 3: חיפוש מתקדם (פומבי)
// ============================================================================

// חיפוש חיות לפי פילטרים מהירים ומתקדמים
animalAttributeRouter.post(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const animals = await searchAnimals(req, res, next);
      res.status(200).json({ animals, count: animals.length });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

// ============================================================================
// PART 4: ניהול תכונות חיה (מנהלים ואדמינים)
// ============================================================================

// עדכון פילטרים ישירים (Energy, Grooming, Housing)
animalAttributeRouter.put(
  '/animal/:animalId/filters',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await updateAnimalFilters(req, res, next);

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

// הוספת תכונות רב-ערכיות לחיה (תאימות, צרכים מיוחדים וכו')
animalAttributeRouter.post(
  '/animal/:animalId/add',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await addAnimalAttributes(req, res, next);

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

// הסרת תכונה מחיה
animalAttributeRouter.delete(
  '/animal/:animalId/attribute/:attributeId',
  verifyToken,
  restrictTo([1, 2]), // אדמין ומנהל מקלט
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await removeAnimalAttribute(req, res, next);

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

// ============================================================================
// PART 5: ניהול תכונות (אדמינים בלבד)
// ============================================================================

// יצירת תכונה חדשה (אדמינים בלבד)
animalAttributeRouter.post(
  '/create',
  verifyToken,
  restrictTo([1]), // אדמין בלבד
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await createAttribute(req, res, next);

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

export default animalAttributeRouter;
