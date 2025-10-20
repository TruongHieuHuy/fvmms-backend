import { Request, Response, NextFunction } from 'express';
import { logError } from '../utils/logger.util';

// Middleware xử lý lỗi chung
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logError(`Error on ${req.method} ${req.path}:`, err);

  const isDev = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    success: false,
    error: { 
      code: err.code || 'INTERNAL_ERROR', 
      message: err.message || 'Internal server error',
      ...(isDev && { stack: err.stack }), 
    },
  });
};
