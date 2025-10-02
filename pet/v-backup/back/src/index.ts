import express from 'express';
import dotenv from 'dotenv';
import db from './models';
//import { sequelize } from './models';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';
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


app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);

app.use(errorHandler);

db.sequelize.authenticate().then(() =>{
  console.log('Database connected successfully');

  app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((error: Error) => {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
})
