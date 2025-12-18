import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken, restrictTo } from '../middleware/auth';
import { uploadImage } from '../controllers/uploadController'; // Import the controller function
import multer from 'multer';

const uploadRouter = Router();

uploadRouter.post(
  '/',
  verifyToken,
  restrictTo([1, 2]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await uploadImage(req ,res, next); // Call controller logic
      res.status(200).json(result);
    } catch (err: any) {
      next(err);
    }
  }
);

// Error handling middleware for multer (moved from original, but calls next for controller to handle if needed)
uploadRouter.use(
  (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'גודל הקובץ גדול מדי. מקסימום 5MB',
          message: 'File too large. Maximum size is 5MB.',
        });
      }
      return res.status(400).json({
        error: error.message,
        message: 'שגיאה בהעלאת הקובץ',
      });
    }

    if (error) {
      return res.status(400).json({
        error: error.message,
        message: 'שגיאה בהעלאת התמונה',
      });
    }

    next();
  }
);

export { uploadRouter };
