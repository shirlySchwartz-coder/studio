import {Request,Response, NextFunction, Router } from 'express';
import { register, login } from '../controllers/authController';
const authRouter = Router();


authRouter.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {        
       try {
           const user = await login(req, res, next);
           if (!user || !user.token) {
      throw new Error("Login failed");
    }
    res
      .status(200)
      .header("Authorization", `Bearer ${user.token}`)
      .json({
        user
      });
  } catch (error: any) {
    const status = error.message.includes("Invalid") ? 401 : 500;
    res.status(status).json({ message: error.message });
  }
    })

authRouter.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await register(req, res, next);
            if (result && result.userId) {
                res.status(201).json({
                    message: result.message,
                    userId: result.userId
                })
            }
        } catch (error:any) {
            const status = error.message.includes("use") ? 409 : 400;
            res.status(status).json({ message: error.message })
        }
    })


export default authRouter;