"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.updateProfileSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    password: zod_1.z.string().min(6),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    role: zod_1.z.enum(['admin', 'government', 'fleet_owner', 'fisherman']),
});
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().nonempty(),
    password: zod_1.z.string().nonempty(),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().nonempty(),
    newPassword: zod_1.z.string().min(6),
});
exports.updateProfileSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().nonempty(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().nonempty(),
    newPassword: zod_1.z.string().min(6),
});
//# sourceMappingURL=auth.validation.js.map