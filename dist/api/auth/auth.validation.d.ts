import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    role: z.ZodEnum<{
        admin: "admin";
        government: "government";
        fleet_owner: "fleet_owner";
        fisherman: "fisherman";
    }>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    oldPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
