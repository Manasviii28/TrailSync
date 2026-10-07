import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during dev
      }
    },
    credentials: true,
  })
);

// API Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TrailSync Backend API running smoothly' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TrailSync Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
