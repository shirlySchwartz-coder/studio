import { NextFunction, Request, Response } from 'express';
import db from '../Dal/dal_mysql'

export const addBreed = async (req: Request, res: Response, next: NextFunction) => {
    const { breed_name } = req.body;
    if (!breed_name) {
        throw new Error('Breed name is required');
    }
  
    const sql = `INSERT INTO breeds (breed_name) VALUES (?)`;
    const result = await db.execute<{ insertId: number }>
        (sql, [breed_name]);
    return {
        message: 'Breed added successfully',
        breedId: result.insertId,
    }
}