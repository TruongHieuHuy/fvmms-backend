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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPass = exports.forgotPass = exports.update = exports.changePass = exports.getMe = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const logger_util_1 = require("../../core/utils/logger.util");
// Đăng ký user mới
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, auth_service_1.registerUser)(req.body);
        (0, logger_util_1.logInfo)(`User registered: ${result.username}`);
        res.status(201).json({ success: true, data: result, message: 'User registered successfully' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Registration failed:', error);
        const status = typeof (error === null || error === void 0 ? void 0 : error.status) === 'number' ? error.status : 400;
        res
            .status(status)
            .json({ success: false, error: { code: 'REGISTRATION_ERROR', message: error.message } });
    }
});
exports.register = register;
// Đăng nhập
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const result = yield (0, auth_service_1.loginUser)(username, password);
        (0, logger_util_1.logInfo)(`User logged in: ${username}`);
        res.json({ success: true, data: result, message: 'Login successful' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Login failed:', error);
        const status = typeof (error === null || error === void 0 ? void 0 : error.status) === 'number' ? error.status : 401;
        res
            .status(status)
            .json({ success: false, error: { code: 'LOGIN_ERROR', message: error.message } });
    }
});
exports.login = login;
// Đăng xuất
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId) {
            yield (0, auth_service_1.logoutUser)(userId);
            (0, logger_util_1.logInfo)(`User logged out: ${userId}`);
        }
        res.json({ success: true, message: 'Logout successful' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Logout failed:', error);
        res.status(500).json({ success: false, error: { code: 'LOGOUT_ERROR', message: error.message } });
    }
});
exports.logout = logout;
// Refresh Token
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken: token } = req.body;
        const result = yield (0, auth_service_1.refreshToken)(token);
        res.json({ success: true, data: result, message: 'Token refreshed successfully' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Token refresh failed:', error);
        res.status(401).json({ success: false, error: { code: 'REFRESH_TOKEN_ERROR', message: error.message } });
    }
});
exports.refresh = refresh;
// Get Current User
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'User ID is missing' } });
        }
        const user = yield (0, auth_service_1.getCurrentUser)(userId);
        res.json({ success: true, data: user, message: 'Current user fetched successfully' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Get current user failed:', error);
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: error.message } });
    }
});
exports.getMe = getMe;
// Change Password
const changePass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'User ID is missing' } });
        }
        const { oldPassword, newPassword } = req.body;
        yield (0, auth_service_1.changePassword)(userId, oldPassword, newPassword);
        (0, logger_util_1.logInfo)(`Password changed for user: ${userId}`);
        res.json({ success: true, message: 'Password changed successfully' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Change password failed:', error);
        const status = typeof (error === null || error === void 0 ? void 0 : error.status) === 'number' ? error.status : 400;
        res
            .status(status)
            .json({ success: false, error: { code: 'CHANGE_PASSWORD_ERROR', message: error.message } });
    }
});
exports.changePass = changePass;
// Update Profile
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'User ID is missing' } });
        }
        const result = yield (0, auth_service_1.updateProfile)(userId, req.body);
        (0, logger_util_1.logInfo)(`Profile updated for user: ${userId}`);
        res.json({ success: true, data: result, message: 'Profile updated successfully' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Update profile failed:', error);
        res.status(400).json({ success: false, error: { code: 'UPDATE_PROFILE_ERROR', message: error.message } });
    }
});
exports.update = update;
// Forgot Password
const forgotPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const result = yield (0, auth_service_1.forgotPassword)(email);
        res.json({ success: true, data: result, message: 'Forgot password email sent' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Forgot password failed:', error);
        res.status(404).json({ success: false, error: { code: 'FORGOT_PASSWORD_ERROR', message: error.message } });
    }
});
exports.forgotPass = forgotPass;
// Reset Password
const resetPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        yield (0, auth_service_1.resetPassword)(token, newPassword);
        res.json({ success: true, message: 'Password has been reset' });
    }
    catch (error) {
        (0, logger_util_1.logError)('Reset password failed:', error);
        res.status(400).json({ success: false, error: { code: 'RESET_PASSWORD_ERROR', message: error.message } });
    }
});
exports.resetPass = resetPass;
//# sourceMappingURL=auth.controller.js.map