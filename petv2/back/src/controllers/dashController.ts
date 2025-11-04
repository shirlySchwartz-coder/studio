import { NextFunction, Request, Response } from 'express';
import db from '../Dal/dal_mysql'

interface UserPayload {
  userId: number;
  fullName:string,
  roleId: number;
}

// הרחבת ממשק Request
interface AuthRequest extends Request {
  user?: UserPayload;
}


export const addBreed = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { name } = req.body || {};

  if (!name) {
    throw new Error('Breed name is required');
  }
  
    const insertSql = `INSERT INTO breed_types (name) VALUES (?)`;
  const result = await db.execute(insertSql, [name]);

  // CHANGE: Return data only
  return {
    message: 'Breed added successfully',
    breedId: result.insertId,
  }
    } catch (error) {
        console.error('Error adding breed:', error);
        throw error;
    }
   
}

export const addShelter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password_hash, phone, city, address } = req.body;
    if (!name || !email || !password_hash || !phone || !city || !address) {
      throw new Error('All shelter fields are required');
    }
    const insertSql = `INSERT INTO shelters (name, email, password_hash, phone, city, address) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await db.execute(insertSql, [name, email, password_hash, phone, city, address]);

    // CHANGE: Return data only
    return {
      message: 'Shelter added successfully',
      shelterId: result.insertId,
    }
  } catch (error) {
    console.error('Error adding shelter:', error);
    throw error;
  }
} 
export const addAnimal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, breed_id, species_id, shelter_id, status_id, gender_id, age_months, size_id, description, is_neutered, is_house_trained, vaccination_status, image_url } = req.body;
    if (!name || !species_id || !gender_id || !size_id) {
   throw new Error('Required fields are missing');
    }
        // וידוא שהמשתמש מאומת
    if (!req.user?.userId || req.user?.roleId > 2) {
          console.log(req.user)
          throw new Error('No permissions to add an animal');
          
        }
  
      const insertSql = `INSERT INTO animals( 
      name, breed_id, species_id, shelter_id, status_id, gender_id,
      age_months, size_id, description, is_neutered, is_house_trained,
      vaccination_status, image_url, created_at, created_by_user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      await db.execute(insertSql, [
        name,
        breed_id || null,
        species_id,
        shelter_id || 1,
        status_id || 1,
        gender_id,
        age_months || null,
        size_id || null,
        description || null,
        is_neutered || false,
        is_house_trained || false,
        vaccination_status || null,
        image_url || null,
        new Date(),
        req.user.userId
      ]);
      
      const animal = {
        name,
        breed_id: breed_id || null,
        species_id,
        shelter_id: shelter_id || 1,
        status_id: status_id || 1,    
        gender_id,
        age_months: age_months || null,
        size_id: size_id || null,
        description: description || null,
        is_neutered: is_neutered || false,
        is_house_trained: is_house_trained || false,
        vaccination_status: vaccination_status || null,
        image_url: image_url || null,
      };
  
      return animal;
    } catch (err: any) {
      console.error('Error creating animal:', err);
      next(err);
    }
  };