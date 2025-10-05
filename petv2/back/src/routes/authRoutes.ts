import {Request,Response, NextFunction, Router } from 'express';
import { register, login } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register', register);

authRouter.post('/login',
    async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            console.log(req.body);
            const user = await login(req, res,next);
            if (user && user.token.length > 10) {
                res.status(200)
                .header('Access-Control-Request-Headers', 'Authorization')
                    .header('Authorization', `Bearer ${user.token}`)
                .json(user)
            } else {
                res.status(401).json({message:'Invalid Email or password'})
            }
            
        } catch (error:any) {
            console.log('Error', error)
            res.status(
                error.message === 'Invalid Email or password' ? 401 : 500
            ).json({message: error.message})
        }
        
    })

export default authRouter;