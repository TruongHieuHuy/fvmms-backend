"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validation_middleware_1 = require("../../core/middlewares/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("../../core/middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication, registration, and management
 */
// Public routes
router.post('/register', (0, validation_middleware_1.validate)(auth_validation_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, validation_middleware_1.validate)(auth_validation_1.loginSchema), auth_controller_1.login);
router.post('/forgot-password', (0, validation_middleware_1.validate)(auth_validation_1.forgotPasswordSchema), auth_controller_1.forgotPass);
router.post('/reset-password', (0, validation_middleware_1.validate)(auth_validation_1.resetPasswordSchema), auth_controller_1.resetPass);
router.post('/refresh-token', (0, validation_middleware_1.validate)(auth_validation_1.refreshTokenSchema), auth_controller_1.refresh);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.post('/logout', auth_controller_1.logout);
router.get('/me', auth_controller_1.getMe);
router.put('/profile', (0, validation_middleware_1.validate)(auth_validation_1.updateProfileSchema), auth_controller_1.update);
router.put('/change-password', (0, validation_middleware_1.validate)(auth_validation_1.changePasswordSchema), auth_controller_1.changePass);
exports.default = router;
//# sourceMappingURL=auth.route.js.map