import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRoutes, cafeRoutes, reviewRoutes, userRoutes } from '../routes';
import globalErrorHandler from '../controllers/errorController';
import { AppError } from '../services';

const expressLoader = async ({ app }) => {
  //   app.get('/status', (req, res) => { res.status(200).end(); });
  //   app.head('/status', (req, res) => { res.status(200).end(); });
  //   app.enable('trust proxy');

  // Implement CORS
  app.use(cors());

  app.options('*', cors());

  // Body parser, reading data from body into req.body
  app.use(require('morgan')('dev'));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // ...More middlewares
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/cafes', cafeRoutes);
  app.use('/api/v1/reviews', reviewRoutes);
  app.use('/api/v1/users', userRoutes);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Global Error handler
  app.use(globalErrorHandler);

  // Return the express app
  return app;
};

export default expressLoader;
