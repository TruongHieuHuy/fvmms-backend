import { Router } from 'express';
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  changePass,
  update,
  forgotPass,
  resetPass,
} from './auth.controller';
import { validate } from '../../core/middlewares/validation.middleware';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication, registration, and management
 */

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPass);
router.post('/reset-password', validate(resetPasswordSchema), resetPass);
router.post('/refresh-token', validate(refreshTokenSchema), refresh);

// Protected routes
router.use(authenticate);

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', validate(updateProfileSchema), update);
router.put('/change-password', validate(changePasswordSchema), changePass);

export default router;
