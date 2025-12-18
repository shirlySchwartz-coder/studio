import { Shelter } from './../models/Shelter';
import { Request, Response, NextFunction } from 'express';
import db from '../Dal/dal_mysql';
import { Animal } from '../models/Animal';
import { AuthRequest } from '../models/UserInfo';
import fs from 'fs';
import path from 'path';

// קבלת כל החיות - אורח דף הבית
export const getAllAnimals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT A.id, A.name, Sp.name As species,
      G.name As gender, Sz.name As size, Slt.name As shelter, Ans.name As status,
      A.age, A.is_neutered, A.is_house_trained, A.vaccination_status,
      B.name As breed, A.description,
      COALESCE(
        (SELECT JSON_ARRAYAGG(Am.media_url) 
         FROM animal_media Am 
         WHERE Am.animal_id = A.id),
        JSON_ARRAY()
      ) AS images
      FROM pet_adoption.animals As A 
      INNER JOIN pet_adoption.species As Sp ON A.species_id = Sp.id
      INNER JOIN gender_types As G ON A.gender_id = G.id
      INNER JOIN sizes As Sz ON A.size_id = Sz.id
      INNER JOIN shelters As Slt ON A.shelter_id = Slt.id
      INNER JOIN animal_statuses As Ans ON A.status_id = Ans.id
      INNER JOIN breed_types As B ON A.breed_id = B.id`;

    const animals = await db.execute(sql);
    console.log('Fetched all animals:', animals);
    return animals;
  } catch (error: any) {
    throw new Error('Error loading animals');
  }
};

///////עמותות בלבד///////
//לפי עמותה קבלת כל החיות
export const getAnimalsByShelter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const shelterId = req.params?.shelterId;
    if (!shelterId) {
      throw new Error('Shelter ID not found for the user');
    }
    let sql = `SELECT A.id, A.name,  Sp.name As species,
      G.name As gender , Sz.name As size, Slt.name As shelter, Ans.name As status,
      A.age,  A.is_neutered, A.is_house_trained, A.vaccination_status,
      B.name As breed, A.description,
      COALESCE(
        (SELECT JSON_ARRAYAGG(Am.media_url) 
         FROM animal_media Am 
         WHERE Am.animal_id = A.id),
        JSON_ARRAY()
      ) AS images
      FROM pet_adoption.animals As A
      INNER JOIN pet_adoption.species As Sp ON A.species_id = Sp.id
      INNER JOIN gender_types As G ON A.gender_id = G.id
      INNER JOIN sizes As Sz ON A.size_id = Sz.id
      INNER JOIN shelters As Slt ON A.shelter_id = Slt.id
      INNER JOIN animal_statuses As Ans ON A.status_id = Ans.id
      INNER JOIN breed_types As B ON A.breed_id = B.id
      WHERE shelter_id = ?`;

    const animals = await db.execute<{ animals: Animal[] }>(sql, [shelterId]);
    console.log(`Fetched animals for shelter ${shelterId}:`, animals);
    return animals;
  } catch (error: any) {
    throw new Error('Error loading animals');
  }
};

// יצירת חיה חדשה
export const createAnimal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // וידוא שהמשתמש מאומת
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to add an animal');
    }

    const {
      name,
      breed_id,
      species_id,
      status_id,
      gender_id,
      age,
      size_id,
      description,
      is_neutered,
      is_house_trained,
      vaccination_status,
      mediaTemps,
    } = req.body;

    if (!name || !species_id || !gender_id || !size_id) {
      throw new Error('Required fields are missing');
    }

    // Use shelter_id from req.user, not from req.body
    const shelter_id = req.user.shelterId || 0;
    const user_id = req.user.userId;

    const insertSql = `INSERT INTO animals( 
    name, breed_id, species_id, shelter_id, status_id, gender_id, age, 
    size_id, description, is_neutered, is_house_trained,
     vaccination_status, created_at, created_by_user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;

    const result = await db.execute(insertSql, [
      name,
      breed_id,
      species_id,
      shelter_id,
      status_id,
      gender_id,
      age,
      size_id,
      description,
      is_neutered,
      is_house_trained,
      vaccination_status,
      new Date(),
      user_id,
    ]);

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'B4_createAnimal_dbResult',
        location: 'animalController.ts:createAnimal',
        message: 'Result from db.execute insert for animal',
        data: {
          resultType: typeof result,
          isArray: Array.isArray(result as any),
          keys: result ? Object.keys(result as any) : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (!result || !(result as any).insertId) {
      console.error('Error creating animal:', result);
      throw new Error('Error creating animal');
    }
    const animalId = (result as any).insertId; // Get new ID
    // Handle media temps
    if (mediaTemps && Array.isArray(mediaTemps) && mediaTemps.length > 0) {
      for (const media of mediaTemps) {
        const tempDir = path.join(
          __dirname,
          '../../public/uploads/shelters',
          shelter_id.toString(),
          'temp',
          media.tempId
        );
        const tempFilePath = path.join(tempDir, media.filename); // Full path to file

        if (fs.existsSync(tempFilePath)) {
          const newDir = path.join(
            __dirname,
            '../../public/uploads/shelters',
            shelter_id.toString(),
            'animals',
            animalId.toString()
          );
          if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
          }
          const newPath = path.join(newDir, media.filename);
          fs.renameSync(tempFilePath, newPath); // Move the file

          // Optional: Delete empty temp folder
          if (fs.readdirSync(tempDir).length === 0) {
            fs.rmdirSync(tempDir);
          }

          const newUrl = `${req.protocol}://${req.get(
            'host'
          )}/uploads/shelters/${shelter_id}/animals/${animalId}/${
            media.filename
          }`;

          await db.execute(
            'INSERT INTO animal_media (animal_id, media_type, media_url, media_title, is_primary, uploaded_at, uploaded_by_user_id) VALUES (?, "image", ?, ?, ?, NOW(), ?)',
            [
              animalId,
              newUrl,
              media.alt_text || 'Animal image',
              media.is_primary ? 1 : 0,
              user_id,
            ]
          );
        } else {
          console.warn(`Temp file not found: ${tempFilePath}`);
        }
      }
    }
    return {
      message: 'Animal created successfully',
      animalId,
    };
  } catch (err: any) {
    console.error('Error creating animal:', err);
    throw new Error('Error creating animal');
  }
};

// עדכון חיה קיימת
export const updateAnimal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      id,
      name,
      breed_id,
      species_id,
      shelter_id,
      status_id,
      gender_id,
      age,
      size_id,
      description,
      is_neutered,
      is_house_trained,
      vaccination_status,
      image_url,
      user_id,
    } = req.body;
    if (!id || !name || !species_id || !gender_id || !size_id) {
      throw new Error('Required fields are missing');
    }
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to update an animal');
    }
    const updates = [];
    const values = [];
    updates.push('updated_at = NOW(), updated_by_user_id = ?');
    values.push(user_id);

    const updateSql = `UPDATE animals SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await db.execute(updateSql, values);
    if (!result || !(result as any).affectedRows) {
      throw new Error('Error updating animal');
    }
    return { message: 'Animal updated successfully' };
  } catch (err: any) {
    throw new Error('Error updating animal');
  }
};

//Tables data
// Get all sizes
export const getAllSizes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT id, name FROM pet_adoption.sizes
order by id ASC	`;
    const sizes = await db.execute(sql);
    return sizes;
  } catch (error: any) {
    console.error('❌ Error fetching sizes:', error);
    throw new Error('Failed to fetch sizes');
  }
};

// Get all genders
export const getAllGenders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT id, name FROM pet_adoption.gender_types
order by id ASC	`;
    const genders = await db.execute(sql);
    return genders;
  } catch (error: any) {
    console.error('❌ Error fetching genders:', error);
    throw new Error('Failed to fetch genders');
  }
};
// Get all Species
export const getAllSpecies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT id, name FROM pet_adoption.species
order by id ASC	`;
    const species = await db.execute(sql);
    return species;
  } catch (error: any) {
    console.error('❌ Error fetching species:', error);
    throw new Error('Failed to fetch species');
  }
};
// Get all Statuses
export const getAllStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT id, name FROM pet_adoption.animal_statuses
order by id ASC	`;
    const statuses = await db.execute(sql);
    return statuses;
  } catch (error: any) {
    console.error('❌ Error fetching statuses:', error);
    throw new Error('Failed to fetch statuses');
  }
};
// Get all Shelters
export const getAllShelters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT id, name FROM pet_adoption.shelters
order by id ASC	`;
    const shelters = await db.execute(sql);
    return shelters;
  } catch (error: any) {
    console.error('❌ Error fetching shelters:', error);
    throw new Error('Failed to fetch shelters');
  }
};
// Get all Breeds
export const getAllBreeds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT id, name FROM pet_adoption.breed_types
order by id ASC	`;

    const breeds = await db.execute(sql);
    return breeds;
  } catch (error: any) {
    console.error('❌ Error fetching breeds:', error);
    throw new Error('Failed to fetch breeds');
  }
};

// Get all Cities
export const getAllCities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql = `SELECT id, name FROM pet_adoption.cities
order by name ASC	`;
    const cities = await db.execute(sql);
    return cities;
  } catch (error: any) {
    console.error('❌ Error fetching cities:', error);
    throw new Error('Failed to fetch cities');
  }
};

// Get all filter options (from animal_attributes)
export const getAllFilterOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sql = `
      SELECT 
        id,
        category,
        name,
        description,
        display_order
      FROM animal_attributes
      ORDER BY category, display_order, name
    `;
    const filterOptions = await db.execute(sql);
    return filterOptions;
  } catch (error: any) {
    console.error('❌ Error fetching filter options:', error);
    throw new Error('Failed to fetch filter options');
  }
};

export const getAllTablesInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sizes: [] = await getAllSizes(req, res, next);
    const genders: [] = await getAllGenders(req, res, next);
    const species: [] = await getAllSpecies(req, res, next);
    const statuses: [] = await getAllStatuses(req, res, next);
    const shelters: [] = await getAllShelters(req, res, next);
    const breeds: [] = await getAllBreeds(req, res, next);
    const cities: [] = await getAllCities(req, res, next);
    const filterOptions: [] = await getAllFilterOptions(req, res, next);

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H_tables',
        location: 'animalController.ts:getAllTablesInfo',
        message: 'tables-data keys',
        data: {
          sizes: Array.isArray(sizes) ? sizes.length : null,
          genders: Array.isArray(genders) ? genders.length : null,
          species: Array.isArray(species) ? species.length : null,
          statuses: Array.isArray(statuses) ? statuses.length : null,
          shelters: Array.isArray(shelters) ? shelters.length : null,
          breeds: Array.isArray(breeds) ? breeds.length : null,
          cities: Array.isArray(cities) ? cities.length : null,
          filterOptions: Array.isArray(filterOptions)
            ? filterOptions.length
            : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return {
      genders: genders,
      sizes: sizes,
      species: species,
      statuses: statuses,
      shelters: shelters,
      breeds: breeds,
      cities: cities,
      filterOptions: filterOptions,
    };
  } catch (error) {
    console.error('❌ Error fetching data from tables:', error);
    throw new Error('Failed to fetch data');
  }
};
