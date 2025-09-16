import { Request, Response, NextFunction } from 'express';
import db from '../models';

interface AuthRequest extends Request {
  user?: { id: number; role_id: number; privileges: { [key: string]: number } };
}

interface AnimalBody {
  name: string;
  species_id: number;
  breed?: string;
  gender_id: number;
  age_months?: number;
  size_id?: number;
  description?: string;
  image_url?: string;
  status_id: number;
  is_neutered?: number;
  is_house_trained?: number;
  vaccination_status?: string;
}

export const createAnimal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
  const animal = await db.Animals.create({
      ...req.body,
      shelter_id: req.user!.id,
    });
    res.status(201).json(animal);
  } catch (err) {
    next(err);
  }
};

export const getAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const animals = await db.Animals.findAll({
      include: ['Species', 'GenderTypes', 'Sizes', 'AnimalStatuses', 'Shelters'],
    });
    res.json(animals);
  } catch (err) {
    next(err);
  }
};