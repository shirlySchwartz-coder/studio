import { Request, Response, NextFunction, Router } from 'express';
import { register, login } from '../controllers/authController';
const authRouter = Router();

authRouter.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await login(req, res, next);
      if (!user || !user.token) {
        throw new Error('Login failed');
      }
      console.log(`${user.fullName} 'is now logged in'`);
      res.cookie('token', user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600000,
      }); // 1 hour

      res.status(200).json({
        user,
      });
    } catch (error: any) {
      const status = error.message.includes('Invalid') ? 401 : 500;
      res.status(status).json({ message: error.message });
    }
  }
);

authRouter.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await register(req, res, next);
      if (result && result.userId) {
        res.status(201).json({
          message: result.message,
          userId: result.userId,
        });
      }
    } catch (error: any) {
      const status = error.message.includes('use') ? 409 : 400;
      res.status(status).json({ message: error.message });
    }
  }
);
authRouter.post(
  '/logout',
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.json({ message: 'Logged out successfully' });
  }
);

export default authRouter;
