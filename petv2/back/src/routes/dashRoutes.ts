import { NextFunction, Request, Response, Router } from 'express';
import { restrictTo, verifyToken } from '../middleware/auth';
import { addAnimal, addBreed, addShelter } from '../controllers/dashController';

const dashRouter = Router();

dashRouter.post(
  '/addBreed',
  verifyToken,
  restrictTo([1, 2]), // רק מנהלים ומנהלי מערכת יכולים להוסיף גזעים
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('add-breed body:', req.body); // Now works!
      const result = await addBreed(req, res, next); // Get returned data
      const token   = 
      res.status(201).json(result); // Send it
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
   
  });

  dashRouter.post(
  '/addShelter',
  verifyToken,
  restrictTo([1, 2]), 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await addShelter(req, res, next); // Get returned data
      res.status(201).json(result); // Send it
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
   
    });
  
dashRouter.post(
    '/addAnimal',
    verifyToken,
    restrictTo([1, 2]), 
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await addAnimal(req, res, next); // Get returned data
        res.status(201).json(result); // Send it
      } catch (err: any) {
        res.status(400).json({ message: err.message });
      }
      } 
  )

 
export default dashRouter;