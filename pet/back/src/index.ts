import express from 'express';
import dotenv from 'dotenv';
import db from './models';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);

app.use(errorHandler);

// db.sequelize.sync({ alter: true }).then(() => {
//   console.log('Database synced');
//   app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
//   });
// }).catch((err: unknown) => console.error('DB sync error:', err));
console.log('Database connected');
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});