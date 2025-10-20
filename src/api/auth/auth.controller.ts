import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
} from './auth.service';
import { logError, logInfo } from '../../core/utils/logger.util';
import { AuthRequest } from '../../core/middlewares/auth.middleware';

// Đăng ký user mới
export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    logInfo(`User registered: ${result.username}`);
    res.status(201).json({ success: true, data: result, message: 'User registered successfully' });
  } catch (error: any) {
    logError('Registration failed:', error);
    const status = typeof error?.status === 'number' ? error.status : 400;
    res
      .status(status)
      .json({ success: false, error: { code: 'REGISTRATION_ERROR', message: error.message } });
  }
};

// Đăng nhập
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    logInfo(`User logged in: ${username}`);
    res.json({ success: true, data: result, message: 'Login successful' });
  } catch (error: any) {
    logError('Login failed:', error);
    const status = typeof error?.status === 'number' ? error.status : 401;
    res
      .status(status)
      .json({ success: false, error: { code: 'LOGIN_ERROR', message: error.message } });
  }
};

// Đăng xuất
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await logoutUser(userId);
      logInfo(`User logged out: ${userId}`);
    }
    res.json({ success: true, message: 'Logout successful' });
  } catch (error: any) {
    logError('Logout failed:', error);
    res.status(500).json({ success: false, error: { code: 'LOGOUT_ERROR', message: error.message } });
  }
};

// Refresh Token
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    const result = await refreshToken(token);
    res.json({ success: true, data: result, message: 'Token refreshed successfully' });
  } catch (error: any) {
    logError('Token refresh failed:', error);
    res.status(401).json({ success: false, error: { code: 'REFRESH_TOKEN_ERROR', message: error.message } });
  }
};

// Get Current User
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'User ID is missing' } });
    }
    const user = await getCurrentUser(userId);
    res.json({ success: true, data: user, message: 'Current user fetched successfully' });
  } catch (error: any) {
    logError('Get current user failed:', error);
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
  }
};

// Change Password
export const changePass = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'User ID is missing' } });
    }
    const { oldPassword, newPassword } = req.body;
    await changePassword(userId, oldPassword, newPassword);
    logInfo(`Password changed for user: ${userId}`);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    logError('Change password failed:', error);
    const status = typeof error?.status === 'number' ? error.status : 400;
    res
      .status(status)
      .json({ success: false, error: { code: 'CHANGE_PASSWORD_ERROR', message: error.message } });
  }
};

// Update Profile
export const update = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'User ID is missing' } });
    }
    const result = await updateProfile(userId, req.body);
    logInfo(`Profile updated for user: ${userId}`);
    res.json({ success: true, data: result, message: 'Profile updated successfully' });
  } catch (error: any) {
    logError('Update profile failed:', error);
    res.status(400).json({ success: false, error: { code: 'UPDATE_PROFILE_ERROR', message: error.message } });
  }
};

// Forgot Password
export const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.json({ success: true, data: result, message: 'Forgot password email sent' });
  } catch (error: any) {
    logError('Forgot password failed:', error);
    res.status(404).json({ success: false, error: { code: 'FORGOT_PASSWORD_ERROR', message: error.message } });
  }
};

// Reset Password
export const resetPass = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    res.json({ success: true, message: 'Password has been reset' });
  } catch (error: any) {
    logError('Reset password failed:', error);
    res.status(400).json({ success: false, error: { code: 'RESET_PASSWORD_ERROR', message: error.message } });
  }
};
