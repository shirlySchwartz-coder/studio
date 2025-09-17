import { Router, Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

 router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
     console.log('The request:', req.body);
     try {
       const user = await login(req, res); // Removed 'next'
       //console.log('The response:', user);
       
       if (user && user.jwt && user.jwt.length > 10) {
         res
           .status(200)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .header('Authorization', user.jwt)
           .json(user);
       } else {
         res.status(401).json({ message: 'Invalid email or password' });
       }
     } catch (err: any) {
       console.error('Login route error:', err);
       res.status(err.message === 'Invalid email or password' ? 401 : 500).json({ message: err.message || 'Server error' });
     }
   });



router.post("/register",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await register(req, res, next);
        } catch (err) {
            next(err);
        }
    });

export default router;