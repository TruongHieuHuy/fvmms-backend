import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const issues: ZodIssue[] = err.issues;
        const messages = issues.map((e) => e.message).join(', ');
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: messages, details: issues },
        });
      }
      // Pass on other kinds of errors
      next(err as Error);
    }
  };
};
