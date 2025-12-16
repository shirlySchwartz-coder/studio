import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyToken, restrictTo } from '../middleware/auth';
import { AuthRequest } from '../models/UserInfo';
import db from '../Dal/dal_mysql';
import { v4 as uuidv4 } from 'uuid';

const uploadRouter = Router();
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('סוג קובץ לא מתאים'));
  }
};

const getStorage = (
  shelterId: number,
  animalId?: number,
  isTemp: boolean = false
) => {
  let uploadDir: string;
  if (isTemp) {
    const tempId = uuidv4();
    uploadDir = path.join(
      __dirname,
      '../../public/uploads/shelters',
      shelterId.toString(),
      'temp',
      tempId
    );
  } else if (animalId) {
    uploadDir = path.join(
      __dirname,
      '../../public/uploads/shelters',
      shelterId.toString(),
      'animals',
      animalId.toString()
    );
  } else {
    throw new Error('Missing animalId for non-temp upload');
  }
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return {
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `image-${uniqueSuffix}${ext}`);
      },
    }),
    tempId: isTemp ? uploadDir.split('/').pop() : undefined, // Return tempId for temps
  };
};

uploadRouter.post(
  '/',
  verifyToken,
  restrictTo([1, 2]),
  (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        animalId,
        isTemp = false,
        alt_text = 'Animal image',
        is_primary = false,
      } = req.body;

      if (!req.user) throw new Error('User not authenticated');

      // Cache what we need from user (TS now knows these are defined)
      const uploadedByUserId = req.user.userId;
      const userRoleId = req.user.roleId;
      const userShelterId = req.user.shelterId;

      const effectiveShelterId = userShelterId ?? (userRoleId === 1 ? 0 : null);
      if (effectiveShelterId === null)
        throw new Error('No shelter associated with user');

      const { storage, tempId } = getStorage(
        effectiveShelterId,
        animalId ? parseInt(animalId) : undefined,
        isTemp
      );

      const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
      }).single('image');

      upload(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file)
          return res.status(400).json({ error: 'No file uploaded' });

        const fileName = req.file.filename;
        const url = `${req.protocol}://${req.get(
          'host'
        )}/uploads/shelters/${effectiveShelterId}${
          isTemp ? `/temp/${tempId}` : `/animals/${animalId}`
        }/${fileName}`;

        if (!isTemp && animalId) {
          await db.execute(
            'INSERT INTO animal_media (animal_id, media_type, url, alt_text, is_primary, uploaded_at, uploaded_by_user_id) VALUES (?, "image", ?, ?, ?, NOW(), ?)',
            [animalId, url, alt_text, is_primary ? 1 : 0, uploadedByUserId]
          );
        }

        res.status(200).json({
          imageUrl: url,
          tempId: isTemp ? tempId : undefined,
          filename: fileName,
          message: 'תמונה הועלתה בהצלחה',
        });
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Error handling middleware for multer
uploadRouter.use((error: any, req: Request, res: Response, next: any) => {
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
});

export { uploadRouter };
