import { Router, Request, Response } from "express";
import multer from 'multer'
import path from 'path'
import { verifyToken } from "../middleware/auth";
import fs from 'fs';

const uploadRouter = Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Uploads directory created at:', uploadDir);
}

const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) => {
        cb(null, uploadDir);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    }
});
// File filter - only images
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null,true)
    } else {
                cb(new Error('סוג קובץ לא מתאים'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    }
});

// Upload endpoint
uploadRouter.post(
    '/',
    verifyToken,
    upload.single('image'),
    (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    error: 'לא נבחר קובץ',
                    message: 'No file uploaded'
                });
            }

            // Return the URL path - must match the static serving path
            const imageUrl = `/api/uploads/${req.file.filename}`;
            
            console.log('✅ Image uploaded successfully:', {
                filename: req.file.filename,
                size: req.file.size,
                path: req.file.path,
                url: imageUrl
            });

            res.status(200).json({ 
                imageUrl,
                filename: req.file.filename,
                message: 'תמונה הועלתה בהצלחה'
            });
        } catch (error: any) {
            console.error('❌ Upload error:', error);
            res.status(500).json({ 
                error: error.message || 'שגיאה בהעלאת התמונה',
                message: 'Failed to upload image'
            });
        }
    })

    // Error handling middleware for multer
uploadRouter.use((error: any, req: Request, res: Response, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'גודל הקובץ גדול מדי. מקסימום 5MB',
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({ 
            error: error.message,
            message: 'שגיאה בהעלאת הקובץ'
        });
    }
    
    if (error) {
        return res.status(400).json({ 
            error: error.message,
            message: 'שגיאה בהעלאת התמונה'
        });
    }
    
    next();
});

    export {uploadRouter}