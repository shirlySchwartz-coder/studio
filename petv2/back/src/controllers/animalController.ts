import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import Animals from '../models/Animals';
import AnimalMedicalEvents from '../models/AnimalMedicalEvents';
import db from '../models'
// קבלת כל החיות
export const getAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const animals = await db.Animals.findAll();
    return animals;
  } catch (error: any) {
    throw new Error('שגיאה בטעינת חיות');
  }
};

// הוספת חיה חדשה
export const createAnimal = async (animalData: any, res: Response, next: NextFunction) => {
  try {
    const animal = await db.Animals.create(animalData);
    return animal;
  } catch (error: any) {
    throw new Error('שגיאה בהוספת חיה');
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