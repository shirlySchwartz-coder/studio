import { Request, Response, NextFunction } from 'express';
import db from '../Dal/dal_mysql';
import { AuthRequest } from '../models/UserInfo';

// קבלת אפשרויות הפילטרים המהירים
export const getFilterOptions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
   
    const filterOptions = {
      energy_levels: ['נמוכה', 'בינונית', 'גבוהה', 'מאוד פעילה'],
      grooming_levels: ['נמוכה', 'בינונית', 'גבוהה'],
      housing_suitability: ['מתאים לדירה', 'צריך חצר', 'גמיש'],
    };
    return filterOptions;
  } catch (error: any) {
    throw new Error('Error getting filter options');
  }
};
// קבלת רשימת ערים (לבניית Dropdown)
export const getAllCities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sql = `
      SELECT 
        id,
        name,
        name_en,
        region
      FROM cities
      ORDER BY name
    `;

    const cities = await db.execute(sql);
    return cities;
  } catch (err: any) {
    console.error('Error fetching cities:', err);
    throw err;
  }
};
// קבלת כל התכונות הרב-ערכיות
export const getAllAttributes = async (
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

    const attributes = await db.execute(sql);
    return attributes;
  } catch (err: any) {
    console.error('Error fetching attributes:', err);
    throw err;
  }
};

// קבלת תכונות לפי קטגוריה (מקובץ ל-UI)
export const getAttributesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sql = `
      SELECT 
        category,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', id,
            'name', name,
            'description', description
          )
        ) as attributes
      FROM animal_attributes
      GROUP BY category
      ORDER BY category
    `;

    const categories = await db.execute(sql);
    return categories;
  } catch (err: any) {
    console.error('Error fetching attributes by category:', err);
    throw err;
  }
};

// ============================================================================
// PART 3: ניהול תכונות חיה (עדכון ENUMs + M:N)
// ============================================================================

// עדכון פילטרים ישירים של חיה (Energy, Grooming, Housing)
export const updateAnimalFilters = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('אין הרשאות לעדכון פילטרי חיה');
    }

    const animal_id = parseInt(req.params.animalId);
    if (isNaN(animal_id)) {
      throw new Error('מזהה חיה לא תקין');
    }

    const { energy_level, grooming_level, housing_suitability } = req.body;

    // בדיקה שהחיה קיימת ושייכת למקלט של המשתמש
    const animalCheckSql = `
      SELECT id, shelter_id 
      FROM animals 
      WHERE id = ?
    `;
    const animals = await db.execute<any[]>(animalCheckSql, [animal_id]);

    if (animals.length === 0) {
      throw new Error('חיה לא נמצאה');
    }

    if (req.user.roleId === 2 && animals[0].shelter_id !== req.user.shelterId) {
      throw new Error('אין הרשאות לעדכן חיה זו');
    }

    // בניית עדכון דינמי
    const updates: string[] = [];
    const values: any[] = [];

    if (energy_level) {
      updates.push('energy_level = ?');
      values.push(energy_level);
    }
    if (grooming_level) {
      updates.push('grooming_level = ?');
      values.push(grooming_level);
    }
    if (housing_suitability) {
      updates.push('housing_suitability = ?');
      values.push(housing_suitability);
    }

    if (updates.length === 0) {
      throw new Error('לא סופקו שדות לעדכון');
    }

    updates.push('updated_at = NOW()');
    values.push(animal_id);

    const updateSql = `UPDATE animals SET ${updates.join(', ')} WHERE id = ?`;

    const result=await db.execute(updateSql, values);

    return { message: 'פילטרי חיה עודכנו בהצלחה', result };
  } catch (err: any) {
    console.error('Error updating animal filters:', err);
    throw err;
  }
};

// הוספת תכונות רב-ערכיות לחיה (תאימות, צרכים מיוחדים וכו')
export const addAnimalAttributes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('אין הרשאות להוספת תכונות חיה');
    }

    const animal_id = parseInt(req.params.animalId);
    if (!animal_id || isNaN(animal_id)) {
      throw new Error('מזהה חיה לא תקין');
    }

    const { attribute_ids, notes } = req.body;

    if (!attribute_ids || !Array.isArray(attribute_ids) || attribute_ids.length === 0) {
      throw new Error('חובה לספק מערך מזהי תכונות');
    }

    // בדיקה שהחיה קיימת ושייכת למקלט של המשתמש
    const animalCheckSql = `
      SELECT id, shelter_id 
      FROM animals 
      WHERE id = ?
    `;
    const animals = await db.execute<any[]>(animalCheckSql, [animal_id]);

    if (animals.length === 0) {
      throw new Error('חיה לא נמצאה');
    }

    if (req.user.roleId === 2 && animals[0].shelter_id !== req.user.shelterId) {
      throw new Error('אין הרשאות לשנות חיה זו');
    }

    // הוספת תכונות (עם טיפול בכפילויות)
    const insertSql = `
      INSERT INTO animal_attribute_values (
        animal_id, attribute_id, notes, added_by_user_id, created_at
      ) VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        notes = VALUES(notes),
        added_by_user_id = VALUES(added_by_user_id)
    `;

    for (const attribute_id of attribute_ids) {
      await db.execute(insertSql, [
        animal_id,
        attribute_id,
        notes || null,
        req.user.userId,
      ]);
    }

    return {
      message: 'תכונות נוספו בהצלחה',
      added_count: attribute_ids.length,
    };
  } catch (err: any) {
    console.error('Error adding animal attributes:', err);
    throw err;
  }
};
// הסרת תכונה מחיה
export const removeAnimalAttribute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('אין הרשאות להסרת תכונות חיה');
    }

    const animal_id = parseInt(req.params.animalId);
    const attribute_id = parseInt(req.params.attributeId);

    if (isNaN(animal_id) || isNaN(attribute_id)) {
      throw new Error('מזהה חיה או תכונה לא תקין');
    }

    // בדיקה שהחיה קיימת ושייכת למקלט של המשתמש
    const animalCheckSql = `
      SELECT id, shelter_id 
      FROM animals 
      WHERE id = ?
    `;
    const animals = await db.execute<any[]>(animalCheckSql, [animal_id]);

    if (animals.length === 0) {
      throw new Error('חיה לא נמצאה');
    }

    if (req.user.roleId === 2 && animals[0].shelter_id !== req.user.shelterId) {
      throw new Error('אין הרשאות לשנות חיה זו');
    }

    // הסרת התכונה
    const deleteSql = `
      DELETE FROM animal_attribute_values 
      WHERE animal_id = ? AND attribute_id = ?
    `;

    const result = await db.execute<any>(deleteSql, [animal_id, attribute_id]);

    if (result.affectedRows === 0) {
      throw new Error('תכונה לא נמצאה עבור חיה זו');
    }

    return { message: 'תכונה הוסרה בהצלחה' };
  } catch (err: any) {
    console.error('Error removing animal attribute:', err);
    throw err;
  }
};
// קבלת כל התכונות של חיה (גם ENUMs וגם M:N)
export const getAnimalAttributes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const animal_id = parseInt(req.params.animalId);
    if (isNaN(animal_id)) {
      throw new Error('מזהה חיה לא תקין');
    }

    // קבלת פילטרים ישירים (ENUMs)
    const animalSql = `
      SELECT 
        energy_level,
        grooming_level,
        housing_suitability
      FROM animals
      WHERE id = ?
    `;

    const animalData = await db.execute<any[]>(animalSql, [animal_id]);

    // קבלת תכונות רב-ערכיות (M:N)
    const attributesSql = `
      SELECT 
        aa.id,
        aa.category,
        aa.name,
        aa.description,
        aav.notes,
        aav.created_at
      FROM animal_attribute_values aav
      INNER JOIN animal_attributes aa ON aav.attribute_id = aa.id
      WHERE aav.animal_id = ?
      ORDER BY aa.category, aa.display_order, aa.name
    `;

    const multiValueAttributes = await db.execute(attributesSql, [animal_id]);

    return {
      direct_filters: animalData[0] || {},
      multi_value_attributes: multiValueAttributes,
    };
  } catch (err: any) {
    console.error('Error fetching animal attributes:', err);
    throw err;
  }
};
// ============================================================================
// PART 4: חיפוש מהיר ומתקדם
// ============================================================================

// חיפוש חיות לפי פילטרים (מהיר + מתקדם)
export const searchAnimals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      city_id,
      species_id,
      size_id,
      gender_id,
      energy_level,
      grooming_level,
      housing_suitability,
      attribute_ids, // תכונות רב-ערכיות (תאימות וכו')
    } = req.body;

    // בניית שאילתה דינמית
    let sql = `
      SELECT DISTINCT
        a.id,
        a.name,
        a.age,
        a.image_url,
        a.energy_level,
        a.grooming_level,
        a.housing_suitability,
        sp.name AS species,
        g.name AS gender,
        sz.name AS size,
        s.name AS shelter_name,
        c.name AS city_name,
        a.description,
        a.is_neutered,
        a.is_house_trained,
        a.vaccination_status
      FROM animals a
      INNER JOIN species sp ON a.species_id = sp.id
      INNER JOIN gender_types g ON a.gender_id = g.id
      INNER JOIN sizes sz ON a.size_id = sz.id
      INNER JOIN shelters s ON a.shelter_id = s.id
      INNER JOIN cities c ON s.city_id = c.id
    `;

    const params: any[] = [];

    // אם יש פילטר לפי תכונות רב-ערכיות, מוסיפים JOINs
    if (attribute_ids && Array.isArray(attribute_ids) && attribute_ids.length > 0) {
      attribute_ids.forEach((attr_id: number, index: number) => {
        sql += `
          INNER JOIN animal_attribute_values aav${index} 
            ON a.id = aav${index}.animal_id 
            AND aav${index}.attribute_id = ?
        `;
        params.push(attr_id);
      });
    }

    sql += ` WHERE a.status_id = 1`; // רק חיות זמינות

    // פילטרים ישירים (מהירים - ללא JOIN)
    if (energy_level) {
      sql += ` AND a.energy_level = ?`;
      params.push(energy_level);
    }
    if (grooming_level) {
      sql += ` AND a.grooming_level = ?`;
      params.push(grooming_level);
    }
    if (housing_suitability) {
      sql += ` AND a.housing_suitability = ?`;
      params.push(housing_suitability);
    }

    // פילטרים נוספים
    if (city_id) {
      sql += ` AND s.city_id = ?`;
      params.push(city_id);
    }
    if (species_id) {
      sql += ` AND a.species_id = ?`;
      params.push(species_id);
    }
    if (size_id) {
      sql += ` AND a.size_id = ?`;
      params.push(size_id);
    }
    if (gender_id) {
      sql += ` AND a.gender_id = ?`;
      params.push(gender_id);
    }

    sql += ` ORDER BY a.created_at DESC`;

    const animals = await db.execute(sql, params);
    return animals;
  } catch (err: any) {
    console.error('Error searching animals:', err);
    throw err;
  }
};
// יצירת תכונה חדשה (אדמינים בלבד)
export const createAttribute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId !== 1) {
      throw new Error('רק אדמינים יכולים ליצור תכונות');
    }

    const { category, name, description, display_order } = req.body;

    if (!category || !name) {
      throw new Error('קטגוריה ושם הם שדות חובה');
    }

    const insertSql = `
      INSERT INTO animal_attributes (
        category, name, description, display_order
      ) VALUES (?, ?, ?, ?)
    `;

    const result = await db.execute<{ insertId: number }>(insertSql, [
      category,
      name,
      description || null,
      display_order || 0,
    ]);

    return {
      message: 'תכונה נוצרה בהצלחה',
      attribute_id: result.insertId,
    };
  } catch (err: any) {
    console.error('Error creating attribute:', err);
    throw err;
  }
};