import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@org/models';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['*'];
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

export const sendSuccess = <T>(res: Response, data: T, message?: string) => {
  const response: ApiResponse<T> = { data, success: true, message };
  res.json(response);
};

export const sendError = (res: Response, error: string, status = 500) => {
  const response: ApiResponse<null> = { data: null, success: false, error };
  res.status(status).json(response);
};
