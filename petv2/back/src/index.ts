import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import path from 'path';
import { uploadRouter } from './routes/uploads';
import { adoptionRequestsRouter } from './routes/adoption-requests';
import animalRouter from './routes/animalRoutes';
import dashRouter from './routes/dashRoutes';
import authRouter from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import favoritesRouter from './routes/favoritesRouter';
import animalAttributeRouter from './routes/animalAttributeRouter';
import fs from 'fs';

dotenv.config();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// הגדרת תיקיית הקבצים הסטטיים עבור העלאות
const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
// קבצים סטטיים נגישים בנתיב /uploads/...
app.use('/uploads', express.static(uploadsPath));

// נתיבי API
app.use('/api/auth', authRouter);
app.use('/api/animals', animalRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/dashboard', dashRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/animalAttributeRouter', animalAttributeRouter);
app.use(errorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  console.log(
    `✅ Static files served from: http://localhost:${process.env.PORT}/uploads`
  );
});
