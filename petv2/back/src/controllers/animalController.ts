import { Request, Response, NextFunction } from 'express';
import { Op, QueryTypes } from 'sequelize';
import AnimalMedicalEvents from '../models/AnimalMedicalEvents';
import db from '../models';



// ממשק עבור נתוני המשתמש
interface UserPayload {
  id: number;
  full_name:string,
  role_id: number;
}

// הרחבת ממשק Request
interface AuthRequest extends Request {
  user?: UserPayload;
}

// קבלת כל החיות - אורח דף הבית
export const getAllAnimals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //this dosent work with associations
    /*const animals = await db.sequelize.query(
      `SELECT A.id, A.name,  Sp.name As species,
      G.name As gender , Sz.name As size, Slt.name As shelter, Ans.name As status,
      A.age_months,  A.is_neutered, A.is_house_trained, A.vaccination_status,
      A.breed, A.description, A.image_url
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
      on A.status_id = Ans.id`,
      { type: QueryTypes.SELECT }
    );
    // This works but dosent return the names from associations
    //const animals = await db.Animals.findAll();
    
    return animals;*/
 const animals = await db.sequelize.query(
      `SELECT 
        A.id, 
        A.name, 
        A.age_months, 
        A.is_neutered, 
        A.is_house_trained, 
        A.vaccination_status,
        A.breed, 
        A.description, 
        A.image_url,
        Sp.name AS species_name,
        G.name AS gender_name, 
        Sz.name AS size_name, 
        Slt.name AS shelter_name, 
        Ans.name AS status_name
      FROM animals AS A
      INNER JOIN species AS Sp ON A.species_id = Sp.id
      INNER JOIN gender_types AS G ON A.gender_id = G.id
      INNER JOIN sizes AS Sz ON A.size_id = Sz.id
      INNER JOIN shelters AS Slt ON A.shelter_id = Slt.id
      INNER JOIN animal_statuses AS Ans ON A.status_id = Ans.id`,
      { type: QueryTypes.SELECT }
    );
    
    // Transform to match your frontend expectations
    const transformedAnimals = animals.map((animal: any) => ({
      ...animal,
      species: { name: animal.species_name },
      gender: { name: animal.gender_name },
      size: { name: animal.size_name },
      shelter: { name: animal.shelter_name },
      status: { name: animal.status_name }
    }));
    
    return transformedAnimals;

  } catch (error: any) {
    throw new Error('Error loading animals');
  }
};
// קבלת כל החיות
export const getAnimals = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const animals = await db.Animals.findAll();
    return animals;
  } catch (error: any) {
    throw new Error('Error loading animals');
  }
};

// יצירת חיה חדשה
export const createAnimal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
     const { name, breed, species_id,  shelter_id,status_id, gender_id, age_months, size_id, description, is_neutered, is_house_trained, vaccination_status, image_url } = req.body;
  if (!name || !species_id || !gender_id || !size_id ) {
    throw new Error('Required fields are missing');
  }
    // וידוא שהמשתמש מאומת
    if (!req.user || req.user.role_id>2) {
      throw new Error( 'No permissions to add an animal' );
    }

    
    const animal = await db.Animals.create({
      id:0,
      name:name,
      species_id:species_id,
      breed:breed || null,
      gender_id:gender_id,
      age_months:age_months||null,
      size_id:size_id ||null,
      description:description||null,
      image_url :image_url,
      status_id:status_id ||1,
      shelter_id:shelter_id||1,
      is_neutered:is_neutered ||false,
      is_house_trained:is_house_trained||false,
      vaccination_status:vaccination_status||null,
      created_at: new Date(),
      created_by: req.user.id, // שמירת מזהה המשתמש שיצר את החיה
    });

    return animal;
  } catch (err: any) {
    console.error('Error creating animal:', err);
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
//
//Tables data
// Get all sizes
export const getAllSizes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sizes = await db.Sizes.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']]
    });
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
    const genders = await db.GenderTypes.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']]
    });
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
    const species = await db.Species.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']]
    });
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
    const statuses = await db.AnimalStatuses.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']]
    });
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
    const shelters = await db.Shelters.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']]
    });
    return shelters;
  } catch (error: any) {
    console.error('❌ Error fetching shelters:', error);
    throw new Error('Failed to fetch shelters');
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
    return {
    genders: genders,
    sizes: sizes,
    species: species,
    statuses: statuses,
    shelters: shelters,
    };
  } catch (error) {
     console.error('❌ Error fetching data from tables:', error);
    throw new Error('Failed to fetch data');
  }
}