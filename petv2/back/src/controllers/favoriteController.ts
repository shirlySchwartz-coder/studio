import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../models/UserInfo';
import db from '../Dal/dal_mysql';

// הוספת חיה למועדפים
export const addFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
        console.log(req.body);

     if (!req.user || !req.user.userId) {
       throw new Error('User not authenticated');
     }
    const user_id = req.user.userId;
    const  animal_id  = parseInt(req.body.animalId);
    if (!animal_id) {
      throw new Error('Animal ID is required');
    }



    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H1',
        location: 'favoriteController.ts:addFavorite',
        message: 'addFavorite entry',
        data: { userId: user_id, animalId: animal_id },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // בדיקה שהחיה קיימת
    const animalCheckSql = `
      SELECT id, name, status_id 
      FROM animals 
      WHERE id = ?
    `;
    const animals = await db.execute<any[]>(animalCheckSql, [animal_id]);
    if (animals.length === 0) {
      throw new Error('Animal not found');
    }
    // ניסיון להוסיף למועדפים (אם כבר קיים, ה-UNIQUE KEY ימנע כפילות)

    const insertSql = `
      INSERT INTO user_favorites (user_id, animal_id, created_at)
      VALUES (?, ?, NOW())
    `;

    try {
      await db.execute(insertSql, [user_id, animal_id]);
      return { message: 'Animal added to favorites successfully' };
    } catch (err: any) {
      // אם זה שגיאת duplicate key, החיה כבר במועדפים
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error('Animal is already in favorites');
      }
      throw err;
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

// הסרת חיה מהמועדפים
export const removeFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const animal_id = parseInt(req.params.animalId);
    if (isNaN(animal_id)) {
      throw new Error('Invalid animal ID');
    }

    const user_id = req.user.userId;

    const deleteSql = `
      DELETE FROM user_favorites 
      WHERE user_id = ? AND animal_id = ?
    `;

    const result = await db.execute<any>(deleteSql, [user_id, animal_id]);

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H2',
        location: 'favoriteController.ts:removeFavorite',
        message: 'removeFavorite result',
        data: {
          userId: user_id,
          animalId: animal_id,
          affectedRows: (result as any)?.affectedRows,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (result.affectedRows === 0) {
      throw new Error('Favorite not found');
    }

    return { message: 'Animal removed from favorites successfully' };
  } catch (err: any) {
    console.error('Error removing favorite:', err);
    throw err;
  }
};

// קבלת כל המועדפים של משתמש
export const getUserFavorites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user_id = req.user.userId;

    const sql = `
      SELECT uf.id as favorite_id,
        uf.created_at as favorited_at,
        a.id as animal_id,
        a.name,
        a.age,
        a.image_url,
        sp.name AS species,
        g.name AS gender,
        sz.name AS size,
        ans.name AS status,
        a.status_id,
        s.name AS shelter_name,
        c.name AS shelter_city,
        a.description,
        a.is_neutered,
        a.is_house_trained,
        a.vaccination_status
      FROM user_favorites uf
      INNER JOIN animals a ON uf.animal_id = a.id
      INNER JOIN species sp ON a.species_id = sp.id
      INNER JOIN gender_types g ON a.gender_id = g.id
      INNER JOIN sizes sz ON a.size_id = sz.id
      INNER JOIN animal_statuses ans ON a.status_id = ans.id
      INNER JOIN shelters s ON a.shelter_id = s.id
      INNER JOIN cities c ON c.id=s.city_id
      WHERE uf.user_id = ?
      ORDER BY uf.created_at DESC
    `;

    const favorites = await db.execute(sql, [user_id]);

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H3',
        location: 'favoriteController.ts:getUserFavorites',
        message: 'getUserFavorites result',
        data: {
          userId: user_id,
          count: Array.isArray(favorites)
            ? (favorites as any[]).length
            : undefined,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return favorites;
  } catch (err: any) {
    console.error('Error fetching user favorites:', err);
    throw err;
  }
};

// בדיקה אם חיה נמצאת במועדפים
export const checkIsFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const animal_id = parseInt(req.params.animalId);
    if (isNaN(animal_id)) {
      throw new Error('Invalid animal ID');
    }

    const user_id = req.user.userId;

    const sql = `
      SELECT id 
      FROM user_favorites 
      WHERE user_id = ? AND animal_id = ?
    `;

    const result = await db.execute<any[]>(sql, [user_id, animal_id]);

    const is_favorite = result.length > 0;

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H4',
        location: 'favoriteController.ts:checkIsFavorite',
        message: 'checkIsFavorite result',
        data: { userId: user_id, animalId: animal_id, is_favorite },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return { is_favorite };
  } catch (err: any) {
    console.error('Error checking favorite status:', err);
    throw err;
  }
};

// קבלת מספר החיות המועדפות
export const getFavoritesCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user_id = req.user.userId;

    const sql = `
      SELECT COUNT(*) as favorites_count
      FROM user_favorites
      WHERE user_id = ?
    `;

    const result = await db.execute<any[]>(sql, [user_id]);
    const favorites_count = result[0]?.favorites_count || 0;

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'initial',
        hypothesisId: 'H5',
        location: 'favoriteController.ts:getFavoritesCount',
        message: 'getFavoritesCount result',
        data: { userId: user_id, favorites_count },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return { favorites_count };
  } catch (err: any) {
    console.error('Error fetching favorites count:', err);
    throw err;
  }
};
