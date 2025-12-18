import { Request, Response, NextFunction, Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { createToken } from '../middleware/auth';
import { AuthRequest } from '../models/UserInfo';
const authRouter = Router();

authRouter.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await login(req, res, next);
      if (!user || !user.userId) {
        throw new Error('Login failed');
      }

      // Populate req.user so createToken has the required payload
      const authReq = req as AuthRequest;
      authReq.user = {
        userId: user.userId,
        fullName: user.fullName,
        roleId: user.roleId,
        shelterId: user.shelterId || 0,
      };

      const newToken = createToken(authReq, res, next);
      const tokenValue = newToken.replace('Bearer ', '').trim(); // Remove 'Bearer ' prefix and any whitespace

      // #region agent log
      fetch(
        'http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'debug-session',
            runId: 'initial',
            hypothesisId: 'B5_login_setCookie',
            location: 'authRoutes.ts:/login',
            message: 'Setting token cookie after login',
            data: {
              tokenLength: tokenValue.length,
              hasToken: !!tokenValue,
              userId: user.userId,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion

      res.cookie('token', tokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600000,
      }); // 1 hour

      console.log(`${user.fullName} התחבר בהצלחה`);

      res.status(200).json({
        user: {
          userId: user.userId,
          fullName: user.fullName,
          roleId: user.roleId,
          shelterId: user.shelterId,
        },
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

authRouter.get(
  '/me',
 async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getMe(req,res,next);
    const newToken = createToken(req as any, res, next);
    res.cookie('token', newToken.replace('Bearer ', ''), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000,
    });
    res.status(200).json({
      user: {
          userId: user.userId,
          fullName: user.fullName,
          roleId: user.roleId,
          shelterId: user.shelterId,
        }
      });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Unauthorized' });
  }
 }
)

export default authRouter;
