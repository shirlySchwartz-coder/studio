import { Shelter } from './../models/Shelter';
import { Request, Response, NextFunction } from 'express';
//import AnimalMedicalEvents from '../models/AnimalMedicalEvents';
import db from '../Dal/dal_mysql';


// ממשק עבור נתוני המשתמש
interface UserPayload {
  id: number;
  full_name:string,
  role_id: number;
  shelter_id?: number;
}

// הרחבת ממשק Request
interface AuthRequest extends Request {
  user?: UserPayload;
}

// קבלת כל החיות - אורח דף הבית
export const getAllAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let sql =`SELECT A.id, A.name,  Sp.name As species,
      G.name As gender , Sz.name As size, Slt.name As shelter, Ans.name As status,
      A.age,  A.is_neutered, A.is_house_trained, A.vaccination_status,
      B.name As breed, A.description, A.image_url
      FROM pet_adoption.animals As A 
      inner join pet_adoption.species As Sp
      on A.species_id = Sp.id
      inner join gender_types As G
      on A.gender_id= G.id
      inner join sizes As Sz
      on A.size_id = Sz.id
      inner join shelters As Slt
      on A.shelter_id= Slt.id
      inner join animal_statuses As Ans
      on A.status_id = Ans.id
      inner join breed_types As B
      on A.breed_id = B.id`
   
  const animals = await db.execute(sql);
      return animals;

  } catch (error: any) {
    throw new Error('Error loading animals');
  }
};


//לפי עמותה קבלת כל החיות
export const getAnimals = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if(req.user?.role_id!>2){
      throw new Error('No permissions to view animals');
    }

    const shelterId = req.user?.shelter_id;
    if (!shelterId) {
      throw new Error('Shelter ID not found for the user');
    }
    let sql =`SELECT A.id, A.name,  Sp.name As species,
      G.name As gender , Sz.name As size, Slt.name As shelter, Ans.name As status,
      A.age,  A.is_neutered, A.is_house_trained, A.vaccination_status,
      B.name As breed, A.description, A.image_url
      FROM pet_adoption.animals As A 
      inner join pet_adoption.species As Sp
      on A.species_id = Sp.id
      inner join gender_types As G
      on A.gender_id= G.id
      inner join sizes As Sz
      on A.size_id = Sz.id
      inner join shelters As Slt
      on A.shelter_id= Slt.id
      inner join animal_statuses As Ans
      on A.status_id = Ans.id
      inner join breed_types As B
      on A.breed_id = B.id
      Where shelter_id=${shelterId}`
   
  const animals = await db.execute(sql);
      return animals;
  } catch (error: any) {
    throw new Error('Error loading animals');
  }
};

// יצירת חיה חדשה
export const createAnimal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
     const { name, breed_id, species_id,  shelter_id,status_id, gender_id, age, size_id, description, is_neutered, is_house_trained, vaccination_status, image_url } = req.body;
    
    if (!name || !species_id || !gender_id || !size_id) {
    throw new Error('Required fields are missing');
  }
      // וידוא שהמשתמש מאומת
      if (!req.user || req.user.role_id>2) {
        throw new Error( 'No permissions to add an animal' );
      }

    const insertSql = `INSERT INTO animals( 
    name, breed_id, species_id, shelter_id, status_id, gender_id, age, size_id, description, is_neutered, is_house_trained,
     vaccination_status, image_url, created_at, created_by_user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.execute(insertSql, [
      name,
      breed_id || null,
      species_id,
      shelter_id || 1,
      status_id || 1,
      gender_id,
      age || null,
      size_id || null,
      description || null,
      is_neutered || false,
      is_house_trained || false,
      vaccination_status || null,
      image_url || null,
      new Date(),
      req.user.id // שמירת מזהה המשתמש שיצר את החיה
    ]);
    // יצירת האובייקט של החיה להחזרה
    const animal = {
      name,
      breed_id: breed_id || null,
      species_id,
      shelter_id: shelter_id || 1,
      status_id: status_id || 1,    
      gender_id,
      age: age || null,
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
// עדכון חיה קיימת
export const updateAnimal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const animalId = parseInt(req.params.id);
    if(isNaN(animalId)) {
      throw new Error('Invalid animal ID');
    }
     if (!req.user || req.user.role_id > 2) {
      throw new Error('אין הרשאה לעדכון חיה');
    }
    const body = req.body;
    const params = {
      name: body.name || null,
      breed_id: body.breed_id || null,
      species_id: body.species_id || null,
      shelter_id: body.shelter_id || null, // קבוע למקלט – אל תשנה אם לא צריך
      status_id: body.status_id || null,
      gender_id: body.gender_id || null,
      age: body.age || null,
      size_id: body.size_id || null,
      description: body.description || null,
      is_neutered: body.is_neutered ?? null,
      is_house_trained: body.is_house_trained ?? null,
      vaccination_status: body.vaccination_status || null,
      image_url: body.image_url || null,
      user_id: req.user.id, 
    };
  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }
    updates.push('updated_at = NOW(), updated_by_user_id = ?');
    values.push(req.user.id);

    if (updates.length === 0) return ({ message: 'אין שינויים לעדכון' });

    const updateSql = `UPDATE animals SET ${updates.join(', ')} WHERE id = ?`;
    values.push(animalId);

    console.log('🔧 SQL עדכון:', updateSql);
    console.log('📊 פרמטרים נקיים:', values); // לוג לבדיקה

    const [result] = await db.execute(updateSql, values);
    if( (result as any).affectedRows === 0 ) {
      throw new Error('Animal not found or no changes made');
    }
    console.log(result)

   
    return  { message: 'Animal updated successfully' };
  } catch (err: any) {
    console.error('Error updating animal:', err);
    next(err);
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
    let sql =`SELECT id, name FROM pet_adoption.sizes
order by id ASC	`
    const sizes = await db.execute( sql );
    return sizes;
  } catch (error: any) {
    console.error('❌ Error fetching sizes:', error);
    throw new Error('Failed to fetch sizes');
  }
} 


// Get all genders
export const getAllGenders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql =`SELECT id, name FROM pet_adoption.gender_types
order by id ASC	`
    const genders = await db.execute( sql );
    return genders;
  } catch (error: any) {
    console.error('❌ Error fetching genders:', error);
    throw new Error('Failed to fetch genders');
  }
} 
// Get all Species
export const getAllSpecies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql =`SELECT id, name FROM pet_adoption.species
order by id ASC	`
    const species = await db.execute( sql );
    return species;
  } catch (error: any) {
    console.error('❌ Error fetching species:', error);
    throw new Error('Failed to fetch species');
  }
}
// Get all Statuses
export const getAllStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
     let sql =`SELECT id, name FROM pet_adoption.animal_statuses
order by id ASC	`
    const statuses = await db.execute(sql);
    return statuses;
  } catch (error: any) {
    console.error('❌ Error fetching statuses:', error);
    throw new Error('Failed to fetch statuses');
  }
} 
// Get all Shelters
export const getAllShelters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sql =`SELECT id, name FROM pet_adoption.shelters
order by id ASC	`
    const shelters = await db.execute(sql);
    return shelters;
  } catch (error: any) {
    console.error('❌ Error fetching shelters:', error);
    throw new Error('Failed to fetch shelters');
  }
}  
// Get all Breeds
export const getAllBreeds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
let sql =`SELECT id, name FROM pet_adoption.breed_types
order by id ASC	`
    
    const breeds = await db.execute(sql);
    return breeds;
  } catch (error: any) {
    console.error('❌ Error fetching breeds:', error);
    throw new Error('Failed to fetch breeds');
  }
} 

export const getAllTablesInfo = async (
  req: Request,
  res: Response,
  next:NextFunction
) => {
  try {
    const sizes: [] = await getAllSizes(req, res, next);
    const genders: [] = await getAllGenders(req, res, next);
    const species: [] = await getAllSpecies(req, res, next);
    const statuses: [] = await getAllStatuses(req, res, next);
    const shelters: [] = await getAllShelters(req, res, next);
       const breeds: [] = await getAllBreeds(req, res, next);
    return {
    genders: genders,
    sizes: sizes,
    species: species,
    statuses: statuses,
      shelters: shelters,
      breeds: breeds
    };
  } catch (error) {
     console.error('❌ Error fetching data from tables:', error);
    throw new Error('Failed to fetch data');
  }
}

/*
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
    throw new Error('Animal search error');
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
    throw new Error('Error loading animals in need of medical care');
  }
};
//*/