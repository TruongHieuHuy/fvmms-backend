import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  phone: z.string(),
  role: z.enum(['admin', 'government', 'fleet_owner', 'fisherman']),
});

export const loginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().nonempty(),
  newPassword: z.string().min(6),
});

export const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().nonempty(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().nonempty(),
  newPassword: z.string().min(6),
});

// Export the inferred types for use in controllers and services
export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
