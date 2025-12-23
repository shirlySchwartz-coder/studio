import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../models/UserInfo";
import db from '../Dal/dal_mysql';

// הוספת מדיה לחיה
export const addAnimalMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to add media');
    }
    const animal_id = parseInt(req.params.animalId);
    if (isNaN(animal_id)) {
      throw new Error('Invalid animal ID');
    }
    const {
      media_type = 'image',
      media_url,
      media_title,
      media_description,
      file_size_bytes,
      is_primary = 0,
    } = req.body;
    if (!media_url || !media_title) {
      throw new Error('Media URL and title are required');
    }
    // בדיקה שהחיה קיימת ושייכת למקלט של המשתמש
    const animalCheckSql = `
      SELECT id, shelter_id FROM animals WHERE id = ? AND shelter_id = ?
    `;
    const animals = await db.execute<any[]>(animalCheckSql, [animal_id]);

    if (animals.length === 0) {
      throw new Error('Animal not found');
    }

    if (req.user.roleId === 2 && animals[0].shelter_id !== req.user.shelterId) {
      throw new Error('No permissions to add media to this animal');
    }

    // אם זו תמונה ראשית, יש לבטל את התמונות הראשיות הקיימות
    if (is_primary === 1) {
      const updateOthersSql = `
        UPDATE animal_media 
        SET is_primary = 0 
        WHERE animal_id = ?
      `;
      await db.execute(updateOthersSql, [animal_id]);
    }
    // הוספת המדיה
    const insertSql = `
      INSERT INTO animal_media (
        animal_id, media_type, media_url, media_title, 
        media_description, file_size_bytes, is_primary, 
        is_approved, uploaded_by_user_id, scan_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, 'clean', NOW())
    `;

    const result = await db.execute<{ insertId: number }>(insertSql, [
      animal_id,
      media_type,
      media_url,
      media_title || null,
      media_description || null,
      file_size_bytes || null,
      is_primary,
      req.user.userId,
    ]);

    return {
      message: 'Media added successfully',
      media_id: result.insertId,
    };
  } catch (err: any) {
    console.error('Error adding animal media:', err);
    throw err;
  }
};
// קבלת כל המדיה של חיה
export const getAnimalMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const animal_id = parseInt(req.params.animalId);
    if (isNaN(animal_id)) {
      throw new Error('Invalid animal ID');
    }

    const sql = `
      SELECT 
        id,
        animal_id,
        media_type,
        media_url,
        media_title,
        media_description,
        file_size_bytes,
        is_primary,
        is_approved,
        scan_status,
        created_at
      FROM animal_media
      WHERE animal_id = ? AND is_approved = 1
      ORDER BY is_primary DESC, created_at ASC
    `;

    const media = await db.execute(sql, [animal_id]);
    return media;
  } catch (err: any) {
    console.error('Error fetching animal media:', err);
    throw err;
  }
};

// הגדרת מדיה כראשית
export const setPrimaryMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to set primary media');
    }

    const media_id = parseInt(req.params.mediaId);
    if (isNaN(media_id)) {
      throw new Error('Invalid media ID');
    }

    // קבלת פרטי המדיה והחיה
    const getMediaSql = `
      SELECT 
        am.id, am.animal_id, am.is_primary,
        a.shelter_id
      FROM animal_media am
      INNER JOIN animals a ON am.animal_id = a.id
      WHERE am.id = ?
    `;

    const mediaList = await db.execute<any[]>(getMediaSql, [media_id]);

    if (mediaList.length === 0) {
      throw new Error('Media not found');
    }

    const media = mediaList[0];

    // בדיקת הרשאות
    if (
      req.user.roleId === 2 &&
      media.shelter_id !== req.user.shelterId
    ) {
      throw new Error('No permissions to modify this media');
    }

    // ביטול כל התמונות הראשיות הקיימות
    const updateOthersSql = `
      UPDATE animal_media 
      SET is_primary = 0 
      WHERE animal_id = ?
    `;
    await db.execute(updateOthersSql, [media.animal_id]);

    // הגדרת המדיה הנוכחית כראשית
    const updateSql = `
      UPDATE animal_media 
      SET is_primary = 1, updated_at = NOW()
      WHERE id = ?
    `;
    await db.execute(updateSql, [media_id]);

    return { message: 'Primary media set successfully' };
  } catch (err: any) {
    console.error('Error setting primary media:', err);
    throw err;
  }
};

// מחיקת מדיה
export const deleteMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to delete media');
    }

    const media_id = parseInt(req.params.mediaId);
    if (isNaN(media_id)) {
      throw new Error('Invalid media ID');
    }

    // קבלת פרטי המדיה והחיה
    const getMediaSql = `
      SELECT 
        am.id, am.animal_id, am.is_primary,
        a.shelter_id
      FROM animal_media am
      INNER JOIN animals a ON am.animal_id = a.id
      WHERE am.id = ?
    `;

    const mediaList = await db.execute<any[]>(getMediaSql, [media_id]);

    if (mediaList.length === 0) {
      throw new Error('Media not found');
    }

    const media = mediaList[0];

    // בדיקת הרשאות
    if (
      req.user.roleId === 2 &&
      media.shelter_id !== req.user.shelterId
    ) {
      throw new Error('No permissions to delete this media');
    }

    // מחיקת המדיה
    const deleteSql = `
      DELETE FROM animal_media 
      WHERE id = ?
    `;
    await db.execute(deleteSql, [media_id]);

    return { message: 'Media deleted successfully' };
  } catch (err: any) {
    console.error('Error deleting media:', err);
    throw err;
  }
};

// קבלת התמונה הראשית של חיה
export const getPrimaryMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const animal_id = parseInt(req.params.animalId);
    if (isNaN(animal_id)) {
      throw new Error('Invalid animal ID');
    }

    const sql = `
      SELECT 
        id,
        animal_id,
        media_type,
        media_url,
        media_title,
        media_description,
        created_at
      FROM animal_media
      WHERE animal_id = ? AND is_primary = 1 AND is_approved = 1
      LIMIT 1
    `;

    const media = await db.execute<any[]>(sql, [animal_id]);
    
    if (media.length === 0) {
      // אם אין תמונה ראשית, מחזירים את התמונה הראשונה
      const fallbackSql = `
        SELECT 
          id,
          animal_id,
          media_type,
          media_url,
          media_title,
          media_description,
          created_at
        FROM animal_media
        WHERE animal_id = ? AND is_approved = 1
        ORDER BY created_at ASC
        LIMIT 1
      `;
      const fallbackMedia = await db.execute(fallbackSql, [animal_id]);
      return fallbackMedia[0] || null;
    }

    return media[0];
  } catch (err: any) {
    console.error('Error fetching primary media:', err);
    throw err;
  }
};