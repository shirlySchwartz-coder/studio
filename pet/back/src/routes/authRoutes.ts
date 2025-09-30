import { Router, Request, Response, NextFunction } from 'express';
import { register, login } from '../controllers/authController';

const authRouter = Router();

authRouter.post(
  '/login', async (req: Request, res: Response, next: NextFunction) => {
     console.log('The request:', req.body);
     try {
       const user = await login(req, res); // Removed 'next'
       //console.log('The response:', user);
       
       if (user && user.token && user.token.length > 10) {
         res
           .status(200)
           .header('Access-Control-Expose-Headers', 'Authorization')
           .header('Authorization', `Bearer ${user.token}`)
           .json(user);
       } else {
         res.status(401).json({ message: 'Invalid email or password' });
       }
     } catch (err: any) {
       console.error('Login route error:', err);
       res.status(err.message === 'Invalid email or password' ? 401 : 500).json({ message: err.message || 'Server error' });
     }
   });



authRouter.post(
  '/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await register(req, res, next);
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Register route error:', err);
    res.status(err.message === 'Email already in use' ? 400 : 500).json({ message: err.message || 'Server error' });
  }
});

export default authRouter;