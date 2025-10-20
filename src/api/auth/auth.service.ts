import { Prisma, UserRole } from '@prisma/client';
import prisma from '../../core/config/db.config';
import { hashPassword, comparePassword } from '../../core/utils/hash.util';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../core/utils/jwt.util';
import crypto from 'crypto';

const transformPrismaError = (error: unknown): Error => {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const dbError = new Error(
      'Database connection failed. Please ensure the database server is running.',
    );
    (dbError as Error & { status?: number }).status = 503;
    return dbError;
  }

  return error instanceof Error ? error : new Error(String(error));
};

export const registerUser = async (data: {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: UserRole;
}) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { username: data.username } });
    if (existingUser) throw new Error('Username already exists');

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isActive: true,
      },
    });

    return { userId: user.id, username: user.username, role: user.role };
  } catch (error) {
    throw transformPrismaError(error);
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.isActive) throw new Error('Invalid credentials or account inactive');

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = generateToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date(), refreshToken },
    });

    return {
      token,
      refreshToken,
      user: { userId: user.id, username: user.username, email: user.email, role: user.role },
    };
  } catch (error) {
    throw transformPrismaError(error);
  }
};

export const logoutUser = async (userId: string) => {
  try {
    await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
  } catch (error) {
    throw transformPrismaError(error);
  }
};

export const refreshToken = async (token: string) => {
  try {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findFirst({
      where: { id: decoded.userId, refreshToken: token },
    });

    if (!user) throw new Error('Invalid refresh token');

    const newAccessToken = generateToken({ userId: user.id, role: user.role });

    return { token: newAccessToken };
  } catch (error) {
    throw transformPrismaError(error);
  }
};

export const getCurrentUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    const { passwordHash, refreshToken, resetPasswordToken, resetPasswordExpires, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  } catch (error) {
    throw transformPrismaError(error);
  }
};

export const changePassword = async (userId: string, oldPass: string, newPass: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(oldPass, user.passwordHash);
    if (!isMatch) throw new Error('Incorrect old password');

    const passwordHash = await hashPassword(newPass);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  } catch (error) {
    throw transformPrismaError(error);
  }
};

export const updateProfile = async (userId: string, data: { email?: string; phone?: string }) => {
  try {
    const user = await prisma.user.update({ where: { id: userId }, data });
    const { passwordHash, refreshToken, resetPasswordToken, resetPasswordExpires, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  } catch (error) {
    throw transformPrismaError(error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) throw new Error('User with that email does not exist');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: passwordResetToken, resetPasswordExpires: passwordResetExpires },
    });

    // In a real app, you would send an email with the resetToken
    console.log(`Password reset token for ${email}: ${resetToken}`);
    return { message: 'Password reset token sent to email' };

  } catch (error) {
    throw transformPrismaError(error);
  }
};  

export const resetPassword = async (token: string, newPass: string) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) throw new Error('Password reset token is invalid or has expired');

    const passwordHash = await hashPassword(newPass);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        refreshToken: null, // For security, log out from all devices
      },
    });
  } catch (error) {
    throw transformPrismaError(error);
  }
};
