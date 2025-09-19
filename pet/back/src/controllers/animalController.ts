import { Request, Response, NextFunction } from 'express';
import db from '../models';
import { checkRole, verifyToken } from '../middleware/auth';

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

/* export const createAnimal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  
  try {
  const animal = await db.Animals.create({
      ...req.body,
      shelter_id: req.user!.id,
    });
    //res.status(201).json(animal);
    return animal;
  } catch (err) {
    next(err);
  }
}; */

export const createAnimal = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    species_id,
    breed,
    gender_id,
    age_months,
    size_id,
    description,
    image_url,
    status_id,
    shelter_id,
    is_neutered,
    is_house_trained,
    vaccination_status,
  } = req.body;

  if (!name || !species_id || !gender_id || !size_id || !status_id || !shelter_id) {
    throw new Error('Missing required fields');
  }

  try {
    const animal = await db.Animals.create({
      name,
      species_id,
      breed,
      gender_id,
      age_months,
      size_id,
      description,
      image_url,
      status_id,
      shelter_id,
      is_neutered,
      is_house_trained,
      vaccination_status,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return animal; // Return the created animal
  } catch (err) {
    throw err; // Propagate errors to the route
  }
};

export const getAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const animals = await db.Animals.findAll({
      //include: ['Species', 'GenderTypes', 'Sizes', 'AnimalStatuses', 'Shelters'],
    });
    return animals;
  } catch (err) {
    throw(err);
  }
};