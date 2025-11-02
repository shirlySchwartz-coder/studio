import express, {Request,Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import path from 'path';
import { uploadRouter } from './routes/uploads';
import { adoptionRequestsRouter } from './routes/adoption-requests';
import animalRouter from './routes/animalRoutes';
import dashRouter from './routes/dashRoutes';
import authRouter from './routes/authRoutes';
//import sizeRoutes from './routes/sizeRoutes';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
}));

app.use(express.json());
// הגדרת תיקיית הקבצים הסטטיים
app.use('/uploads', express.static(path.join(__dirname,'..', 'public','uploads')));
// נתיבים
app.use('/api/auth', authRouter);
app.use('/api/animals', animalRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/dashboard', dashRouter);
//app.use('/api/adoption-requests', adoptionRequestsRouter);
app.use(errorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
    console.log(`✅ Static files served from: http://localhost:${process.env.PORT}/public/uploads`);
  });