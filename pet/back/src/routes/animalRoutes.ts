import { Router } from 'express';
import { verifyToken, checkRole } from '../middleware/auth';
import { createAnimal, getAnimals } from '../controllers/animalController';

const router = Router();
router.post('/', verifyToken, checkRole(['can_post_animals']), createAnimal);
router.get('/', verifyToken, checkRole(['can_view_public_listings']), getAnimals);

export default router;