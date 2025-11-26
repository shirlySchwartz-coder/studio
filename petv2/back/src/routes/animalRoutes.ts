import { Router, Request, Response, NextFunction } from 'express';
import { createToken, verifyToken } from '../middleware/auth';
//import { createAnimal, getAnimals, searchAnimals, getMedicalFosterAnimals, getAllTablesInfo, getAllAnimals } from '../controllers/animalController';
import jwt from 'jsonwebtoken'
import { createAnimal, getAllAnimals, getAllTablesInfo,getAnimals ,updateAnimal} from '../controllers/animalController';

const animalRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


// ממשק עבור נתוני המשתמש בטוקן
interface UserPayload {
  id: number;
  full_name: string;
  role_id: number;
}

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
      const animals = await getAnimals(req, res, next);
      res.status(200).json({ animals });
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
          userId: req.user?.id,
          fullName: req.user?.full_name,
          roleId: req.user?.role_id,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(201)
        .header('Access-Control-Request-Headers', 'Authorization')
        .header('Authorization', `Bearer ${newToken}`)
        .json({ message: 'Animal added successfully', animal });
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
      res.status(200)
        .header('Access-Control-Request-Headers', 'Authorization')
        .header('Authorization', `${newToken}`)
        .json({ message: 'Animal updated successfully', updatedAnimal });
    } catch (err: any) {
      next(err);
    }
  } 

)

//table-data
animalRouter.get(
  '/tables-data',
  async ( req: Request, res: Response,next: NextFunction) => {
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