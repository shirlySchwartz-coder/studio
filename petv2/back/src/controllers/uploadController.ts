import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../models/UserInfo';
import db from '../Dal/dal_mysql';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';

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

export const uploadImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }

  // Cache what we need from user
  const uploadedByUserId = req.user.userId;
  const userRoleId = req.user.roleId;
  const userShelterId = req.user.shelterId;

  const effectiveShelterId = userShelterId ?? (userRoleId === 1 ? 0 : null);
  if (effectiveShelterId === null) {
    throw new Error('No shelter associated with user');
  }

  // Use memory storage first, then move file after reading body fields
  const tempUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('image');

  return new Promise((resolve, reject) => {
    tempUpload(req as any, {} as any, async (err) => {
      if (err) return reject(err);
      if (!req.file) return reject(new Error('No file uploaded'));

      try {
        // Read req.body after multer
        const {
          animalId,
          isTemp = false,
          alt_text = 'Animal image',
          is_primary = false,
        } = req.body || {};

        // Determine if temp upload
        const isTempUpload =
          isTemp === true ||
          isTemp === 'true' ||
          !animalId ||
          animalId === '0' ||
          animalId === 0;

        // Get directory
        let finalDir: string;
        let tempId: string | undefined;

        if (isTempUpload) {
          tempId = uuidv4();
          finalDir = path.join(
            __dirname,
            '../../public/uploads/shelters',
            effectiveShelterId.toString(),
            'temp',
            tempId
          );
        } else if (animalId) {
          finalDir = path.join(
            __dirname,
            '../../public/uploads/shelters',
            effectiveShelterId.toString(),
            'animals',
            String(animalId)
          );
        } else {
          return reject(new Error('Missing animalId for non-temp upload'));
        }

        if (!fs.existsSync(finalDir)) {
          fs.mkdirSync(finalDir, { recursive: true });
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(req.file.originalname);
        const fileName = `image-${uniqueSuffix}${ext}`;
        const finalPath = path.join(finalDir, fileName);

        // Write file from memory to disk
        fs.writeFileSync(finalPath, req.file.buffer);

        const url = `${req.protocol}://${req.get(
          'host'
        )}/uploads/shelters/${effectiveShelterId}${
          isTempUpload ? `/temp/${tempId}` : `/animals/${animalId}`
        }/${fileName}`;

        // Agent log (as in original)
        fetch(
          'http://127.0.0.1:7243/ingest/ba661516-14f1-4506-a49a-cbaf3e4dfb23',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: 'debug-session',
              runId: 'initial',
              hypothesisId: 'B1_uploads_url',
              location: 'uploadController.ts:uploadImage',
              message: 'Generated upload URL for file',
              data: {
                url,
                isTemp: isTempUpload,
                effectiveShelterId,
                animalId,
              },
              timestamp: Date.now(),
            }),
          }
        ).catch(() => {});

        // Save to animal_media if not temp (refined query with error handling)
        if (!isTempUpload && animalId) {
          const insertMediaSql = `
            INSERT INTO animal_media 
            (animal_id, media_type, url, alt_text, is_primary, uploaded_at, uploaded_by_user_id) 
            VALUES (?, "image", ?, ?, ?, NOW(), ?)
          `;
          const mediaResult = await db.execute(insertMediaSql, [
            animalId,
            url,
            alt_text,
            is_primary ? 1 : 0,
            uploadedByUserId,
          ]);

          if (!mediaResult || !(mediaResult as any).affectedRows) {
            throw new Error('Failed to insert into animal_media');
          }
        }

        resolve({
          imageUrl: url,
          tempId: isTempUpload ? tempId : undefined,
          filename: fileName,
          message: 'תמונה הועלתה בהצלחה',
        });
      } catch (error: any) {
        reject(error);
      }
    });
  });
};
