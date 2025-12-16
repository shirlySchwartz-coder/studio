import { Request, Response, NextFunction } from 'express';
import db from '../Dal/dal_mysql';
import { AuthRequest } from '../models/UserInfo';

export const getFilterOptions = async (
  req: AuthRequest,
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
    throw new Error('Error getting filter options');
  }
};
