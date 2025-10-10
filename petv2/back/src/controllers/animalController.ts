import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import AnimalMedicalEvents from '../models/AnimalMedicalEvents';
import db from '../models';
import Animal from '../models/Animals'

// ממשק עבור נתוני המשתמש
interface UserPayload {
  id: number;
  role_id: number;
}

// הרחבת ממשק Request
interface AuthRequest extends Request {
  user?: UserPayload;
}

// קבלת כל החיות
export const getAnimals = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const animals = await db.Animals.findAll();
    return animals;
  } catch (error: any) {
    throw new Error('שגיאה בטעינת חיות');
  }
};

// יצירת חיה חדשה
export const createAnimal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
     const { name, breed, species_id, status_id, shelter_id, gender_id, age_months, size_id, description, is_neutered, is_house_trained, vaccination_status, image_url } = req.body;
  if (!name || !species_id || !gender_id || !size_id || !status_id || !shelter_id) {
    throw new Error('Missing required fields');
  }
    // וידוא שהמשתמש מאומת
    if (!req.user) {
      throw new Error( 'משתמש לא מאומת' );
    }

    // יצירת החיה במסד הנתונים
    // הנח שהעלאת הקובץ מתבצעת לפני קריאת הפונקציה הזו והמידע נשמר ב-req.file
    // לדוג' אם השתמשת ב-multer, הנתיב לקובץ יהיה ב-req.file.path או req.file.location (אם S3)
    const image_url_path = req.file?.filename || req.file?.path || '';

    const animal = await db.Animals.create({
      id:0,
      name:name,
      species_id:species_id,
      breed:breed || null,
      gender_id:gender_id,
      age_months:age_months||null,
      size_id:size_id ||null,
      description:description||null,
      image_url : image_url_path || null,
      status_id:status_id,
      shelter_id:shelter_id,
      is_neutered:is_neutered,
      is_house_trained:is_house_trained,
      vaccination_status:vaccination_status,
      created_at: new Date(),
      created_by: req.user.id, // שמירת מזהה המשתמש שיצר את החיה
    });

    return animal;
  } catch (err: any) {
    console.error('שגיאה ביצירת חיה:', err);
    next(err);
  }
};

// חיפוש חיות לפי קריטריונים
export const searchAnimals = async (filters: any, res: Response, next: NextFunction) => {
  try {
    const where: any = {};
    if (filters.species_id) where.species_id = filters.species_id;
    if (filters.gender_id) where.gender_id = filters.gender_id;
    if (filters.size_id) where.size_id = filters.size_id;
    if (filters.is_neutered !== undefined) where.is_neutered = filters.is_neutered;
    if (filters.vaccination_status) where.vaccination_status = { [Op.like]: `%${filters.vaccination_status}%` };

    const animals = await db.Animals.findAll({ where });
    return animals;
  } catch (error: any) {
    throw new Error('שגיאה בחיפוש חיות');
  }
};

// קבלת חיות הזקוקות לאומנה רפואית
export const getMedicalFosterAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const animals = await db.Animals.findAll({
      include: [
        {
          model: AnimalMedicalEvents,
          where: { needs: { [Op.ne]: null } },
          required: true,
        },
      ],
    });
    return animals.map((animal: any) => ({
      ...animal.dataValues,
      medical_needs: animal.AnimalMedicalEvents[0].needs,
    }));
  } catch (error: any) {
    throw new Error('שגיאה בטעינת חיות הזקוקות לאומנה רפואית');
  }
};