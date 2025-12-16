import { Router, Request, Response, NextFunction } from 'express';
const animalAttributeRouter = Router();
import { AuthRequest } from '../models/UserInfo';
import { getFilterOptions } from '../controllers/animalAttributeController';

animalAttributeRouter.get(
  '/filter-options',
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await getFilterOptions(req, res, next);
      res.status(200).json({ filterOptions: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

export default animalAttributeRouter;
