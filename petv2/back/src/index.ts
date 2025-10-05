import express, {Request,Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';
import { errorHandler } from './middleware/errorHandler';
import db from '../src/models';

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

// נתיבים
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
})

db.sequelize.authenticate({alter:true}).
  then(() => {
  console.log('Database synced');
  console.log(`Database connected successfully on port:${process.env.DB_PORT}`);
}).catch((error: Error) => {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  });