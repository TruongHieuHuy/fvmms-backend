"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.updateProfile = exports.changePassword = exports.getCurrentUser = exports.refreshToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const db_config_1 = __importDefault(require("../../core/config/db.config"));
const hash_util_1 = require("../../core/utils/hash.util");
const jwt_util_1 = require("../../core/utils/jwt.util");
const crypto_1 = __importDefault(require("crypto"));
const transformPrismaError = (error) => {
    if (error instanceof client_1.Prisma.PrismaClientInitializationError) {
        const dbError = new Error('Database connection failed. Please ensure the database server is running.');
        dbError.status = 503;
        return dbError;
    }
    return error instanceof Error ? error : new Error(String(error));
};
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield db_config_1.default.user.findUnique({ where: { username: data.username } });
        if (existingUser)
            throw new Error('Username already exists');
        const passwordHash = yield (0, hash_util_1.hashPassword)(data.password);
        const user = yield db_config_1.default.user.create({
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
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_config_1.default.user.findUnique({ where: { username } });
        if (!user || !user.isActive)
            throw new Error('Invalid credentials or account inactive');
        const isMatch = yield (0, hash_util_1.comparePassword)(password, user.passwordHash);
        if (!isMatch)
            throw new Error('Invalid credentials');
        const token = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
        const refreshToken = (0, jwt_util_1.generateRefreshToken)({ userId: user.id, role: user.role });
        yield db_config_1.default.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date(), refreshToken },
        });
        return {
            token,
            refreshToken,
            user: { userId: user.id, username: user.username, email: user.email, role: user.role },
        };
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.loginUser = loginUser;
const logoutUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_config_1.default.user.update({ where: { id: userId }, data: { refreshToken: null } });
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.logoutUser = logoutUser;
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jwt_util_1.verifyRefreshToken)(token);
        const user = yield db_config_1.default.user.findFirst({
            where: { id: decoded.userId, refreshToken: token },
        });
        if (!user)
            throw new Error('Invalid refresh token');
        const newAccessToken = (0, jwt_util_1.generateToken)({ userId: user.id, role: user.role });
        return { token: newAccessToken };
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.refreshToken = refreshToken;
const getCurrentUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_config_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const { passwordHash, refreshToken, resetPasswordToken, resetPasswordExpires } = user, userWithoutSensitiveData = __rest(user, ["passwordHash", "refreshToken", "resetPasswordToken", "resetPasswordExpires"]);
        return userWithoutSensitiveData;
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.getCurrentUser = getCurrentUser;
const changePassword = (userId, oldPass, newPass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_config_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const isMatch = yield (0, hash_util_1.comparePassword)(oldPass, user.passwordHash);
        if (!isMatch)
            throw new Error('Incorrect old password');
        const passwordHash = yield (0, hash_util_1.hashPassword)(newPass);
        yield db_config_1.default.user.update({ where: { id: userId }, data: { passwordHash } });
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.changePassword = changePassword;
const updateProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_config_1.default.user.update({ where: { id: userId }, data });
        const { passwordHash, refreshToken, resetPasswordToken, resetPasswordExpires } = user, userWithoutSensitiveData = __rest(user, ["passwordHash", "refreshToken", "resetPasswordToken", "resetPasswordExpires"]);
        return userWithoutSensitiveData;
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.updateProfile = updateProfile;
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_config_1.default.user.findFirst({ where: { email } });
        if (!user)
            throw new Error('User with that email does not exist');
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const passwordResetToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        yield db_config_1.default.user.update({
            where: { id: user.id },
            data: { resetPasswordToken: passwordResetToken, resetPasswordExpires: passwordResetExpires },
        });
        // In a real app, you would send an email with the resetToken
        console.log(`Password reset token for ${email}: ${resetToken}`);
        return { message: 'Password reset token sent to email' };
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (token, newPass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetPasswordToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = yield db_config_1.default.user.findFirst({
            where: {
                resetPasswordToken,
                resetPasswordExpires: { gt: new Date() },
            },
        });
        if (!user)
            throw new Error('Password reset token is invalid or has expired');
        const passwordHash = yield (0, hash_util_1.hashPassword)(newPass);
        yield db_config_1.default.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                refreshToken: null, // For security, log out from all devices
            },
        });
    }
    catch (error) {
        throw transformPrismaError(error);
    }
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.service.js.map