import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

// Extend Express Request to add User information
export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

// Middleware Auth JWT
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid token',
        },
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, error: { code: 'FORBIDDEN', message: 'Invalid or expired token' } });
  }
};

// Middleware check role (Use after Authenticate)
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permission' } });
    }
    next();
  };
};
