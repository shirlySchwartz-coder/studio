import express ,{ Request,Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import db from './models';
//import { sequelize } from './models';
import { errorHandler } from './middleware/errorHandler';
import  authRouter  from './routes/authRoutes';
import animalsRouter from './routes/animalRoutes';
import { uploadRouter } from './routes/upload';
import cors from 'cors';

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

app.use('/api/auth', authRouter);
app.use('/api/animals', animalsRouter);
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

// Use the error handling middleware
app.use(errorHandler);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});


db.sequelize.authenticate().
  then(() => {
  console.log('Database connected successfully');
}).catch((error: Error) => {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  });