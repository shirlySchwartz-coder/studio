import { Router , Request, Response, NextFunction} from 'express';
import { verifyToken, checkRole } from '../middleware/auth';
import { createAnimal, getAnimals } from '../controllers/animalController';

const router = Router();
router.get('/list',
  //verifyToken, //checkRole(['can_view_public_listings']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .header('Access-Control-Expose-Headers', 'Authorization')
        .header('Authorization', req.headers['authorization'] || '')
        .json({
          animals: await getAnimals(req, res, next)
        });
    }
    catch (err: any) {
      console.error('Error in /list route:', err);
      return(err); // Pass to global error handler if needed
    }
  });


router.post('/add', verifyToken, checkRole(['can_post_animals']), 
     async (req: Request, res: Response, next: NextFunction) => { 
       try {
         res
           .status(201)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .header('Authorization', req.headers['authorization'] || '')  
           .json({
           message: 'Animal added successfully',
           animal: await createAnimal(req, res, next)
         });
       } catch (err: any) {
         console.error('Error in /add route:', err);
         if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
           return res.status(400).json({ message: err.message || 'Validation error' });
         }
         next(err); // Pass to global error handler if needed
       }
     }
   );

export default router;